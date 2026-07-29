import {
  batchPriceListPricesWorkflow,
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createPriceListsWorkflow,
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
  updatePriceListsWorkflow,
  updateProductsWorkflow,
  updateProductVariantsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  CreatePriceListWorkflowInputDTO,
  ExecArgs,
  UpdatePriceListWorkflowInputDTO,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  PriceListStatus,
  PriceListType,
  ProductStatus,
} from "@medusajs/framework/utils"
import { readFileSync } from "fs"
import { join } from "path"

const CURRENCY = "nad"

/**
 * Narrows a query.graph result to the shape that was actually requested.
 *
 * `query.graph` types its return from the entity name alone, so a selection
 * like "inventory_items.inventory_item_id" still comes back typed as the bare
 * entity — which does not declare the joined field, and whose own fields are
 * `Maybe<T>` even when they were explicitly selected. Annotating the callbacks
 * instead produced three type errors that failed `medusa build` outright.
 * Narrowing once, at the point where the query says what it asked for, keeps
 * the rest of the file honestly typed.
 */
function rows<T>(data: unknown): T[] {
  return data as T[]
}

/**
 * The markdowns live in one price list rather than one per product, because a
 * markdown is a shop-wide decision the merchandiser makes and unmakes. Looked
 * up by title on every run — price list ids are generated per database, so the
 * title is the only stable handle a seed script has.
 */
const SALE_PRICE_LIST_TITLE = "Seasonal markdowns"

type SeedVariant = { size: string; color: string; stock: number; sku: string }
type SeedProduct = {
  id: string
  handle: string
  title: string
  sku: string
  category: string
  collection: string
  price: number
  salePrice: number | null
  rating: number
  status: string
  description: string
  images: string[]
  thumbnail: string
  tags: string[]
  createdAt: string
  variants: SeedVariant[]
}

/**
 * Fields the storefront renders that Medusa has no column for.
 *
 * `legacy_id` is the id the storefront's own seed catalogue used. Wishlists are
 * already sitting in customers' localStorage keyed by it, so losing it would
 * silently empty every saved list the moment Medusa became the source of truth.
 * `created_at` is the launch date the "Newest" sort reads — Medusa's own
 * created_at is the day this script ran, which would reorder the whole rail.
 *
 * The key names are the contract with apps/storefront/lib/medusa/adapt.js.
 */
function storefrontMetadata(product: SeedProduct) {
  return {
    legacy_id: product.id,
    sku: product.sku,
    rating: product.rating,
    created_at: product.createdAt,
  }
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
    rows<{ inventory_items?: { inventory_item_id: string }[] }>(variantsWithInventory).flatMap(
      (v) => (v.inventory_items || []).map((i) => i.inventory_item_id),
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
  //
  // Matched by title, not by "first publishable key of any kind". The
  // scaffolder ships its own "Default Publishable API Key" bound to its own
  // Default Sales Channel, and taking whichever key came back first meant
  // adding our channel to that one — leaving a single key spanning two
  // channels.
  //
  // Medusa will not compute inventory availability for a key like that: it
  // cannot know which stock location to read, so /store/products with
  // +variants.inventory_quantity fails outright with "Either provide a single
  // sales channel id or configure a single sales channel in the publishable
  // key". A storefront that cannot read stock cannot show "only 2 left" or
  // refuse to sell what is not there, so this is load-bearing, not tidiness.
  let [publishableKey] = await apiKeyModule.listApiKeys({
    type: "publishable",
    title: "Storefront",
  })
  if (!publishableKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: { api_keys: [{ title: "Storefront", type: "publishable", created_by: "seed" }] },
    })
    publishableKey = result[0]
    logger.info("Created publishable API key")
  }
  // Reassert exclusivity every run, so re-seeding repairs a key that has
  // drifted rather than silently inheriting the broken state.
  const { data: keyLinks } = await query.graph({
    entity: "publishable_api_key_sales_channel",
    fields: ["sales_channel_id"],
    filters: { publishable_key_id: publishableKey.id },
  })
  const strays = keyLinks
    .map((row: { sales_channel_id: string }) => row.sales_channel_id)
    .filter((id: string) => id !== salesChannel.id)
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableKey.id, add: [salesChannel.id], remove: strays },
  })
  if (strays.length) {
    logger.info(`Unlinked ${strays.length} stray sales channel(s) from the storefront key`)
  }

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
            status:
              p.status === "Published" ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
            metadata: storefrontMetadata(p),
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
              // Medusa expects the amount in major units for NAD. Always the
              // full price: a markdown is a price list, set up further down.
              prices: [{ amount: p.price, currency_code: CURRENCY }],
              manage_inventory: true,
            })),
            sales_channels: [{ id: salesChannel.id }],
          }
        }),
      },
    })
    logger.info(`Created ${toCreate.length} products`)
  }

  // ── Repairing what already exists ───────────────────────────────────────
  //
  // Everything from here down runs over every seeded product, not just the ones
  // this run created. The first migration of this catalogue created all sixteen
  // with no metadata and with the sale price written as the only price, so a
  // create-only path would leave that database wrong forever. Each write below
  // is skipped when the stored value already matches, which is what keeps a
  // second run a no-op rather than a rewrite.
  const sourceByHandle = new Map(data.products.map((p) => [p.handle, p]))
  const seededProducts = await productModule.listProducts(
    { handle: data.products.map((p) => p.handle) },
    { select: ["id", "handle", "metadata"], relations: ["variants"], take: 500 },
  )

  const metadataUpdates = seededProducts
    .filter((product) => {
      const desired = storefrontMetadata(sourceByHandle.get(product.handle)!)
      const current = (product.metadata || {}) as Record<string, unknown>
      // Compared as rendered text, not by identity: metadata is jsonb, and a
      // rating that came back as "4.8" rather than 4.8 would report every
      // product as changed and rewrite all sixteen on every run.
      return Object.entries(desired).some(([key, value]) => String(current[key]) !== String(value))
    })
    .map((product) => ({
      id: product.id,
      metadata: storefrontMetadata(sourceByHandle.get(product.handle)!),
    }))

  if (metadataUpdates.length) {
    await updateProductsWorkflow(container).run({ input: { products: metadataUpdates } })
    logger.info(`Wrote storefront metadata onto ${metadataUpdates.length} products`)
  } else {
    logger.info("Storefront metadata already current")
  }

  // ── Prices ──────────────────────────────────────────────────────────────
  //
  // The variant's own price is always the full price. Writing the sale price
  // there instead threw the original away: nothing was left to strike through
  // on the product card, and to Medusa's reporting a markdown was
  // indistinguishable from a permanent price cut.
  const pricingModule = container.resolve(Modules.PRICING)

  // Price sets are not a relation on the variant — the link table is the only
  // way from one to the other.
  const { data: variantPriceSetLinks } = await query.graph({
    entity: "product_variant_price_set",
    fields: ["variant_id", "price_set_id"],
    filters: { variant_id: seededProducts.flatMap((p) => p.variants.map((v) => v.id)) },
  })
  const priceSetByVariant = new Map(
    variantPriceSetLinks.map((row: { variant_id: string; price_set_id: string }) => [
      row.variant_id,
      row.price_set_id,
    ]),
  )

  // One read serves both passes below. Rewriting a variant's own price does not
  // touch price list rows — Medusa scopes that replacement to prices with no
  // price_list_id — so this snapshot stays accurate for the sale list too.
  // PriceDTO models the price list as a relation, but the selected column comes
  // back flat, which is all that is needed to tell a base price from a markdown.
  type PriceRow = {
    id: string
    amount: number
    currency_code: string
    price_set_id: string
    price_list_id: string | null
  }
  const prices = (await pricingModule.listPrices(
    { price_set_id: [...priceSetByVariant.values()] },
    { select: ["id", "amount", "currency_code", "price_set_id", "price_list_id"], take: 5000 },
  )) as unknown as PriceRow[]
  const basePriceBySet = new Map(
    prices
      .filter((price) => !price.price_list_id && price.currency_code === CURRENCY)
      .map((price) => [price.price_set_id, price]),
  )

  const variantPriceUpdates = seededProducts.flatMap((product) => {
    const source = sourceByHandle.get(product.handle)!
    return product.variants
      .filter(
        (variant) =>
          Number(basePriceBySet.get(priceSetByVariant.get(variant.id)!)?.amount) !== source.price,
      )
      .map((variant) => ({
        id: variant.id,
        prices: [{ amount: source.price, currency_code: CURRENCY }],
      }))
  })

  if (variantPriceUpdates.length) {
    await updateProductVariantsWorkflow(container).run({
      input: { product_variants: variantPriceUpdates },
    })
    logger.info(`Restored the full price on ${variantPriceUpdates.length} variants`)
  } else {
    logger.info("Variant prices already at full price")
  }

  // ── Markdowns ───────────────────────────────────────────────────────────
  //
  // A discount is a price list of type `sale`. That type is what makes the
  // Store API return calculated_amount below original_amount instead of one
  // price with no history, which is the only thing the storefront needs to show
  // a struck-through original — and it leaves the markdown legible to Medusa's
  // reporting and to the admin, where it can be changed without a redeploy.
  const saleAmountByVariant = new Map<string, number>()
  seededProducts.forEach((product) => {
    const source = sourceByHandle.get(product.handle)!
    if (source.salePrice === null) return
    product.variants.forEach((variant) => saleAmountByVariant.set(variant.id, source.salePrice!))
  })

  // Price lists cannot be filtered by title — the module only offers a fuzzy `q`
  // across title and description, which would also match a list someone named
  // "Seasonal markdowns 2027". Matched exactly in memory instead; there are
  // never more than a handful of these.
  const priceLists = await pricingModule.listPriceLists({}, { take: 200 })
  let salePriceList = priceLists.find((list) => list.title === SALE_PRICE_LIST_TITLE)
  if (!salePriceList) {
    const { result } = await createPriceListsWorkflow(container).run({
      input: {
        price_lists_data: [
          {
            title: SALE_PRICE_LIST_TITLE,
            description: "Marked-down pieces. Base prices stay full so the original still shows.",
            status: PriceListStatus.ACTIVE,
            // `type` is absent from CreatePriceListWorkflowInputDTO in 2.18.0
            // — hence the cast — though the step spreads the rest of the
            // object straight into the pricing module, which does accept it.
            // Stated even though the column already defaults to `sale`,
            // because SALE is the whole mechanism: an OVERRIDE list collapses
            // original_amount onto calculated_amount and there is nothing left
            // to strike through.
            type: PriceListType.SALE,
          } as CreatePriceListWorkflowInputDTO & { type: PriceListType },
        ],
      },
    })
    salePriceList = result[0]
    logger.info(`Created the "${SALE_PRICE_LIST_TITLE}" price list`)
  } else if (
    salePriceList.status !== PriceListStatus.ACTIVE ||
    salePriceList.type !== PriceListType.SALE
  ) {
    // A list that has drifted to draft or override silently stops discounting,
    // so re-seeding repairs it rather than trusting what is there.
    await updatePriceListsWorkflow(container).run({
      input: {
        price_lists_data: [
          // `type` is passed through the same untyped route as on create above.
          { id: salePriceList.id, status: PriceListStatus.ACTIVE, type: PriceListType.SALE } as
            UpdatePriceListWorkflowInputDTO & { type: PriceListType },
        ],
      },
    })
    logger.info("Reset the markdown price list to an active sale")
  }

  const variantByPriceSet = new Map(
    [...priceSetByVariant.entries()].map(([variantId, priceSetId]) => [priceSetId, variantId]),
  )
  const existingSalePrices = prices
    .filter((price) => price.price_list_id === salePriceList.id)
    .map((price) => ({
      id: price.id,
      amount: Number(price.amount),
      variant_id: variantByPriceSet.get(price.price_set_id!)!,
    }))
  const pricedVariants = new Set(existingSalePrices.map((price) => price.variant_id))

  const batch = {
    id: salePriceList.id,
    create: [...saleAmountByVariant.entries()]
      .filter(([variantId]) => !pricedVariants.has(variantId))
      .map(([variant_id, amount]) => ({ variant_id, amount, currency_code: CURRENCY })),
    update: existingSalePrices
      .filter(
        (price) =>
          saleAmountByVariant.has(price.variant_id) &&
          saleAmountByVariant.get(price.variant_id) !== price.amount,
      )
      .map((price) => ({
        id: price.id,
        variant_id: price.variant_id,
        amount: saleAmountByVariant.get(price.variant_id)!,
        currency_code: CURRENCY,
      })),
    // A piece that came off sale has to lose its price list row, or the
    // discount outlives the decision to end it.
    delete: existingSalePrices
      .filter((price) => !saleAmountByVariant.has(price.variant_id))
      .map((price) => price.id),
  }

  if (batch.create.length || batch.update.length || batch.delete.length) {
    await batchPriceListPricesWorkflow(container).run({ input: { data: batch } })
    logger.info(
      `Markdowns: ${batch.create.length} added, ${batch.update.length} changed, ${batch.delete.length} ended`,
    )
  } else {
    logger.info(`Markdowns already correct on ${saleAmountByVariant.size} variants`)
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

  const levelsToCreate = rows<{ id: string; sku: string }>(inventoryItems)
    .filter((item) => stockBySku.has(item.sku))
    .filter((item) => !alreadyLevelled.has(`${item.id}:${stockLocation.id}`))
    .map((item) => ({
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
