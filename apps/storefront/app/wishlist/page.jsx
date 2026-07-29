import WishlistView from "@/components/shop/WishlistView";
import { getProducts } from "@/lib/medusa/catalog";

export const metadata = {
  title: "Wishlist",
  description: "Pieces you have saved from the House of Sirka rail.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: true },
};

export default async function WishlistPage() {
  return <WishlistView products={await getProducts()} />;
}
