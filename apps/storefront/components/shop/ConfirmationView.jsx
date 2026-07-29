"use client";

import Link from "next/link";
import { Check, ChevronRight, MessageCircle, Truck } from "lucide-react";
import { splitLines } from "@/lib/format";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";

function Confirmation() {
  const { store, cfg, fmt, hydrated } = useStore();
  const order = store.orders[0];

  if (!hydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-24" aria-busy="true" />;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
        <h1 className="font-display text-display-md text-wine-800">No recent order</h1>
        <p className="mt-3 text-body text-ink-700">
          If you have placed one before, find it under your account.
        </p>
        <Link href="/account" className="mt-8 inline-flex h-12 items-center rounded-none bg-wine-600 px-6 font-semibold text-white">
          Go to account
        </Link>
      </div>
    );
  }

  const proofNeeded = splitLines(cfg.proofRequiredMethods).includes(order.payment) && !order.proofOfPayment;
  const wa = String(cfg.whatsappNumber || "").replace(/[^0-9]/g, "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 xl:px-12 md:py-16">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-garden-700 text-white">
          <Check size={24} aria-hidden="true" />
        </span>
        <div>
          <p className="text-eyebrow uppercase text-garden-700">Order placed</p>
          <h1 className="font-display text-display-md text-wine-800">{order.orderNumber}</h1>
        </div>
      </div>

      <p className="mt-6 max-w-[68ch] text-body text-ink-700">
        Thank you, {order.customer?.split(" ")[0] || "and welcome"}. A confirmation is on its way to{" "}
        <strong>{order.email}</strong>. Quote {order.orderNumber} in any message about this order.
      </p>

      {proofNeeded && (
        <div className="mt-6 rounded-none border-2 border-brass-600 bg-brass-50 p-4">
          <h2 className="font-semibold text-ink-900">One step left</h2>
          <p className="mt-1 text-body-sm text-ink-700">
            {order.payment} needs your proof of payment before we pack. Send it on WhatsApp with your
            order number and we will confirm the same working day.
          </p>
          {wa && (
            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent(`Proof of payment for ${order.orderNumber}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-none bg-garden-700 px-4 font-semibold text-white transition hover:bg-garden-800"
            >
              <MessageCircle size={16} aria-hidden="true" /> Send proof on WhatsApp
            </a>
          )}
        </div>
      )}

      <dl className="mt-8 grid gap-3 rounded-none border border-brass-200 bg-ink-50 p-5 text-body-sm">
        <div className="flex flex-wrap justify-between gap-2"><dt className="text-ink-600">Payment</dt><dd className="font-semibold">{order.payment}</dd></div>
        <div className="flex flex-wrap justify-between gap-2"><dt className="text-ink-600">Status</dt><dd className="font-semibold">{order.paymentStatus}</dd></div>
        <div className="flex flex-wrap justify-between gap-2"><dt className="text-ink-600">Delivery</dt><dd className="font-semibold">{order.delivery}</dd></div>
        <div className="flex flex-wrap justify-between gap-2"><dt className="text-ink-600">To</dt><dd className="max-w-[60%] text-right font-semibold">{order.address}, {order.city}</dd></div>
        <div className="flex justify-between border-t border-brass-200 pt-3 text-body-lg font-semibold">
          <dt>Total</dt><dd className="tabular">{fmt(order.total)}</dd>
        </div>
      </dl>

      <h2 className="mt-10 font-display text-display-sm text-wine-800">What happens next</h2>
      <ol className="mt-4 grid gap-3 text-body text-ink-700">
        <li className="flex gap-3"><span className="tabular font-semibold text-wine-600">1.</span> We confirm payment and check your pieces.</li>
        <li className="flex gap-3"><span className="tabular font-semibold text-wine-600">2.</span> Your order is pressed and packed at our Windhoek workroom.</li>
        <li className="flex gap-3"><span className="tabular font-semibold text-wine-600">3.</span> We message you with courier or collection details.</li>
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/account" className="inline-flex h-12 items-center gap-2 rounded-none bg-wine-600 px-6 font-semibold text-white transition hover:bg-wine-700">
          Track this order <ChevronRight size={18} aria-hidden="true" />
        </Link>
        <Link href="/shop" className="inline-flex h-12 items-center gap-2 rounded-none border border-brass-600 px-6 font-semibold text-garden-700 transition hover:border-wine-600 hover:text-wine-600">
          <Truck size={18} aria-hidden="true" /> Keep shopping
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationView({ products }) {
  return (
    <StorefrontShell products={products}>
      <Confirmation />
    </StorefrontShell>
  );
}
