import { slugify } from "@/lib/format";

/**
 * Translates a Medusa product into the shape the storefront already renders.
 *
 * The alternative was rewriting every component around Medusa's response, which
 * would have meant changing the catalogue's source and the entire view layer in
 * one commit — two risks that could not be told apart when something broke.
 * Keeping the shape as the contract means this file is the only thing that has
 * to be right, and the seed data stays a working fallback rather than dead code.
 *
 * It is a translation layer, not a permanent home. As real Medusa concepts
 * arrive — price lists, inventory reservations, customer-specific pricing — the
 * honest move is to widen the shape here first and migrate components after.
 */

/**
 * Medusa lets a shop name its options anything; the storefront only understands
 * size and colour. Resolution goes through the product's own option
 * definitions rather than guessing from the value, because "Black" is a
 * plausible value for either and position is not guaranteed.
 */
function optionTitles(product) {
  return new Map((product.options || []).map((option) => [option.id, (option.title || "").toLowerCase()]));
}

function readOption(variant, titles, names) {
  const match = (variant.options || []).find((option) =>
    names.includes(option.option?.title?.toLowerCase() || titles.get(option.option_id) || ""),
  );
  return match?.value || "";
}

/**
 * Prices come back as calculated vs original. A price list of type `sale`
 * pushes calculated below original, which is exactly the storefront's
 * price/salePrice pair — so a discount set in the Medusa admin appears on the
 * site with no code change and no second place to edit it.
 */
function readPrices(variants) {
  for (const variant of variants) {
    const price = variant.calculated_price;
    if (!price || typeof price.calculated_amount !== "number") continue;

    const calculated = price.calculated_amount;
    const original = typeof price.original_amount === "number" ? price.original_amount : calculated;

    return original > calculated
      ? { price: original, salePrice: calculated }
      : { price: calculated, salePrice: null };
  }
  return { price: 0, salePrice: null };
}

/**
 * Stock. `inventory_quantity` is only returned when the publishable key maps to
 * exactly one sales channel — see the note in the backend seed. A variant that
 * does not manage inventory is genuinely unlimited rather than out of stock,
 * so it must not read as zero.
 */
function readStock(variant) {
  if (variant.manage_inventory === false) return Number.MAX_SAFE_INTEGER;
  return typeof variant.inventory_quantity === "number" ? variant.inventory_quantity : 0;
}

export function adaptProduct(product) {
  const metadata = product.metadata || {};
  const variants = product.variants || [];
  const titles = optionTitles(product);
  const { price, salePrice } = readPrices(variants);
  const images = (product.images || []).map((image) => image.url).filter(Boolean);
  const thumbnail = product.thumbnail || images[0] || "";

  return {
    // Falling back to the Medusa id keeps a product created in the admin —
    // which has no legacy id — addressable everywhere the storefront keys by id.
    id: metadata.legacy_id || product.id,
    medusaId: product.id,
    slug: product.handle || slugify(product.title),
    name: product.title,
    sku: metadata.sku || variants[0]?.sku || "",
    category: product.categories?.[0]?.name || "",
    collection: product.collection?.title || "",
    price,
    salePrice,
    image: thumbnail,
    images: images.length ? images : [thumbnail].filter(Boolean),
    description: product.description || "",
    tags: (product.tags || []).map((tag) => tag.value),
    rating: Number(metadata.rating) || 0,
    createdAt: metadata.created_at || product.created_at || "",
    // Only published products are exposed by the Store API at all, so anything
    // that reaches here is published by definition.
    status: "Published",
    variants: variants.map((variant) => ({
      // Medusa's variant id is the id everywhere now. Cart lines saved against
      // the old seed ids will not match, which only empties a stale cart —
      // acceptable, where a stale wishlist would silently lose saved pieces.
      id: variant.id,
      sku: variant.sku || "",
      size: readOption(variant, titles, ["size"]),
      color: readOption(variant, titles, ["colour", "color"]),
      stock: readStock(variant),
    })),
  };
}

export function adaptProducts(products) {
  return (products || []).map(adaptProduct);
}
