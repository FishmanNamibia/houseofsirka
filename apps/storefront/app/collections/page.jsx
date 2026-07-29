import CollectionsIndex from "@/components/shop/CollectionsIndex";
import { getProducts } from "@/lib/medusa/catalog";

export const metadata = {
  title: "Collections",
  description:
    "The Garden Salon, Evening Edit, Workroom, Resort Sets and Essentials — the House of Sirka collections.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  return <CollectionsIndex products={await getProducts()} />;
}
