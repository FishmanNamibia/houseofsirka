import WishlistView from "@/components/shop/WishlistView";

export const metadata = {
  title: "Wishlist",
  description: "Pieces you have saved from the House of Sirka rail.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return <WishlistView />;
}
