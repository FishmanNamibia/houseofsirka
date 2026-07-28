"use client";

import Link from "next/link";
import { StoreProvider, useStore } from "@/components/store/StoreProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import { CartDrawer, CheckoutModal, OrderDetailModal } from "@/components/shop/parts";
import { Toast } from "@/components/ui";

const FOOTER_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Size guide", href: "/size-guide" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

function Shell({ children }) {
  const {
    store, cfg, fmt, cartSummary, cartCount,
    cartOpen, setCartOpen,
    checkoutOpen, setCheckoutOpen,
    viewingOrder, setViewingOrder,
    customerEmail, notice,
    changeCartQuantity, setStorePatch, placeOrder,
  } = useStore();

  return (
    <>
      <SiteHeader
        announcement={store.content.announcement}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <main id="main" className="min-h-screen bg-ink-100 text-ink-900">{children}</main>

      <footer className="bg-wine-800 px-4 py-10 text-white md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="mb-3 w-48 rounded bg-ink-50 p-2">
              <img src="/house-of-sirka-logo-final.png" alt="House of Sirka" className="h-auto w-full" />
            </div>
            <p className="max-w-[48ch] text-body-sm text-white/85">{store.content.footerTagline}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-eyebrow uppercase text-white/70">Boutique</h2>
            <ul className="mt-3 grid gap-2 text-body-sm">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/85 transition hover:text-white hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-eyebrow uppercase text-white/70">Reach us</h2>
            <ul className="mt-3 grid gap-2 text-body-sm text-white/85">
              {cfg.supportEmail && (
                <li><a href={`mailto:${cfg.supportEmail}`} className="transition hover:text-white hover:underline">{cfg.supportEmail}</a></li>
              )}
              {cfg.storePhone && (
                <li><a href={`tel:${cfg.storePhone.replace(/[^0-9+]/g, "")}`} className="transition hover:text-white hover:underline">{cfg.storePhone}</a></li>
              )}
              {cfg.whatsappNumber && (
                <li>
                  <a
                    href={`https://wa.me/${cfg.whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline transition hover:text-white"
                  >
                    WhatsApp us
                  </a>
                </li>
              )}
              <li>{cfg.storeAddress}</li>
            </ul>
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
          setCheckoutOpen(true);
        }}
      />

      {checkoutOpen && (
        <CheckoutModal
          cart={store.cart}
          summary={cartSummary}
          settings={cfg}
          fmt={fmt}
          customer={customerEmail ? store.customers?.find((c) => c.email === customerEmail) : null}
          onClose={() => setCheckoutOpen(false)}
          onSubmit={placeOrder}
        />
      )}

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
