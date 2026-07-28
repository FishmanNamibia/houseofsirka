import CollectionsIndex from "@/components/shop/CollectionsIndex";

export const metadata = {
  title: "Collections",
  description:
    "The Garden Salon, Evening Edit, Workroom, Resort Sets and Essentials — the House of Sirka collections.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return <CollectionsIndex />;
}
