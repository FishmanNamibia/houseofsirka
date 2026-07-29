import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getCategories, getProducts } from "@/lib/medusa/catalog";
import CollectionView from "@/components/shop/CollectionView";

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.toLowerCase() }));
}

/** URLs are lowercase; the display name comes from the catalogue itself. */
async function label(slug) {
  const categories = await getCategories();
  return categories.find((c) => c.toLowerCase() === slug) || null;
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const name = await label(category);
  if (!name) return { title: "Collection" };

  return {
    title: name,
    description: `${name} from the House of Sirka workroom in Windhoek — classical silhouettes, held in depth across sizes.`,
    alternates: { canonical: `/collections/${category}` },
  };
}

export default async function CollectionPage({ params }) {
  const { category } = await params;
  const name = await label(category);
  if (!name) notFound();

  const products = await getProducts();

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { label: "Home", href: "/" },
          { label: name, href: `/collections/${category}` },
        ]}
      />
      <CollectionView
        category={name}
        seedProducts={products.filter((p) => p.category === name)}
        products={products}
      />
    </>
  );
}
