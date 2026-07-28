import CheckoutView from "@/components/shop/CheckoutView";

export const metadata = {
  title: "Checkout",
  description: "Complete your House of Sirka order — guest checkout, PayToday, eWallet, EFT or pay on delivery.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
