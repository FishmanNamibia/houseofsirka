"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Lock, ShieldCheck, Truck, Upload } from "lucide-react";
import { classNames, splitLines } from "@/lib/format";
import { fileToDataUrl } from "@/lib/media";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";

/** Send-to-a-cellphone-number wallets: all need our number displayed. */
const WALLET_METHODS = [
  "FNB eWallet",
  "PayPulse / BlueVoucher (Standard Bank)",
  "EasyWallet (Bank Windhoek)",
  "Send Money (Nedbank)",
  "FNB Pay2Cell",
];

/**
 * Customer-facing note per method, describing the actual mechanics of each
 * Namibian rail — USSD strings, limits and voucher expiry included, since those
 * are the details that cause a payment to be abandoned halfway.
 */
const METHOD_NOTES = {
  PayToday:
    "Pay instantly from the PayToday app — search for House of Sirka and use your order number as the description.",
  "Card payment":
    "Visa or Mastercard. You are redirected to our payment provider; we never see your card details.",
  "EFT bank transfer":
    "Transfer to our FNB Namibia account using your order number as the reference, then upload the proof.",
  "FNB eWallet":
    "Send to our number from the FNB app or *140*321#, then upload the confirmation SMS. Maximum N$5,000.",
  "PayPulse / BlueVoucher (Standard Bank)":
    "Send from the PayPulse app or *140*6626#, then upload the confirmation SMS. The voucher PIN is valid 72 hours.",
  "EasyWallet (Bank Windhoek)":
    "Send from the Bank Windhoek app or *140*295#, then upload the confirmation SMS.",
  "Send Money (Nedbank)":
    "Send from the Nedbank Money app, then upload the confirmation SMS. Maximum N$5,000 per day.",
  "FNB Pay2Cell":
    "FNB to FNB only, via *140*321#. Use this if you bank with FNB; otherwise choose eWallet.",
  "Pay on delivery":
    "Pay the courier in cash when your piece arrives. Windhoek and Okahandja only.",
};

function Field({ label, name, type = "text", required, defaultValue, placeholder, autoComplete, hint }) {
  const id = `f-${name}`;
  return (
    <label htmlFor={id} className="grid gap-1.5">
      <span className="text-label text-ink-800">
        {label} {required && <span className="text-wine-600" aria-hidden="true">*</span>}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="h-12 rounded-md border border-brass-600 bg-white px-3 text-body text-ink-900"
      />
      {hint && <span id={`${id}-hint`} className="text-caption text-ink-600">{hint}</span>}
    </label>
  );
}

function Checkout() {
  const router = useRouter();
  const { store, cfg, fmt, cartSummary, customerEmail, placeOrder, show } = useStore();

  const paymentMethods = splitLines(cfg.paymentMethods);
  const deliveryOptions = splitLines(cfg.deliveryOptions);
  const proofMethods = splitLines(cfg.proofRequiredMethods);

  const saved = customerEmail ? store.customers?.find((c) => c.email === customerEmail) : null;
  const c = saved || {};

  const [payment, setPayment] = useState(paymentMethods[0] || "");
  const [delivery, setDelivery] = useState(deliveryOptions[0] || "");
  const [proofFile, setProofFile] = useState(null);
  const [createAccount, setCreateAccount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const proofRequired = proofMethods.includes(payment);
  const away = Math.max(0, Number(cfg.freeDeliveryThreshold || 0) - cartSummary.subtotal);

  const bankDetails = useMemo(
    () => [
      ["Bank", cfg.bankName],
      ["Account name", cfg.bankAccountName],
      ["Account number", cfg.bankAccountNumber],
      ["Branch code", cfg.bankBranchCode],
      ["Reference", cfg.bankReference],
    ].filter(([, v]) => v),
    [cfg],
  );

  if (!store.cart.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
        <h1 className="font-display text-display-md text-wine-800">Your cart is empty</h1>
        <p className="mt-3 text-body text-ink-700">Add a piece from the rail and it will appear here.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-wine-600 px-6 font-semibold text-white transition hover:bg-wine-700"
        >
          Browse the rail <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");

    if (proofRequired && !proofFile) {
      setError(`${payment} needs a proof of payment before we can place the order.`);
      return;
    }

    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    let proofOfPayment = null;
    if (proofFile) {
      proofOfPayment = {
        name: proofFile.name,
        type: proofFile.type,
        size: proofFile.size,
        dataUrl: await fileToDataUrl(proofFile),
        uploadedAt: new Date().toISOString(),
      };
    }

    placeOrder({
      formData: {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        whatsapp: form.get("phone"),
        city: form.get("city"),
        address: form.get("address"),
        delivery,
        payment,
        accountType: createAccount ? "registered" : "guest",
        marketingOptIn: form.has("marketingOptIn"),
        proofOfPayment,
      },
      gatewayResult: null,
    });

    router.push("/checkout/confirmation");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
        <Link href="/shop" className="hover:text-wine-600">Shop</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className="text-ink-800">Checkout</span>
      </nav>

      <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">Checkout</h1>
      <p className="mt-2 flex items-center gap-2 text-body-sm text-ink-600">
        <Lock size={15} className="text-garden-700" aria-hidden="true" />
        No account needed — check out as a guest in one page.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="grid gap-8">
          <section aria-labelledby="h-details" className="grid gap-4">
            <h2 id="h-details" className="font-display text-display-sm text-wine-800">Where it goes</h2>
            <div className="grid items-start gap-x-4 gap-y-5 sm:grid-cols-2">
              <Field label="Full name" name="name" required defaultValue={c.name} autoComplete="name" />
              <Field label="Email" name="email" type="email" required defaultValue={c.email || customerEmail} autoComplete="email" hint="Your order confirmation goes here." />
              <Field label="Phone / WhatsApp" name="phone" type="tel" required defaultValue={c.phone} autoComplete="tel" placeholder="+264 81 000 0000" />
              <Field label="Town" name="city" required defaultValue={c.city || cfg.defaultCity} autoComplete="address-level2" />
              <div className="sm:col-span-2">
                <Field label="Delivery address" name="address" required defaultValue={c.address} autoComplete="street-address" placeholder="Street, suburb, town" />
              </div>
            </div>

            <fieldset className="mt-2">
              <legend className="text-label text-ink-800">Delivery</legend>
              <div className="mt-3 grid gap-2">
                {deliveryOptions.map((option) => (
                  <label
                    key={option}
                    className={classNames(
                      "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-body-sm transition",
                      delivery === option ? "border-wine-600 bg-wine-50" : "border-brass-400 hover:border-brass-600",
                    )}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option}
                      checked={delivery === option}
                      onChange={() => setDelivery(option)}
                      className="accent-wine-600"
                    />
                    <Truck size={16} className="text-garden-700" aria-hidden="true" />
                    <span className="font-medium text-ink-800">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          {/*
            Baymard: visually encapsulating the payment block measurably raises
            perceived security, which is the 19% "didn't trust the site" cause.
          */}
          <section
            aria-labelledby="h-payment"
            className="rounded-md border-2 border-brass-600 bg-ink-50 p-5 shadow-raised"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="h-payment" className="font-display text-display-sm text-wine-800">How you pay</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-garden-50 px-3 py-1 text-caption font-semibold text-garden-700">
                <ShieldCheck size={14} aria-hidden="true" /> Secure · details never stored
              </span>
            </div>

            <fieldset className="mt-4">
              <legend className="sr-only">Payment method</legend>
              <div className="grid gap-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method}
                    className={classNames(
                      "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition",
                      payment === method ? "border-wine-600 bg-wine-50" : "border-brass-400 hover:border-brass-600",
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={payment === method}
                      onChange={() => { setPayment(method); setError(""); }}
                      className="mt-1 accent-wine-600"
                    />
                    <span>
                      <span className="block font-semibold text-ink-800">{method}</span>
                      {METHOD_NOTES[method] && (
                        <span className="block text-body-sm text-ink-600">{METHOD_NOTES[method]}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {payment === "EFT bank transfer" && bankDetails.length > 0 && (
              <dl className="mt-4 grid gap-1 rounded-md bg-ink-100 p-4 text-body-sm">
                {bankDetails.map(([k, v]) => (
                  <div key={k} className="flex flex-wrap justify-between gap-2">
                    <dt className="text-ink-600">{k}</dt>
                    <dd className="font-semibold text-ink-800">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {WALLET_METHODS.includes(payment) && (
              <p className="mt-4 rounded-md bg-ink-100 p-4 text-body-sm text-ink-700">
                Send to <strong className="tabular">{cfg.ewalletNumber}</strong>, then upload the
                confirmation below. Use your order number as the reference where the app allows one.
              </p>
            )}

            {proofRequired && (
              <label className="mt-4 grid gap-2">
                <span className="text-label text-ink-800">
                  Proof of payment <span className="text-wine-600" aria-hidden="true">*</span>
                </span>
                <span className="flex items-center gap-3 rounded-md border border-dashed border-brass-600 bg-white p-3">
                  <Upload size={18} className="text-garden-700" aria-hidden="true" />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => { setProofFile(e.target.files?.[0] || null); setError(""); }}
                    className="text-body-sm"
                  />
                </span>
                <span className="text-caption text-ink-600">A screenshot or the confirmation SMS is fine.</span>
              </label>
            )}
          </section>

          <section className="grid gap-3">
            <label className="flex items-start gap-3 text-body-sm text-ink-700">
              <input
                type="checkbox"
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
                className="mt-1 accent-wine-600"
              />
              {/* Account creation is offered after the order, never as a gate:
                  18% of shoppers abandon when an account is required. */}
              <span>Save these details so my next order is faster.</span>
            </label>
            <label className="flex items-start gap-3 text-body-sm text-ink-700">
              <input type="checkbox" name="marketingOptIn" className="mt-1 accent-wine-600" />
              <span>Tell me when new pieces reach the rail. No more than monthly.</span>
            </label>
          </section>

          {error && (
            <p role="alert" className="rounded-md border border-wine-600 bg-wine-50 p-3 text-body-sm font-semibold text-wine-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-md bg-wine-600 px-8 py-3 text-body font-semibold text-white transition hover:bg-wine-700 disabled:opacity-60"
            >
              {submitting ? "Placing order…" : `Place order · ${fmt(cartSummary.total)}`}
            </button>
            <Link href="/shop" className="inline-flex items-center gap-1 text-body-sm font-semibold text-ink-700 hover:text-wine-600">
              <ChevronLeft size={16} aria-hidden="true" /> Keep shopping
            </Link>
          </div>
        </div>

        <aside className="rounded-md border border-brass-200 bg-ink-50 p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-display-sm text-wine-800">Your order</h2>

          <ul className="mt-4 grid gap-3">
            {store.cart.map((line) => (
              <li key={line.id} className="flex gap-3">
                <img src={line.image} alt={line.name} className="h-20 w-16 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-800">{line.name}</p>
                  <p className="text-body-sm text-ink-600">{line.size} / {line.color} · ×{line.quantity}</p>
                  <p className="tabular text-body-sm font-semibold">{fmt(line.price * line.quantity)}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Every cost is shown before the button, not after — unexpected extra
              costs are the single largest documented abandonment cause. */}
          <dl className="mt-5 grid gap-2 border-t border-brass-200 pt-4 text-body-sm">
            <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd className="tabular">{fmt(cartSummary.subtotal)}</dd></div>
            {cartSummary.discount > 0 && (
              <div className="flex justify-between text-garden-700"><dt>Discount</dt><dd className="tabular">−{fmt(cartSummary.discount)}</dd></div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-600">Delivery</dt>
              <dd className="tabular">{cartSummary.shipping ? fmt(cartSummary.shipping) : "Free"}</dd>
            </div>
            <div className="flex justify-between"><dt className="text-ink-600">VAT ({cfg.taxRate}%)</dt><dd className="tabular">{fmt(cartSummary.tax)}</dd></div>
            <div className="mt-2 flex justify-between border-t border-brass-200 pt-3 text-body-lg font-semibold">
              <dt>Total</dt><dd className="tabular">{fmt(cartSummary.total)}</dd>
            </div>
          </dl>

          {away > 0 && (
            <p className="mt-4 rounded-md bg-brass-50 p-3 text-body-sm text-ink-700">
              Add <strong className="tabular">{fmt(away)}</strong> more for free Windhoek delivery.
            </p>
          )}

          <ul className="mt-5 grid gap-2 border-t border-brass-200 pt-4 text-body-sm text-ink-700">
            <li className="flex items-center gap-2"><ShieldCheck size={15} className="text-garden-700" aria-hidden="true" /> 14-day exchanges</li>
            <li className="flex items-center gap-2"><Truck size={15} className="text-garden-700" aria-hidden="true" /> Windhoek delivery in 1–2 days</li>
          </ul>
          <p className="mt-3 text-caption text-ink-600">
            See <Link href="/returns" className="text-wine-600 underline">returns</Link> and{" "}
            <Link href="/shipping" className="text-wine-600 underline">shipping</Link> before you pay.
          </p>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutView() {
  return (
    <StorefrontShell>
      <Checkout />
    </StorefrontShell>
  );
}
