import { productSlug } from "@/lib/catalog";
import { getCategories, getProducts } from "@/lib/medusa/catalog";

const SITE = "https://houseofsirka.com";

const STATIC_PAGES = [
  "", "/shop", "/collections", "/about", "/contact", "/faq",
  "/size-guide", "/shipping", "/returns", "/privacy", "/terms",
];

export default async function sitemap() {
  // Built from the live catalogue, so a piece added in the Medusa admin is
  // submitted to search engines on the next build rather than waiting for
  // someone to remember to edit a hardcoded list.
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return [
    ...STATIC_PAGES.map((path) => ({
      url: `${SITE}${path}`,
      changeFrequency: path === "" ? "daily" : "monthly",
      priority: path === "" ? 1 : 0.5,
    })),
    ...categories.map((category) => ({
      url: `${SITE}/collections/${category.toLowerCase()}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: `${SITE}/products/${productSlug(product)}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
