"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreProvider, useStore } from "@/components/store/StoreProvider";
import SiteHeader from "@/components/layout/SiteHeader";

function Shell({ title, intro, children }) {
  const { store, cartCount, setCartOpen } = useStore();

  return (
    <>
      <SiteHeader
        announcement={store.content.announcement}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <main id="main" className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
          <Link href="/" className="hover:text-wine-600">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-ink-800">{title}</span>
        </nav>

        <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">{title}</h1>
        {intro && <p className="mt-4 max-w-[68ch] text-body-lg text-ink-700">{intro}</p>}

        <div className="prose-sirka mt-10 grid gap-6">{children}</div>
      </main>

      <footer className="mt-16 border-t border-brass-200 bg-ink-50 px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap gap-x-6 gap-y-2 text-body-sm text-ink-600">
          <Link href="/about" className="hover:text-wine-600">About</Link>
          <Link href="/contact" className="hover:text-wine-600">Contact</Link>
          <Link href="/size-guide" className="hover:text-wine-600">Size guide</Link>
          <Link href="/shipping" className="hover:text-wine-600">Shipping</Link>
          <Link href="/returns" className="hover:text-wine-600">Returns</Link>
          <Link href="/faq" className="hover:text-wine-600">FAQ</Link>
          <Link href="/privacy" className="hover:text-wine-600">Privacy</Link>
          <Link href="/terms" className="hover:text-wine-600">Terms</Link>
        </div>
      </footer>
    </>
  );
}

/**
 * Chrome for the static content pages. The page bodies stay server components —
 * children passed from a server parent are still server-rendered — so the copy
 * is real HTML with no client JS behind it.
 */
export default function ContentShell(props) {
  return (
    <StoreProvider>
      <Shell {...props} />
    </StoreProvider>
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
