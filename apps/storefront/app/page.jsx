import StorefrontShell from "@/components/layout/StorefrontShell";
import Landing from "@/components/home/Landing";
import { getProducts } from "@/lib/medusa/catalog";

/**
 * The home route is a server component so the featured rail is real HTML in the
 * first response — it is the page most likely to be someone's first impression
 * and the one search engines read first. The markup itself lives in Landing,
 * which stays a client component because it reads the shared cart and wishlist.
 */
export default async function Home() {
  return (
    <StorefrontShell products={await getProducts()}>
      <Landing />
    </StorefrontShell>
  );
}
