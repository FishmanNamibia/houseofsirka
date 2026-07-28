"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { classNames } from "@/lib/format";
import Sheet from "@/components/ui/Sheet";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Account", href: "/account" },
];

const SECONDARY = [
  { label: "Size guide", href: "/size-guide" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Logo left, navigation beside it, actions right — the arrangement shoppers
 * expect, and the one that lets the logo double as the home link without
 * hunting for it.
 *
 * Laid out on a grid rather than flex-wrap so the header cannot stack on a
 * phone; it stays 56px there and 80px from md.
 */
export default function SiteHeader({ announcement, cartCount = 0, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer when navigation actually happens.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {announcement && (
        <div className="bg-garden-700 px-4 py-2 text-center text-body-sm font-semibold text-white">
          {announcement}
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-brass-200 bg-ink-50/90 backdrop-blur-xl">
        <div className="mx-auto grid h-14 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 md:h-20 md:gap-6 md:px-8">
          <div className="flex items-center gap-2">
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

            <Link href="/" aria-label="House of Sirka — home" className="shrink-0">
              <img
                src="/house-of-sirka-logo-final.png"
                alt="House of Sirka"
                className="h-8 w-auto md:h-12"
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-1 text-body-sm font-semibold md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={classNames(
                  "rounded-md px-3 py-2 transition",
                  isActive(item.href)
                    ? "bg-wine-50 text-wine-700"
                    : "text-ink-800 hover:bg-wine-50 hover:text-wine-600",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1">
            <Link
              href="/account"
              aria-label="Wishlist"
              className="hidden h-11 w-11 place-items-center rounded-md text-ink-800 transition hover:bg-wine-50 hover:text-wine-600 md:grid"
            >
              <Heart size={20} />
            </Link>
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
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={classNames(
                    "block rounded-md px-3 py-3 text-body font-semibold transition",
                    isActive(item.href) ? "bg-wine-50 text-wine-700" : "text-ink-800 hover:bg-wine-50 hover:text-wine-600",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-6 px-3 text-eyebrow uppercase text-ink-600">Boutique</p>
          <ul className="mt-2 grid gap-1">
            {SECONDARY.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2.5 text-body-sm text-ink-700 transition hover:bg-wine-50 hover:text-wine-600"
                >
                  {item.label}
                </Link>
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
