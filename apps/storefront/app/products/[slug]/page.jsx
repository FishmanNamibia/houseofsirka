import { productSlug } from "@/lib/catalog";
import { getProduct, getProducts } from "@/lib/medusa/catalog";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ProductDetail from "@/components/shop/ProductDetail";

// A product added in the Medusa admin after this build was prerendered still
// has to resolve, so unknown slugs are rendered on demand rather than 404ed.
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: productSlug(product) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

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
  const products = await getProducts();
  const product = products.find((item) => productSlug(item) === slug) || null;

  return (
    <>
      {product && (
        <>
          <ProductJsonLd product={product} slug={slug} />
          <BreadcrumbJsonLd
            trail={[
              { label: "Home", href: "/" },
              { label: product.category, href: `/collections/${product.category.toLowerCase()}` },
              { label: product.name, href: `/products/${slug}` },
            ]}
          />
        </>
      )}
      {/*
        The product is passed twice on purpose. `seedProduct` is what the server
        renders and what the first client render must match exactly, so the
        markup is real indexable HTML with no hydration mismatch; `products`
        seeds the shared store so the cart, wishlist and related pieces all read
        the same catalogue.
      */}
      <ProductDetail slug={slug} seedProduct={product} products={products} />
    </>
  );
}
