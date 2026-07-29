import ConfirmationView from "@/components/shop/ConfirmationView";
import { getProducts } from "@/lib/medusa/catalog";

export const metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage() {
  return <ConfirmationView products={await getProducts()} />;
}
