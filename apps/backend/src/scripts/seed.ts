import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductTagsWorkflow,
  createCollectionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { readFileSync } from "fs"
import { join } from "path"

type SeedVariant = { size: string; color: string; stock: number; sku: string }
type SeedProduct = {
  handle: string
  title: string
  sku: string
  category: string
  collection: string
  price: number
  salePrice: number | null
  description: string
  images: string[]
  thumbnail: string
  tags: string[]
  createdAt: string
  variants: SeedVariant[]
}

/**
 * Seeds the House of Sirka catalogue.
 *
 * Idempotent: everything is looked up before it is created, so this can be run
 * against an existing database without duplicating records.
 *
 * `handle` is deliberately set from the storefront's existing slug. Those URLs
 * are already live and indexed — /products/liora-satin-midi-dress has to keep
 * resolving after the storefront starts reading from Medusa.
 */
export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const storeModule = container.resolve(Modules.STORE)
  const regionModule = container.resolve(Modules.REGION)
  const productModule = container.resolve(Modules.PRODUCT)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const apiKeyModule = container.resolve(Modules.API_KEY)

  const data: { products: SeedProduct[]; colors: Record<string, string> } = JSON.parse(
    readFileSync(join(__dirname, "catalog-seed.json"), "utf-8"),
  )

  logger.info(`Seeding ${data.products.length} products…`)

  // ── Remove the scaffolder's demo catalogue ──────────────────────────────
  // create-medusa-app seeds Medusa T-Shirt, Sweatshirt, Sweatpants and Shorts.
  // They are not ours and would show up in the shop.
  const demoHandles = ["t-shirt", "sweatshirt", "sweatpants", "shorts"]
  const demoProducts = (
    await productModule.listProducts({}, { select: ["id", "handle"], take: 500 })
  ).filter((p) => demoHandles.includes(p.handle))
  if (demoProducts.length) {
    await productModule.deleteProducts(demoProducts.map((p) => p.id))
    logger.info(`Removed ${demoProducts.length} scaffolder demo products`)
  }

  // Deleting a product does not cascade to its inventory. The demo catalogue
  // left twenty inventory items behind holding a million units each, which
  // would show up in stock reports and make reconciliation nonsense.
  // Resolved from the variant side: the inventory_item -> variants relation
  // does not come back through query.graph, but variant -> inventory_items does.
  const inventoryModule = container.resolve(Modules.INVENTORY)
  const { data: variantsWithInventory } = await query.graph({
    entity: "product_variant",
    fields: ["id", "inventory_items.inventory_item_id"],
  })
  const linkedItemIds = new Set(
    variantsWithInventory.flatMap(
      (v: { inventory_items?: { inventory_item_id: string }[] }) =>
        (v.inventory_items || []).map((i) => i.inventory_item_id),
    ),
  )
  const allInventoryItems = await inventoryModule.listInventoryItems(
    {},
    { select: ["id"], take: 1000 },
  )
  const orphanIds = allInventoryItems
    .filter((item) => !linkedItemIds.has(item.id))
    .map((item) => item.id)
  if (orphanIds.length) {
    await inventoryModule.deleteInventoryItems(orphanIds)
    logger.info(`Removed ${orphanIds.length} orphaned inventory items`)
  }

  // ── Store currency ──────────────────────────────────────────────────────
  // Scaffolded as EUR. Everything here is priced in Namibian dollars.
  const [store] = await storeModule.listStores()

  let [salesChannel] = await salesChannelModule.listSalesChannels({
    name: "House of Sirka",
  })
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "House of Sirka" }] },
    })
    salesChannel = result[0]
    logger.info("Created sales channel")
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [{ currency_code: "nad", is_default: true }],
        default_sales_channel_id: salesChannel.id,
      },
    },
  })
  logger.info("Store currency set to NAD")

  // ── Region ──────────────────────────────────────────────────────────────
  let [region] = await regionModule.listRegions({ name: "Namibia" })
  if (!region) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Namibia",
            currency_code: "nad",
            countries: ["na"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    region = result[0]
    logger.info("Created Namibia region (NAD)")
  }

  // ── Stock location ──────────────────────────────────────────────────────
  // One location: the Windhoek workroom. Everything ships or is collected there.
  let [stockLocation] = await stockLocationModule.listStockLocations({
    name: "Windhoek workroom",
  })
  if (!stockLocation) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Windhoek workroom",
            address: { city: "Windhoek", country_code: "NA", address_1: "Independence Avenue" },
          },
        ],
      },
    })
    stockLocation = result[0]
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocation.id, add: [salesChannel.id] },
    })
    logger.info("Created stock location")
  }

  // ── Shipping profile ────────────────────────────────────────────────────
  let [shippingProfile] = await fulfillmentModule.listShippingProfiles({ type: "default" })
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  // ── Publishable key, so the storefront can call the Store API ───────────
  let [publishableKey] = await apiKeyModule.listApiKeys({ type: "publishable" })
  if (!publishableKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: { api_keys: [{ title: "Storefront", type: "publishable", created_by: "seed" }] },
    })
    publishableKey = result[0]
    logger.info("Created publishable API key")
  }
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableKey.id, add: [salesChannel.id] },
  })

  // ── Categories and collections ──────────────────────────────────────────
  const categoryNames = [...new Set(data.products.map((p) => p.category))]
  const allCategories = await productModule.listProductCategories(
    {},
    { select: ["id", "name", "handle"], take: 200 },
  )
  const missingCategories = categoryNames.filter(
    (name) => !allCategories.some((c) => c.name === name),
  )
  if (missingCategories.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((name) => ({
          name,
          handle: name.toLowerCase(),
          is_active: true,
        })),
      },
    })
    logger.info(`Created ${missingCategories.length} categories`)
  }
  const categories = await productModule.listProductCategories(
    {},
    { select: ["id", "name", "handle"], take: 200 },
  )
  const categoryByName = new Map(categories.map((c) => [c.name, c.id]))

  const collectionNames = [...new Set(data.products.map((p) => p.collection))]
  const allCollections = await productModule.listProductCollections(
    {},
    { select: ["id", "title", "handle"], take: 200 },
  )
  const missingCollections = collectionNames.filter(
    (title) => !allCollections.some((c) => c.title === title),
  )
  if (missingCollections.length) {
    await createCollectionsWorkflow(container).run({
      input: {
        collections: missingCollections.map((title) => ({
          title,
          handle: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        })),
      },
    })
    logger.info(`Created ${missingCollections.length} collections`)
  }
  const collections = await productModule.listProductCollections(
    {},
    { select: ["id", "title", "handle"], take: 200 },
  )
  const collectionByTitle = new Map(collections.map((c) => [c.title, c.id]))

  // ── Tags ────────────────────────────────────────────────────────────────
  // Products reference tags by id, so the tag records have to exist first.
  const tagValues = [...new Set(data.products.flatMap((p) => p.tags))]
  const allTags = await productModule.listProductTags({}, { select: ["id", "value"], take: 200 })
  const missingTags = tagValues.filter((v) => !allTags.some((t) => t.value === v))
  if (missingTags.length) {
    await createProductTagsWorkflow(container).run({
      input: { product_tags: missingTags.map((value) => ({ value })) },
    })
    logger.info(`Created ${missingTags.length} tags`)
  }
  const tags = await productModule.listProductTags({}, { select: ["id", "value"], take: 200 })
  const tagIdByValue = new Map(tags.map((t) => [t.value, t.id]))

  // ── Products ────────────────────────────────────────────────────────────
  const allProducts = await productModule.listProducts(
    {},
    { select: ["id", "handle"], take: 500 },
  )
  const existingHandles = new Set(allProducts.map((p) => p.handle))
  const toCreate = data.products.filter((p) => !existingHandles.has(p.handle))

  if (!toCreate.length) {
    logger.info("All products already present; nothing to create")
  } else {
    await createProductsWorkflow(container).run({
      input: {
        products: toCreate.map((p) => {
          const sizes = [...new Set(p.variants.map((v) => v.size))]
          const colors = [...new Set(p.variants.map((v) => v.color))]

          return {
            title: p.title,
            // Matches the storefront slug so existing product URLs keep working.
            handle: p.handle,
            description: p.description,
            status: ProductStatus.PUBLISHED,
            category_ids: categoryByName.get(p.category) ? [categoryByName.get(p.category)!] : [],
            collection_id: collectionByTitle.get(p.collection),
            shipping_profile_id: shippingProfile.id,
            thumbnail: p.thumbnail,
            images: p.images.map((url) => ({ url })),
            tag_ids: p.tags.map((value) => tagIdByValue.get(value)!).filter(Boolean),
            options: [
              { title: "Size", values: sizes },
              { title: "Colour", values: colors },
            ],
            variants: p.variants.map((v) => ({
              title: `${v.size} / ${v.color}`,
              sku: v.sku,
              options: { Size: v.size, Colour: v.color },
              // Medusa expects the amount in major units for NAD.
              prices: [{ amount: p.salePrice ?? p.price, currency_code: "nad" }],
              manage_inventory: true,
            })),
            sales_channels: [{ id: salesChannel.id }],
          }
        }),
      },
    })
    logger.info(`Created ${toCreate.length} products`)
  }

  // ── Inventory levels ────────────────────────────────────────────────────
  // Stock is per variant in the source data, so each inventory item gets the
  // quantity its variant carried.
  const stockBySku = new Map<string, number>()
  data.products.forEach((p) => p.variants.forEach((v) => stockBySku.set(v.sku, v.stock)))

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })

  // Levels already set on a previous run must be skipped, not recreated —
  // Medusa treats (inventory_item, location) as unique.
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id", "location_id"],
  })
  const alreadyLevelled = new Set(
    existingLevels.map(
      (l: { inventory_item_id: string; location_id: string }) =>
        `${l.inventory_item_id}:${l.location_id}`,
    ),
  )

  const levelsToCreate = inventoryItems
    .filter((item: { sku: string }) => stockBySku.has(item.sku))
    .filter(
      (item: { id: string }) => !alreadyLevelled.has(`${item.id}:${stockLocation.id}`),
    )
    .map((item: { id: string; sku: string }) => ({
      location_id: stockLocation.id,
      inventory_item_id: item.id,
      stocked_quantity: stockBySku.get(item.sku)!,
    }))

  if (levelsToCreate.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: levelsToCreate },
    })
    logger.info(`Set stock on ${levelsToCreate.length} variants`)
  } else {
    logger.info("Stock levels already set; nothing to do")
  }

  logger.info("Seed complete.")
  logger.info(`Publishable key for the storefront: ${publishableKey.token}`)
}
