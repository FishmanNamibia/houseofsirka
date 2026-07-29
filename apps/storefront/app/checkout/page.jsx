import CheckoutView from "@/components/shop/CheckoutView";
import { getProducts } from "@/lib/medusa/catalog";

export const metadata = {
  title: "Checkout",
  description: "Complete your House of Sirka order — guest checkout, eWallet, EFT, PayPulse or pay on delivery.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  return <CheckoutView products={await getProducts()} />;
}
