"use client";

import Link from "next/link";
import { ChevronRight, Heart, Package, Ruler, ShieldCheck } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { CustomerAccountView, TextInput } from "@/components/shop/parts";

/** What the account is actually for, rather than a bare form with no context. */
const BENEFITS = [
  {
    icon: Package,
    title: "Follow your order",
    body: "From confirmation through pressing and packing to the courier.",
  },
  {
    icon: ShieldCheck,
    title: "Confirm a payment",
    body: "Upload proof for an eWallet, EasyWallet, PayPulse or EFT transfer.",
  },
  {
    icon: Heart,
    title: "Keep your wishlist",
    body: "Pieces you have saved, waiting for when you decide.",
  },
  {
    icon: Ruler,
    title: "Your measurements on file",
    body: "So alterations at the workroom start from what we already know.",
  },
];

function Account() {
  const { store, cfg, fmt, customerEmail, customerLogin, customerLogout, setViewingOrder, show } =
    useStore();

  if (customerEmail) {
    return (
      <div className="mx-auto max-w-shell px-4 py-8 md:px-8 md:py-12 xl:px-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
          <Link href="/" className="hover:text-wine-600">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-ink-800">Account</span>
        </nav>

        <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">
          {store.content.accountTitle}
        </h1>

        <div className="mt-10">
          <CustomerAccountView
            store={store}
            customerEmail={customerEmail}
            fmt={fmt}
            onViewOrder={(order) => setViewingOrder(order)}
            onLogout={customerLogout}
          />
        </div>
      </div>
    );
  }

  /*
    Signed out, this page was a single narrow card adrift in a 1600px page.
    An editorial split gives it presence: the left column says what the account
    is for, the right holds the form. Same content, but it reads as designed
    rather than as a form that happened to land in the middle of nothing.
  */
  return (
    <div className="mx-auto max-w-shell px-4 py-8 md:px-8 md:py-12 xl:px-12">
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1 text-body-sm text-ink-600">
        <Link href="/" className="hover:text-wine-600">Home</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className="text-ink-800">Account</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_minmax(0,460px)] lg:items-start lg:gap-20">
        <div>
          <p className="text-eyebrow uppercase text-garden-700">{store.content.accountEyebrow}</p>
          <h1 className="mt-4 font-display text-display-md text-wine-800 md:text-display-lg">
            {store.content.accountTitle}
          </h1>
          <p className="mt-5 max-w-[58ch] text-body-lg text-ink-700">{store.content.accountCopy}</p>

          <ul className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <Icon size={20} className="mt-0.5 shrink-0 text-garden-700" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-ink-800">{title}</span>
                  <span className="mt-1 block max-w-[38ch] text-body-sm text-ink-600">{body}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-10 border-t border-brass-200 pt-6 text-body-sm text-ink-600">
            Not placed an order yet?{" "}
            <Link href="/shop" className="font-semibold text-wine-600 underline underline-offset-4">
              Browse the rail
            </Link>
            {" "}— you can check out as a guest, no account needed.
          </p>
        </div>

        <div className="rounded-none border border-brass-200 bg-ink-50 p-6 md:p-8 lg:sticky lg:top-28">
          <h2 className="font-display text-display-sm text-wine-800">Find your order</h2>
          <p className="mt-2 text-body-sm text-ink-600">
            Enter the email address you used when placing your order.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const email = new FormData(event.currentTarget).get("loginEmail");
              if (email) {
                customerLogin(email);
                show("Showing orders for that email address.");
              }
            }}
            className="mt-6 grid gap-4"
          >
            <TextInput name="loginEmail" type="email" label="Email address" required />
            <button
              type="submit"
              className="h-13 rounded-none bg-wine-600 px-6 py-3.5 text-body font-semibold text-white transition hover:bg-wine-700"
            >
              Find my orders
            </button>
          </form>

          {/*
            An unverified lookup, not authentication — no password, no session.
            Kept below the form and quiet: it must be honest without being the
            loudest thing on the page.
          */}
          <p className="mt-5 border-t border-brass-200 pt-5 text-caption text-ink-600">
            Orders are found by email alone, so anyone who knows your address could look them up.
            Accounts with passwords are on the way. If you checked out as a guest, use that same
            address.
          </p>

          {cfg.whatsappNumber && (
            <p className="mt-4 text-caption text-ink-600">
              Cannot find an order?{" "}
              <a
                href={`https://wa.me/${String(cfg.whatsappNumber).replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-wine-600 underline underline-offset-4"
              >
                Message the workroom
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountView({ products }) {
  return (
    <StorefrontShell products={products}>
      <Account />
    </StorefrontShell>
  );
}
