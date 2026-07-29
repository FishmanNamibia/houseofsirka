"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  LogOut,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";
import { COLOR_SWATCHES as swatches, productSlug } from "@/lib/catalog";
import { classNames, productPrice, splitLines, totalStock, unique } from "@/lib/format";
import { fileToDataUrl } from "@/lib/media";
import { Modal, Sheet } from "@/components/ui";
import SmartImage from "@/components/ui/SmartImage";

export function SectionTitle({ eyebrow, title, copy }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-clay-700">{eyebrow}</p>
      <h2 className="font-display text-display-md leading-tight text-wine-800 md:text-display-lg">{title}</h2>
      {copy && <p className="mt-3 max-w-2xl text-ink-600">{copy}</p>}
    </div>
  );
}

export function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-none border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function ProductCard({ product, wished, fmt, onWish, onQuickAdd }) {
  const stock = totalStock(product);
  const colors = unique(product.variants.map((variant) => variant.color));
  const onSale = Boolean(product.salePrice);
  const lowStock = stock > 0 && stock <= 3;
  const secondImage = product.images?.[1];

  return (
    /*
      A contained card, deliberately.

      Five luxury retailers measured — Aesop, SSENSE, Khaite, Totem̈e, Jacquemus
      — all use borderless tiles with the photograph directly on the page. The
      containment here is a considered exception: several product photographs
      have white or near-white backgrounds and would dissolve into the cream
      surface without a boundary.

      What makes it read as a boutique rather than a dashboard is the treatment:
      square corners, a hairline border, and no elevation. Radius and shadow are
      the tells; a border is not.
    */
    <article className="group relative border border-brass-200 bg-ink-50 transition-colors duration-150 hover:border-brass-400">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-200">
        <Link
          href={`/products/${productSlug(product)}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          {/*
            SmartImage rather than a raw <img>: this grid renders sixteen
            photographs, and next/image gives AVIF/WebP, a responsive srcset and
            lazy loading. On Namibian mobile data the bytes matter more than
            anything on screen.
          */}
          <SmartImage
            src={product.image}
            alt={product.name}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/*
            Second photograph on hover instead of a scale-zoom. None of the
            benchmark sites zoom on hover — it reads as a marketplace — and a
            crossfade shows the shopper something new rather than the same
            image larger.
          */}
          {secondImage && (
            <SmartImage
              src={secondImage}
              alt=""
              className="object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
        </Link>

        {/* Only shown when it carries information. A badge on every card is
            wallpaper; "Only 2 left" is a reason to decide now. */}
        {(lowStock || !stock) && (
          <span
            className={classNames(
              "absolute left-0 top-0 px-3 py-1.5 text-micro uppercase tracking-wider",
              stock ? "bg-clay-700 text-white" : "bg-ink-900 text-white",
            )}
          >
            {stock ? `Only ${stock} left` : "Sold out"}
          </span>
        )}

        {onSale && stock > 0 && !lowStock && (
          <span className="absolute left-0 top-0 bg-wine-600 px-3 py-1.5 text-micro uppercase tracking-wider text-white">
            Sale
          </span>
        )}

        <button
          type="button"
          onClick={onWish}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-0 top-0 grid h-11 w-11 place-items-center bg-ink-50/95 text-wine-600 transition-colors duration-150 hover:bg-ink-50 hover:text-wine-700"
        >
          <Heart size={17} fill={wished ? "currentColor" : "none"} />
        </button>

        {/* Present for keyboard users, who cannot hover. */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100">
          <button
            type="button"
            disabled={!stock}
            onClick={onQuickAdd}
            className="h-12 w-full bg-ink-950 text-body-sm font-semibold text-white transition-colors duration-150 hover:bg-wine-800 disabled:opacity-60"
          >
            {stock ? "Add to cart" : "Sold out"}
          </button>
        </div>
      </div>

      {/*
        Name and price, matching the benchmark set. Category is redundant inside
        a category listing, and swatches only earn their place when there is
        more than one colour to choose between.
      */}
      <div className="grid gap-1.5 border-t border-brass-200 p-4">
        <h3 className="font-display text-display-xs leading-snug text-wine-800">
          <Link
            href={`/products/${productSlug(product)}`}
            className="transition-colors duration-150 hover:text-wine-600"
          >
            {product.name}
          </Link>
        </h3>

        <div className="flex items-baseline gap-2">
          <strong className="tabular text-body font-semibold text-ink-900">
            {fmt(productPrice(product))}
          </strong>
          {onSale && (
            <del className="tabular text-body-sm text-ink-600">{fmt(product.price)}</del>
          )}
        </div>

        {colors.length > 1 && (
          <div className="mt-1 flex items-center gap-1.5">
            {colors.map((color) => (
              <span
                key={color}
                title={color}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-ink-900/20"
                style={{ backgroundColor: swatches[color] || "#ddd" }}
              >
                <span className="sr-only">{color}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function CartDrawer({ open, cart, summary, couponCode, fmt, onClose, onQuantity, onCoupon, onCheckout }) {
  if (!open) return null;
  return (
    <Sheet open={open} onClose={onClose} side="right" title="Cart">
      <div className="overflow-auto px-5 py-4">
          {cart.length ? (
            <div className="grid gap-4">
              {cart.map((line) => (
                <div key={line.id} className="grid grid-cols-[76px_1fr] gap-3 border-b border-brass-200 pb-4">
                  <img src={line.image} alt={line.name} className="h-24 w-20 rounded object-cover" />
                  <div className="grid gap-1">
                    <strong>{line.name}</strong>
                    <span className="text-sm text-ink-600">
                      {line.size} / {line.color}
                    </span>
                    <span className="text-sm font-bold">{fmt(line.price * line.quantity)}</span>
                    {line.quantity > 1 && <span className="text-xs text-ink-600">{fmt(line.price)} each</span>}
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" onClick={() => onQuantity(line.id, -1)} className="grid h-8 w-8 place-items-center rounded border border-brass-200 transition hover:border-wine-600 hover:text-wine-600">
                        <Minus size={14} />
                      </button>
                      <span className="min-w-8 text-center font-bold">{line.quantity}</span>
                      <button type="button" onClick={() => onQuantity(line.id, 1)} className="grid h-8 w-8 place-items-center rounded border border-brass-200 transition hover:border-wine-600 hover:text-wine-600">
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuantity(line.id, -line.quantity)}
                        className="ml-2 grid h-8 w-8 place-items-center rounded border border-brass-200 text-ink-600 transition hover:border-wine-600 hover:text-wine-600"
                        title="Remove from cart"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Your cart is ready for the first piece." />
          )}
        </div>
      <div className="border-t border-brass-200 px-5 pb-5 pt-4">
          <label className="grid gap-2 text-sm font-bold text-ink-700">
            Coupon
            <input
              value={couponCode}
              onChange={(event) => onCoupon(event.target.value)}
              placeholder="SIRKA10 or FREESHIP"
              className="h-11 rounded-none border border-brass-600 px-3"
            />
          </label>
          {summary.couponMessage && (
            <div
              className={classNames(
                "mt-3 rounded-none px-3 py-2 text-sm font-semibold",
                summary.couponValid
                  ? "bg-garden-50 text-garden-700"
                  : "bg-wine-50 text-wine-600",
              )}
            >
              {summary.couponMessage}
            </div>
          )}
          <SummaryRows summary={summary} fmt={fmt} />
          <button
            type="button"
            disabled={!cart.length}
            onClick={onCheckout}
            className="mt-4 h-12 w-full rounded-none bg-wine-600 font-bold text-white transition hover:bg-wine-700"
          >
            Checkout
          </button>
        </div>
    </Sheet>
  );
}

export function OrderDetailModal({ order, settings, fmt, onClose }) {
  const steps = ["Pending Payment", "Processing", "Packed", "Shipped", "Delivered"];
  const activeIndex = Math.max(0, steps.indexOf(order.status));
  const isPaid = order.paymentStatus === "Paid";
  const proofMethods = splitLines(settings.proofRequiredMethods);
  const needsProof = proofMethods.includes(order.payment) && !isPaid;
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString() : "";

  return (
    <Modal
      onClose={onClose}
      title={`Order ${order.orderNumber}`}
      showClose={false}
      width="min(920px, calc(100vw - 2rem))"
      className="overflow-auto p-5 md:p-7"
    >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay-700">Order confirmation</p>
            <h2 className="mt-2 font-display text-display-md text-wine-800">{order.orderNumber}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="grid h-10 w-10 place-items-center rounded-none border border-brass-200">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span
            className={classNames(
              "rounded-full px-3 py-1 text-sm font-black",
              isPaid ? "bg-garden/10 text-garden-700" : "bg-wine-50 text-wine-600",
            )}
          >
            {order.paymentStatus}
          </span>
          <span className="rounded-full bg-brass/10 px-3 py-1 text-sm font-bold text-ink-700">
            {order.status}
          </span>
          <span className="text-sm text-ink-600">{dateStr}</span>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1">
          {steps.map((step, index) => (
            <div key={step} className="text-center">
              <span
                className={classNames("block h-2 rounded-full", index <= activeIndex ? "bg-garden-700" : "bg-brass/20")}
              />
              <span className={classNames("mt-1 block text-[10px]", index <= activeIndex ? "font-bold text-garden-700" : "text-ink-600")}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid gap-5">
            <div className="rounded-none border border-brass-200 bg-ink-100 p-4">
              <h3 className="font-bold text-wine-800">Order items</h3>
              <div className="mt-3 grid gap-3">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border-b border-brass-200 pb-3 last:border-b-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="h-16 w-12 rounded object-cover" />
                    <div className="flex-1">
                      <strong className="block text-sm">{item.name}</strong>
                      <span className="text-xs text-ink-600">{item.size} / {item.color} × {item.quantity}</span>
                    </div>
                    <strong className="text-sm">{fmt(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {!isPaid && (
              <div className="rounded-none border border-wine/20 bg-wine-50 p-4">
                <h3 className="font-bold text-wine-600">Payment required</h3>
                <p className="mt-1 text-sm text-ink-700">
                  Your order is confirmed but awaiting payment via <strong>{order.payment}</strong>.
                </p>

                {order.payment === "EFT bank transfer" || (proofMethods.includes(order.payment) && order.payment.toLowerCase().includes("eft")) ? (
                  <div className="mt-3 rounded-none border border-brass-200 bg-white p-3 text-sm">
                    <h4 className="font-bold">Bank / EFT details</h4>
                    <div className="mt-2 grid gap-1">
                      {settings.bankName && <InfoRow label="Bank" value={settings.bankName} />}
                      {settings.bankAccountName && <InfoRow label="Account name" value={settings.bankAccountName} />}
                      {settings.bankAccountNumber && <InfoRow label="Account number" value={settings.bankAccountNumber} />}
                      {settings.bankBranchCode && <InfoRow label="Branch code" value={settings.bankBranchCode} />}
                      <InfoRow label="Reference" value={order.orderNumber} />
                      {settings.bankReference && (
                        <p className="mt-2 text-xs text-ink-600">{settings.bankReference}</p>
                      )}
                    </div>
                  </div>
                ) : null}

                {order.payment === "EWallet transfer" || (proofMethods.includes(order.payment) && order.payment.toLowerCase().includes("wallet")) ? (
                  <div className="mt-3 rounded-none border border-brass-200 bg-white p-3 text-sm">
                    <h4 className="font-bold">EWallet details</h4>
                    <div className="mt-2 grid gap-1">
                      {settings.ewalletProvider && <InfoRow label="Provider" value={settings.ewalletProvider} />}
                      {settings.ewalletNumber && <InfoRow label="Send to" value={settings.ewalletNumber} />}
                      <InfoRow label="Reference" value={order.orderNumber} />
                      {settings.ewalletInstructions && (
                        <p className="mt-2 text-xs text-ink-600">{settings.ewalletInstructions}</p>
                      )}
                    </div>
                  </div>
                ) : null}

                {order.payment?.toLowerCase().includes("delivery") && (
                  <div className="mt-3 rounded-none border border-brass-200 bg-white p-3 text-sm">
                    <p className="text-ink-700">
                      Payment will be collected upon delivery. Please have <strong>{fmt(order.total)}</strong> ready.
                    </p>
                  </div>
                )}

                {needsProof && !order.proofOfPayment && (
                  <p className="mt-3 text-sm font-bold text-wine-600">
                    Please upload your proof of payment to expedite processing. Contact us at {settings.supportEmail || "support"} or WhatsApp {settings.whatsappNumber || ""}.
                  </p>
                )}

                {order.proofOfPayment && (
                  <div className="mt-3 flex items-center gap-2 rounded-none bg-garden/10 px-3 py-2 text-sm font-bold text-garden-700">
                    <Check size={16} />
                    Proof of payment uploaded — awaiting verification.
                  </div>
                )}
              </div>
            )}

            {isPaid && (
              <div className="flex items-center gap-2 rounded-none bg-garden/10 px-4 py-3 text-sm font-bold text-garden-700">
                <Check size={18} />
                Payment confirmed — your order is being processed.
              </div>
            )}
          </div>

          <div className="grid content-start gap-4">
            <div className="rounded-none border border-brass-200 bg-ink-100 p-4">
              <h3 className="font-bold text-wine-800">Order summary</h3>
              <div className="mt-3 grid gap-2 text-sm">
                <InfoRow label="Subtotal" value={fmt(order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0)} />
                {order.promotion && <InfoRow label={`Discount (${order.promotion.code})`} value={`-${fmt(order.promotion.discount)}`} />}
                <InfoRow label="Total" value={fmt(order.total)} />
              </div>
            </div>

            <div className="rounded-none border border-brass-200 bg-ink-100 p-4">
              <h3 className="font-bold text-wine-800">Details</h3>
              <div className="mt-3 grid gap-2 text-sm">
                <InfoRow label="Customer" value={order.customer} />
                <InfoRow label="Email" value={order.email} />
                <InfoRow label="Phone" value={order.phone || "—"} />
                <InfoRow label="Delivery" value={order.delivery} />
                <InfoRow label="Address" value={order.address || "—"} />
                <InfoRow label="Payment" value={order.payment} />
              </div>
            </div>

            {settings.whatsappNumber && (
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I have a question about order ${order.orderNumber}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-none bg-garden-700 px-4 font-bold text-white transition hover:bg-garden/90"
              >
                <MessageCircle size={18} /> Contact via WhatsApp
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-none border border-brass-200 px-4 font-bold text-ink-700 transition hover:border-wine-600 hover:text-wine-600"
            >
              Close
            </button>
          </div>
        </div>
    </Modal>
  );
}

export function OrderMini({ order, fmt, onClick }) {
  const steps = ["Pending Payment", "Processing", "Packed", "Shipped", "Delivered"];
  const activeIndex = Math.max(0, steps.indexOf(order.status));
  const isPaid = order.paymentStatus === "Paid";
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "";
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-none border border-brass-200 bg-ink-100 p-4 text-left transition hover:border-wine-600 hover:shadow-sm"
    >
      <div className="flex justify-between gap-4">
        <strong>{order.orderNumber}</strong>
        <strong>{fmt(order.total)}</strong>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-sm">
        <span className="text-ink-600">{dateStr}</span>
        <span
          className={classNames(
            "rounded-full px-2 py-0.5 text-xs font-black",
            isPaid ? "bg-garden/10 text-garden-700" : "bg-wine-50 text-wine-600",
          )}
        >
          {order.paymentStatus}
        </span>
      </div>
      <div className="mt-1 text-xs text-ink-600">
        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""} · {order.payment} · {order.status}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1">
        {steps.map((step, index) => (
          <span
            key={step}
            title={step}
            className={classNames("h-2 rounded-full", index <= activeIndex ? "bg-garden-700" : "bg-brass/20")}
          />
        ))}
      </div>
    </button>
  );
}

export function CustomerAccountView({ store, customerEmail, fmt, onViewOrder, onLogout }) {
  const myOrders = store.orders.filter((o) => o.email === customerEmail);
  const myProfile = store.customers?.find((c) => c.email === customerEmail);
  const paidOrders = myOrders.filter((o) => o.paymentStatus === "Paid");
  const pendingOrders = myOrders.filter((o) => o.paymentStatus !== "Paid");
  const totalSpent = paidOrders.reduce((s, o) => s + Number(o.total || 0), 0);

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[.85fr_1.15fr_1fr]">
      <div className="rounded-none border border-brass-200 bg-ink-50 p-5">
        <User className="mb-4 text-wine-600" size={24} />
        <h3 className="font-display text-display-sm text-wine-800">My account</h3>
        <div className="mt-3 grid gap-2 text-sm">
          <InfoRow label="Name" value={myProfile?.name || "—"} />
          <InfoRow label="Email" value={customerEmail} />
          <InfoRow label="Phone" value={myProfile?.phone || "—"} />
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          <InfoRow label="Orders placed" value={myOrders.length} />
          <InfoRow label="Paid" value={paidOrders.length} />
          <InfoRow label="Awaiting payment" value={pendingOrders.length} />
          <InfoRow label="Total spent" value={fmt(totalSpent)} />
          <InfoRow label="Wishlist" value={store.wishlist.length} />
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-none border border-brass-200 text-sm font-bold text-ink-600 transition hover:border-wine-600 hover:text-wine-600"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <div className="rounded-none border border-brass-200 bg-ink-50 p-5">
        <h3 className="font-display text-display-sm text-wine-800">My orders</h3>
        <div className="mt-4 grid gap-3 max-h-[460px] overflow-y-auto pr-1">
          {myOrders.length ? (
            myOrders.map((order) => (
              <OrderMini
                key={order.id}
                order={order}
                fmt={fmt}
                onClick={() => onViewOrder(order)}
              />
            ))
          ) : (
            <div className="rounded-none border border-brass-200 bg-ink-100 p-4 text-center text-sm text-ink-600">
              No orders found for {customerEmail}. Place an order to see it here.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-none border border-brass-200 bg-ink-50 p-5">
        <h3 className="font-display text-display-sm text-wine-800">Wishlist</h3>
        <div className="mt-4 grid gap-3">
          {store.wishlist.length ? (
            store.wishlist
              .map((id) => store.products.find((product) => product.id === id))
              .filter(Boolean)
              .map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${productSlug(product)}`}
                  className="flex items-center gap-3 rounded-none border border-brass-200 bg-white p-2 text-left transition hover:border-wine-600"
                >
                  <img src={product.image} alt={product.name} className="h-16 w-12 rounded object-cover" />
                  <span>
                    <strong className="block">{product.name}</strong>
                    <span className="tabular text-body-sm text-ink-600">{fmt(productPrice(product))}</span>
                  </span>
                </Link>
              ))
          ) : (
            <EmptyState text="Save products to build your wishlist." />
          )}
        </div>
      </div>
    </div>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-brass-200 py-2 last:border-b-0">
      <span className="text-ink-600">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}

export function SummaryRows({ summary, fmt }) {
  return (
    <div className="mt-4 grid gap-2 text-sm">
      <InfoRow label="Subtotal" value={fmt(summary.subtotal)} />
      <InfoRow label="Discount" value={`-${fmt(summary.discount)}`} />
      <InfoRow label="Shipping" value={summary.shipping ? fmt(summary.shipping) : "Free"} />
      <InfoRow label="Estimated tax" value={fmt(summary.tax)} />
      <div className="flex items-center justify-between gap-4 border-t border-brass-200 pt-3 text-lg">
        <span className="font-bold">Total</span>
        <strong>{fmt(summary.total)}</strong>
      </div>
    </div>
  );
}

export function TextInput({ label, name, type = "text", defaultValue = "", required = false }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="h-11 rounded-none border border-brass-600 bg-white px-3 text-ink-900 outline-none focus:border-wine"
      />
    </label>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="rounded-none border border-dashed border-brass-200 bg-ink-100 p-6 text-center text-sm text-ink-600">
      {text}
    </div>
  );
}

export default function Home() {
  return (
    <StoreProvider>
      <StorefrontHome />
    </StoreProvider>
  );
}
