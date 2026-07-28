"use client";

import { useEffect, useState } from "react";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import Sheet from "@/components/ui/Sheet";

const NAV = [
  { label: "Shop", href: "#catalog" },
  { label: "Collections", href: "#collections" },
  { label: "Account", href: "#account" },
];

/**
 * Fixed three-column grid rather than flex-wrap.
 *
 * The previous header wrapped, so at 375px the logo, nav and cart stacked
 * vertically and consumed ~590px of an 812px viewport, pushing every product
 * below the fold. A grid cannot stack, so the header stays 56px on mobile.
 *
 * The logo is also smaller and appears once. It used to render twice — here and
 * again as a wordmark in the hero.
 */
export default function SiteHeader({ announcement, cartCount = 0, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // An in-page anchor should not leave the drawer covering the target.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [menuOpen]);

  return (
    <>
      {announcement && (
        <div className="bg-garden-700 px-4 py-2 text-center text-body-sm font-semibold text-white">
          {announcement}
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-brass-200 bg-ink-50/90 backdrop-blur-xl">
        <div className="mx-auto grid h-14 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 md:h-20 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="grid h-11 w-11 place-items-center rounded-md text-ink-800 transition hover:bg-wine-50 hover:text-wine-600 md:hidden"
          >
            <Menu size={22} />
          </button>

          <nav className="hidden items-center gap-1 text-body-sm font-semibold md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-ink-800 transition hover:bg-wine-50 hover:text-wine-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a href="#top" className="justify-self-center" aria-label="House of Sirka — home">
            <img
              src="/house-of-sirka-logo-final.png"
              alt="House of Sirka"
              className="h-8 w-auto md:h-12"
            />
          </a>

          <div className="flex items-center justify-end gap-1">
            <a
              href="#account"
              aria-label="Wishlist"
              className="hidden h-11 w-11 place-items-center rounded-md text-ink-800 transition hover:bg-wine-50 hover:text-wine-600 md:grid"
            >
              <Heart size={20} />
            </a>
            <button
              type="button"
              onClick={onCartOpen}
              aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              className="relative grid h-11 w-11 place-items-center rounded-md text-ink-800 transition hover:bg-wine-50 hover:text-wine-600"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-wine-600 px-1 text-micro text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} side="left" title="Menu" id="mobile-nav">
        <nav className="overflow-auto px-5 py-4" aria-label="Mobile">
          <ul className="grid gap-1">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-body font-semibold text-ink-800 transition hover:bg-wine-50 hover:text-wine-600"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-brass-200 px-5 py-4 text-body-sm text-ink-600">
          Windhoek atelier · free delivery over N$1,500
        </div>
      </Sheet>
    </>
  );
}
