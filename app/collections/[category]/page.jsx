import { notFound } from "next/navigation";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "@/lib/catalog";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import CollectionView from "@/components/shop/CollectionView";

export const dynamicParams = true;

export function generateStaticParams() {
  return SEED_CATEGORIES.map((category) => ({ category: category.toLowerCase() }));
}

function label(slug) {
  return SEED_CATEGORIES.find((c) => c.toLowerCase() === slug) || null;
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const name = label(category);
  if (!name) return { title: "Collection" };

  return {
    title: name,
    description: `${name} from the House of Sirka atelier in Windhoek — classical silhouettes, held in depth across sizes.`,
    alternates: { canonical: `/collections/${category}` },
  };
}

export default async function CollectionPage({ params }) {
  const { category } = await params;
  const name = label(category);
  if (!name) notFound();

  const seedProducts = SEED_PRODUCTS.filter((p) => p.category === name);

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { label: "Home", href: "/" },
          { label: name, href: `/collections/${category}` },
        ]}
      />
      <CollectionView category={name} seedProducts={seedProducts} />
    </>
  );
}
