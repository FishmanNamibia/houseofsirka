"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { splitLines } from "@/lib/format";
import { StoreProvider, useStore } from "@/components/store/StoreProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import { CartDrawer, OrderDetailModal } from "@/components/shop/parts";
import { Toast } from "@/components/ui";

const SHOP_LINKS = [
  { label: "All pieces", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Dresses", href: "/collections/dresses" },
  { label: "Outerwear", href: "/collections/outerwear" },
  { label: "Tops", href: "/collections/tops" },
];

const HELP_LINKS = [
  { label: "Size guide", href: "/size-guide" },
  { label: "Shipping & delivery", href: "/shipping" },
  { label: "Returns & exchanges", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Track an order", href: "/account" },
];

const ATELIER_LINKS = [
  { label: "About the atelier", href: "/about" },
  { label: "Contact & fittings", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

function Shell({ children }) {
  const router = useRouter();
  const {
    store, cfg, fmt, cartSummary, cartCount,
    cartOpen, setCartOpen,
    viewingOrder, setViewingOrder,
    notice, show,
    changeCartQuantity, setStorePatch,
  } = useStore();

  return (
    <>
      <SiteHeader
        announcement={store.content.announcement}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <main id="main" className="min-h-screen bg-ink-100 text-ink-900">{children}</main>

      <footer className="bg-wine-800 text-white">
        <div className="border-b border-white/15 px-4 py-10 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-display-sm">First look at new pieces</h2>
              <p className="mt-2 max-w-[52ch] text-body-sm text-white/85">
                A short note when something reaches the rail, and when the sale rail opens. Monthly
                at most, and never your details shared.
              </p>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const email = new FormData(event.currentTarget).get("newsletterEmail");
                if (email) {
                  show(`Thank you — we'll write to ${email}.`);
                  event.currentTarget.reset();
                }
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletterEmail" className="sr-only">Email address</label>
              <input
                id="newsletterEmail"
                name="newsletterEmail"
                type="email"
                required
                placeholder="you@example.na"
                className="h-12 flex-1 rounded-md border border-white/30 bg-white/10 px-4 text-body text-white placeholder:text-white/60"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-md bg-brass-300 px-6 font-semibold text-ink-900 transition hover:bg-brass-400"
              >
                Keep me posted
              </button>
            </form>
          </div>
        </div>

        <div className="px-4 py-12 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
            <div>
              <div className="mb-4 w-44 rounded bg-ink-50 p-2">
                <img src="/house-of-sirka-logo-final.png" alt="House of Sirka" className="h-auto w-full" />
              </div>
              <p className="max-w-[44ch] text-body-sm text-white/85">{store.content.footerTagline}</p>
              <p className="mt-4 text-body-sm text-white/85">
                {cfg.storeAddress}
                <br />
                Open by appointment for fittings
              </p>
            </div>

            <nav aria-label="Shop">
              <h2 className="text-eyebrow uppercase text-white/70">Shop</h2>
              <ul className="mt-4 grid gap-2.5 text-body-sm">
                {SHOP_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/85 transition hover:text-white hover:underline">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Help">
              <h2 className="text-eyebrow uppercase text-white/70">Help</h2>
              <ul className="mt-4 grid gap-2.5 text-body-sm">
                {HELP_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/85 transition hover:text-white hover:underline">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-eyebrow uppercase text-white/70">Atelier</h2>
              <ul className="mt-4 grid gap-2.5 text-body-sm">
                {ATELIER_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/85 transition hover:text-white hover:underline">{item.label}</Link>
                  </li>
                ))}
              </ul>

              <h2 className="mt-6 text-eyebrow uppercase text-white/70">Reach us</h2>
              <ul className="mt-4 grid gap-2.5 text-body-sm text-white/85">
                {cfg.whatsappNumber && (
                  <li>
                    <a
                      href={`https://wa.me/${cfg.whatsappNumber.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-semibold transition hover:text-white hover:underline"
                    >
                      <MessageCircle size={15} aria-hidden="true" /> WhatsApp
                    </a>
                  </li>
                )}
                {cfg.storePhone && (
                  <li><a href={`tel:${cfg.storePhone.replace(/[^0-9+]/g, "")}`} className="transition hover:text-white hover:underline">{cfg.storePhone}</a></li>
                )}
                {cfg.supportEmail && (
                  <li><a href={`mailto:${cfg.supportEmail}`} className="transition hover:text-white hover:underline">{cfg.supportEmail}</a></li>
                )}
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-6">
            <h2 className="text-eyebrow uppercase text-white/70">We accept</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {splitLines(cfg.paymentMethods).map((method) => (
                <li key={method} className="rounded-full border border-white/25 px-3 py-1.5 text-caption font-semibold text-white/90">
                  {method}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-body-sm text-white/85">
              <span className="font-semibold">Delivering to</span> {cfg.deliveryAreas}
            </p>

            <p className="mt-6 text-caption text-white/70">
              © {new Date().getFullYear()} House of Sirka · Prices in Namibian dollars, VAT included · Windhoek, Namibia
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        cart={store.cart}
        summary={cartSummary}
        couponCode={store.couponCode}
        fmt={fmt}
        onClose={() => setCartOpen(false)}
        onQuantity={changeCartQuantity}
        onCoupon={(couponCode) => setStorePatch({ couponCode })}
        onCheckout={() => {
          setCartOpen(false);
          router.push("/checkout");
        }}
      />


      {viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          settings={cfg}
          fmt={fmt}
          onClose={() => setViewingOrder(null)}
        />
      )}

      <Toast message={notice} />
    </>
  );
}

/**
 * Chrome shared by every storefront route: header, footer, cart, checkout and
 * the order receipt. Wraps its own StoreProvider so /admin — which keeps a
 * separate writer for the same localStorage key — is never inside it.
 */
export default function StorefrontShell({ children }) {
  return (
    <StoreProvider>
      <Shell>{children}</Shell>
    </StoreProvider>
  );
}
