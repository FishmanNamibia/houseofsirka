import ConfirmationView from "@/components/shop/ConfirmationView";

export const metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
