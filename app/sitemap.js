import { SEED_PRODUCTS, SEED_CATEGORIES, productSlug } from "@/lib/catalog";

const SITE = "https://houseofsirka.com";

const STATIC_PAGES = [
  "", "/shop", "/collections", "/about", "/contact", "/faq",
  "/size-guide", "/shipping", "/returns", "/privacy", "/terms",
];

export default function sitemap() {
  return [
    ...STATIC_PAGES.map((path) => ({
      url: `${SITE}${path}`,
      changeFrequency: path === "" ? "daily" : "monthly",
      priority: path === "" ? 1 : 0.5,
    })),
    ...SEED_CATEGORIES.map((category) => ({
      url: `${SITE}/collections/${category.toLowerCase()}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...SEED_PRODUCTS.map((product) => ({
      url: `${SITE}/products/${productSlug(product)}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
