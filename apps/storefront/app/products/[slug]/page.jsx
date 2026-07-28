import { SEED_PRODUCTS, getSeedProduct, productSlug } from "@/lib/catalog";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ProductDetail from "@/components/shop/ProductDetail";

// Products created in the admin panel exist only in localStorage, so their
// slugs aren't known at build time. They still render — the shell hydrates and
// finds them client-side.
export const dynamicParams = true;

export function generateStaticParams() {
  return SEED_PRODUCTS.map((product) => ({ slug: productSlug(product) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getSeedProduct(slug);

  if (!product) {
    return { title: "Product", description: "A piece from the House of Sirka workroom." };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      url: `/products/${slug}`,
      images: [{ url: product.image, width: 1100, height: 1375, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const seedProduct = getSeedProduct(slug);

  return (
    <>
      {seedProduct && (
        <>
          <ProductJsonLd product={seedProduct} slug={slug} />
          <BreadcrumbJsonLd
            trail={[
              { label: "Home", href: "/" },
              { label: seedProduct.category, href: `/collections/${seedProduct.category.toLowerCase()}` },
              { label: seedProduct.name, href: `/products/${slug}` },
            ]}
          />
        </>
      )}
      <ProductDetail slug={slug} seedProduct={seedProduct} />
    </>
  );
}
