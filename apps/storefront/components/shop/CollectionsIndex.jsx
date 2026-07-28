"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";

function Index() {
  const { store, publishedProducts } = useStore();
  const c = store.content;

  const collections = [
    { title: c.collection1Title, category: c.collection1Category, image: c.collection1Image },
    { title: c.collection2Title, category: c.collection2Category, image: c.collection2Image },
    { title: c.collection3Title, category: c.collection3Category, image: c.collection3Image },
    { title: c.collection4Title, category: c.collection4Category, image: c.collection4Image },
  ].filter((entry) => entry.title && entry.category);

  const countFor = (category) =>
    publishedProducts.filter((product) => product.category === category).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
        <Link href="/" className="hover:text-wine-600">Home</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className="text-ink-800">Collections</span>
      </nav>

      <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">{c.campaignTitle}</h1>
      <p className="mt-3 max-w-[68ch] text-body text-ink-700">{c.campaignCopy}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((entry) => (
          <Link
            key={entry.title}
            href={`/collections/${String(entry.category).toLowerCase()}`}
            className="group relative min-h-72 overflow-hidden rounded-md border border-brass-200 bg-ink-200 shadow-sm transition hover:border-brass-400 hover:shadow-soft"
          >
            <img
              src={entry.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-wine-950/85 via-wine-950/45 to-transparent" />
            <span className="absolute bottom-0 block p-5 text-white">
              <span className="block font-display text-display-sm">{entry.title}</span>
              <span className="mt-1 block text-body-sm font-bold uppercase tracking-[0.16em] text-wine-100">
                {entry.category} · {countFor(entry.category)} {countFor(entry.category) === 1 ? "piece" : "pieces"}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-md border border-brass-200 bg-ink-50 p-6 text-center shadow-sm">
        <p className="text-body text-ink-700">Looking for something specific?</p>
        <Link
          href="/shop"
          className="mt-4 inline-flex h-12 items-center gap-2 rounded-md bg-wine-600 px-6 font-semibold text-white transition hover:bg-wine-700"
        >
          Browse the full rail <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function CollectionsIndex() {
  return (
    <StorefrontShell>
      <Index />
    </StorefrontShell>
  );
}
