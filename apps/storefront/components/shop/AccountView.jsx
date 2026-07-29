"use client";

import Link from "next/link";
import { ChevronRight, LogIn } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { CustomerAccountView, TextInput } from "@/components/shop/parts";

function Account() {
  const { store, fmt, customerEmail, customerLogin, customerLogout, setViewingOrder, show } = useStore();

  return (
    <div className="mx-auto max-w-shell px-4 py-8 md:px-8 xl:px-12 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
        <Link href="/" className="hover:text-wine-600">Home</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className="text-ink-800">Account</span>
      </nav>

      <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">
        {store.content.accountTitle}
      </h1>
      <p className="mt-3 max-w-[68ch] text-body text-ink-700">{store.content.accountCopy}</p>

      {!customerEmail ? (
        <div className="mx-auto mt-10 max-w-md">
          <div className="rounded-md border border-brass-200 bg-ink-50 p-6 shadow-sm">
            <LogIn className="mb-4 text-wine-600" size={24} aria-hidden="true" />
            <h2 className="font-display text-display-sm text-wine-800">Find your order</h2>
            <p className="mt-2 text-body-sm text-ink-600">
              Enter the email address you used when placing your order.
            </p>

            {/*
              This is an unverified lookup, not authentication — there is no
              password and no session. Calling it a "login" would imply a
              protection that does not exist, so it is labelled for what it is
              until real accounts are built on a backend.
            */}
            <p className="mt-3 rounded-md border border-brass-600 bg-brass-50 p-3 text-caption text-ink-700">
              Order history is looked up by email only — anyone entering your address could see it.
              Please do not enter anything you would not want a shared computer to remember. Proper
              accounts with passwords are coming.
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
              className="mt-5 grid gap-3"
            >
              <TextInput name="loginEmail" type="email" label="Email address" required />
              <button
                type="submit"
                className="h-12 rounded-md bg-wine-600 font-semibold text-white transition hover:bg-wine-700"
              >
                Find my orders
              </button>
            </form>
            <p className="mt-4 text-caption text-ink-600">
              If you checked out as a guest, use the same email to see your order history.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <CustomerAccountView
            store={store}
            customerEmail={customerEmail}
            fmt={fmt}
            onViewOrder={(order) => setViewingOrder(order)}
            onLogout={customerLogout}
          />
        </div>
      )}
    </div>
  );
}

export default function AccountView() {
  return (
    <StorefrontShell>
      <Account />
    </StorefrontShell>
  );
}
