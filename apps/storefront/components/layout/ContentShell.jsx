import Link from "next/link";
import { ChevronRight } from "lucide-react";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { getProducts } from "@/lib/medusa/catalog";

/**
 * Chrome for the static content pages.
 *
 * These used to carry their own header and a second, simpler footer. That meant
 * two footers to keep in step, and — the real cost — no cart drawer and no
 * search on any content page, so those header icons did nothing on /about,
 * /terms and the rest. Everything now goes through StorefrontShell.
 *
 * Page bodies stay server components: children passed from a server parent are
 * still server-rendered, so the copy is real HTML with no client JS behind it.
 */
export default async function ContentShell({ title, intro, children }) {
  // Fetched here rather than in each of the eight content pages. These pages
  // show no products themselves, but they carry the same header — so the cart
  // and the search overlay would otherwise be searching a different catalogue
  // on /about than on /shop.
  const products = await getProducts();

  return (
    <StorefrontShell products={products}>
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-16 xl:px-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
          <Link href="/" className="hover:text-wine-600">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-ink-800">{title}</span>
        </nav>

        <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">{title}</h1>
        {intro && <p className="mt-4 max-w-[68ch] text-body-lg text-ink-700">{intro}</p>}

        <div className="prose-sirka mt-10 grid gap-6">{children}</div>
      </div>
    </StorefrontShell>
  );
}

export function Section({ heading, children }) {
  return (
    <section className="grid gap-3">
      <h2 className="font-display text-display-sm text-wine-800">{heading}</h2>
      <div className="grid gap-3 text-body text-ink-700 [&_a]:text-wine-600 [&_a]:underline [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </section>
  );
}
