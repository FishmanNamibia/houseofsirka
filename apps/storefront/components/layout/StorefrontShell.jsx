"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, MessageCircle, Music2 } from "lucide-react";
import { StoreProvider, useStore } from "@/components/store/StoreProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import { CartDrawer, OrderDetailModal } from "@/components/shop/parts";
import SearchOverlay from "@/components/shop/SearchOverlay";
import { Toast } from "@/components/ui";

const SHOP_LINKS = [
  { label: "All pieces", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Wishlist", href: "/wishlist" },
];

const HELP_LINKS = [
  { label: "Size guide", href: "/size-guide" },
  { label: "Shipping & delivery", href: "/shipping" },
  { label: "Returns & exchanges", href: "/returns" },
  { label: "FAQ", href: "/faq" },
];

const WORKROOM_LINKS = [
  { label: "About the workroom", href: "/about" },
  { label: "Contact & fittings", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

/**
 * Social accounts. Rendered only where the admin has set a URL, so an
 * unconfigured channel leaves no dead icon behind.
 */
const SOCIALS = [
  { key: "instagramUrl", label: "Instagram", Icon: Instagram },
  { key: "facebookUrl", label: "Facebook", Icon: Facebook },
  { key: "tiktokUrl", label: "TikTok", Icon: Music2 },
];

function Shell({ children }) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    store, cfg, fmt, cartSummary, cartCount, publishedProducts,
    cartOpen, setCartOpen,
    viewingOrder, setViewingOrder,
    notice, show,
    changeCartQuantity, setStorePatch,
  } = useStore();

  return (
    <>
      <SiteHeader
        announcement={store.content.announcement}
        settings={cfg}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={publishedProducts}
        fmt={fmt}
      />

      <main id="main" className="min-h-screen bg-ink-100 text-ink-900">{children}</main>

      <footer className="bg-wine-800 text-white">
        <div className="border-b border-white/15 px-4 py-10 md:px-8 xl:px-12">
          <div className="mx-auto grid max-w-shell gap-6 md:grid-cols-[1.1fr_1fr] md:items-center">
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
                className="h-12 flex-1 rounded-none border border-white/30 bg-white/10 px-4 text-body text-white placeholder:text-white/60"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-none bg-brass-300 px-6 font-semibold text-ink-900 transition hover:bg-brass-400"
              >
                Keep me posted
              </button>
            </form>
          </div>
        </div>

        <div className="px-4 py-12 md:px-8 xl:px-12">
          <div className="mx-auto grid max-w-shell gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <div className="mb-4 w-44 rounded bg-ink-50 p-2">
                <img src="/house-of-sirka-logo-final.png" alt="House of Sirka" className="h-auto w-full" />
              </div>
              <p className="max-w-[44ch] text-body-sm text-white/85">{store.content.footerTagline}</p>

              <h2 className="mt-7 text-eyebrow uppercase text-white/70">Follow us</h2>
              <ul className="mt-3 flex flex-wrap items-center gap-2">
                {SOCIALS.filter(({ key }) => cfg[key]).map(({ key, label, Icon }) => (
                  <li key={key}>
                    <a
                      href={cfg[key]}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white/90 transition hover:border-white hover:bg-white/10 hover:text-white"
                    >
                      <Icon size={18} aria-hidden="true" />
                    </a>
                  </li>
                ))}
                {cfg.whatsappNumber && (
                  <li>
                    <a
                      href={`https://wa.me/${String(cfg.whatsappNumber).replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white/90 transition hover:border-white hover:bg-white/10 hover:text-white"
                    >
                      <MessageCircle size={18} aria-hidden="true" />
                    </a>
                  </li>
                )}
              </ul>
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
              <h2 className="text-eyebrow uppercase text-white/70">Workroom</h2>
              <ul className="mt-4 grid gap-2.5 text-body-sm">
                {WORKROOM_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/85 transition hover:text-white hover:underline">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-shell border-t border-white/15 pt-6">
            <p className="mt-6 text-caption text-white/70">
              © {new Date().getFullYear()} House of Sirka · Windhoek, Namibia
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
