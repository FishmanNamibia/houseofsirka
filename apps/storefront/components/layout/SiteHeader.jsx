"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Mail, Menu, MessageCircle, Phone, Search, ShoppingBag } from "lucide-react";
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
 * Three bands, in the order shoppers expect them:
 *
 *   1. a slim utility strip carrying the delivery promise and how to reach the
 *      workroom — the details that otherwise clutter the footer
 *   2. the main bar: logo left, navigation centred, actions right
 *   3. a focus-trapped drawer standing in for the nav on small screens
 *
 * Laid out on a grid rather than flex-wrap so the bar cannot stack on a phone;
 * it stays 56px there and 80px from md.
 */
export default function SiteHeader({ announcement, settings = {}, cartCount = 0, onCartOpen, onSearchOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);
  const whatsapp = String(settings.whatsappNumber || "").replace(/[^0-9]/g, "");

  return (
    <>
      <div className="border-b border-brass-200 bg-wine-800 text-white">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 md:px-8 xl:px-12">
          <p className="text-caption text-white/90">{announcement}</p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-caption">
            {whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/90 transition hover:text-white hover:underline"
                >
                  <MessageCircle size={13} aria-hidden="true" /> WhatsApp
                </a>
              </li>
            )}
            {settings.storePhone && (
              <li>
                <a
                  href={`tel:${settings.storePhone.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center gap-1.5 text-white/90 transition hover:text-white hover:underline"
                >
                  <Phone size={13} aria-hidden="true" />
                  <span className="tabular">{settings.storePhone}</span>
                </a>
              </li>
            )}
            {settings.supportEmail && (
              <li className="hidden sm:block">
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="inline-flex items-center gap-1.5 text-white/90 transition hover:text-white hover:underline"
                >
                  <Mail size={13} aria-hidden="true" /> {settings.supportEmail}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-brass-200 bg-ink-50/90 backdrop-blur-xl">
        <div className="mx-auto grid h-14 max-w-shell grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:h-20 md:gap-6 md:px-8 xl:px-12">
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

          <nav className="hidden items-center gap-2 text-body-sm font-semibold md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={classNames(
                  "rounded-md px-4 py-2 transition",
                  isActive(item.href)
                    ? "bg-wine-50 text-wine-700"
                    : "text-ink-800 hover:bg-wine-50 hover:text-wine-600",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Keeps the centre column truly centred on mobile, where the nav is
              hidden and the grid would otherwise collapse around it. */}
          <span className="md:hidden" aria-hidden="true" />

          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={onSearchOpen}
              aria-label="Search"
              className="grid h-11 w-11 place-items-center rounded-md text-ink-800 transition hover:bg-wine-50 hover:text-wine-600"
            >
              <Search size={20} />
            </button>
            <Link
              href="/wishlist"
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

        {whatsapp && (
          <div className="border-t border-brass-200 px-5 py-4">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-body-sm font-semibold text-garden-700 hover:text-wine-600"
            >
              <MessageCircle size={16} aria-hidden="true" /> Message the workroom
            </a>
          </div>
        )}
      </Sheet>
    </>
  );
}
