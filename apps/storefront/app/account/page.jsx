import AccountView from "@/components/shop/AccountView";
import { getProducts } from "@/lib/medusa/catalog";

export const metadata = {
  title: "Account",
  description: "Track your House of Sirka orders, payment status and wishlist.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: true },
};

export default async function AccountPage() {
  return <AccountView products={await getProducts()} />;
}
