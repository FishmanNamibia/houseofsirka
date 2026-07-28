import AccountView from "@/components/shop/AccountView";

export const metadata = {
  title: "Account",
  description: "Track your House of Sirka orders, payment status and wishlist.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return <AccountView />;
}
