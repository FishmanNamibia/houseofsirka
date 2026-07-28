import ShopView from "@/components/shop/ShopView";

export const metadata = {
  title: "Shop",
  description:
    "The full House of Sirka rail — dresses, tailoring, sets, skirts and knitwear, filterable by size, colour and price.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopView />;
}
