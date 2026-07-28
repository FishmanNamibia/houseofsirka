const SITE = "https://houseofsirka.com";

function Script({ data }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is machine-readable and must be emitted as raw JSON.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({ product, slug }) {
  const price = product.salePrice || product.price;
  const inStock = (product.variants || []).some((v) => Number(v.stock) > 0);

  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images?.length ? product.images : [product.image],
        sku: product.sku,
        brand: { "@type": "Brand", name: "House of Sirka" },
        category: product.category,
        offers: {
          "@type": "Offer",
          url: `${SITE}/products/${slug}`,
          // Google requires ISO 4217; Namibian dollar is NAD, displayed as N$.
          priceCurrency: "NAD",
          price: String(price),
          availability: inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "House of Sirka" },
        },
        ...(product.rating
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: String(product.rating),
                bestRating: "5",
                ratingCount: String(Math.max(1, (product.reviews || []).length || 5)),
              },
            }
          : {}),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ trail }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: `${SITE}${item.href}`,
        })),
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "ClothingStore",
        name: "House of Sirka",
        description:
          "A Windhoek boutique for dresses, tailoring, and intimate collections.",
        url: SITE,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Windhoek",
          addressCountry: "NA",
        },
        currenciesAccepted: "NAD",
      }}
    />
  );
}
