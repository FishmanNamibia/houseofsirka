import ShopView from "@/components/shop/ShopView";
import { getProducts } from "@/lib/medusa/catalog";

export const metadata = {
  title: "Shop",
  description:
    "The full House of Sirka rail — dresses, tailoring, sets, skirts and knitwear, filterable by size, colour and price.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  return <ShopView products={await getProducts()} />;
}
