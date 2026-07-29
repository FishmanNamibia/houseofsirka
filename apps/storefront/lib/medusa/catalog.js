import { cache } from "react";
import { SEED_PRODUCTS, productSlug } from "@/lib/catalog";
import { medusa, getRegion, PUBLISHABLE_KEY } from "@/lib/medusa/client";
import { adaptProducts } from "@/lib/medusa/adapt";

/**
 * The catalogue, read from Medusa on the server.
 *
 * Everything the storefront renders about a product comes through here, so
 * pages stay unaware of where the data lives. Only the server calls it: the
 * browser gets the result as props, already prerendered, which is what makes
 * product pages indexable and cheap on a Namibian mobile connection.
 */

/**
 * Requested explicitly rather than relying on defaults. `inventory_quantity`
 * in particular is opt-in and silently absent otherwise — the storefront would
 * then read every variant as out of stock and refuse to sell anything.
 */
const PRODUCT_FIELDS = [
  "id",
  "title",
  "handle",
  "description",
  "thumbnail",
  "+metadata",
  "*images",
  "*tags",
  "*collection",
  "*categories",
  "*options",
  "*options.values",
  "*variants",
  "*variants.options",
  "*variants.calculated_price",
  "+variants.inventory_quantity",
  "+variants.manage_inventory",
].join(",");

/**
 * Falling back to the bundled seed rather than throwing.
 *
 * A storefront that 500s because the commerce backend is briefly unreachable
 * turns a recoverable backend incident into a total outage, and it would also
 * make `next build` depend on a running Medusa — which would break CI and any
 * clone of this repo. Stale prices for a few minutes are the lesser harm than
 * a dead shop, and the reason is logged so it does not pass unnoticed.
 */
function fallback(reason) {
  console.warn(
    `[catalog] Falling back to bundled seed data: ${reason}. ` +
      "Prices and stock may be stale until the backend is reachable.",
  );
  return SEED_PRODUCTS;
}

async function fetchProducts() {
  if (!PUBLISHABLE_KEY) {
    return fallback("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set");
  }

  try {
    const region = await getRegion();
    if (!region) return fallback("no region available from the backend");

    // 100 covers the current rail many times over; when it stops doing so this
    // needs paginating rather than raising, and the guard below says so out loud.
    const { products, count } = await medusa.store.product.list({
      limit: 100,
      region_id: region.id,
      fields: PRODUCT_FIELDS,
    });

    if (count > products.length) {
      console.warn(
        `[catalog] Backend has ${count} products but only ${products.length} were fetched. ` +
          "Add pagination before the catalogue grows further.",
      );
    }

    if (!products.length) return fallback("the backend returned no products");
    return adaptProducts(products);
  } catch (error) {
    return fallback(error?.message || "the request failed");
  }
}

/**
 * `cache` dedupes within a single render pass, so a page that needs both the
 * product and its related pieces makes one request rather than two.
 */
export const getProducts = cache(fetchProducts);

export async function getProduct(slug) {
  const products = await getProducts();
  return products.find((product) => productSlug(product) === slug) || null;
}

export async function getCategories() {
  const products = await getProducts();
  return [...new Set(products.map((product) => product.category).filter(Boolean))];
}

export async function getProductsInCategory(category) {
  const products = await getProducts();
  const wanted = String(category).toLowerCase();
  return products.filter((product) => product.category.toLowerCase() === wanted);
}
