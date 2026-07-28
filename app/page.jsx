"use client";

import Link from "next/link";
import { ChevronRight, Heart } from "lucide-react";
import { totalStock } from "@/lib/format";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { ProductCard } from "@/components/shop/parts";

function Landing() {
  const { store, publishedProducts, fmt, addToCart, toggleWishlist } = useStore();
  const content = store.content;

  const featured = publishedProducts
    .filter((product) => product.tags.includes("Featured"))
    .slice(0, 4);
  const shown = featured.length ? featured : publishedProducts.slice(0, 4);

  const collections = [
    { title: content.collection1Title, category: content.collection1Category, image: content.collection1Image },
    { title: content.collection2Title, category: content.collection2Category, image: content.collection2Image },
    { title: content.collection3Title, category: content.collection3Category, image: content.collection3Image },
    { title: content.collection4Title, category: content.collection4Category, image: content.collection4Image },
  ].filter((entry) => entry.title && entry.category);

  return (
    <>
    <section className="floral-paper relative overflow-hidden border-b border-brass-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:min-h-[calc(100vh-140px)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-brass-200 bg-ink-50/80 px-4 py-2 text-eyebrow uppercase text-garden-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-brass-300" />
            {store.content.heroBadge}
          </div>
          {/* A real, visible H1. The wordmark image that stood here duplicated
              the header logo and left the page with only an sr-only heading. */}
          <h1 className="font-display text-display-lg text-wine-800 sm:text-display-xl lg:text-display-2xl">
            {store.content.heroTitle}
          </h1>
          <p className="mt-6 max-w-[68ch] text-body-lg text-ink-700">
            {store.content.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-wine-600 px-5 font-bold text-white shadow-sm transition hover:bg-wine-700"
            >
              {store.content.heroCtaPrimary} <ChevronRight size={18} />
            </Link>
            <Link
              href="/collections"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-brass-200 bg-ink-50 px-5 font-bold text-garden-700 transition hover:border-wine-600 hover:text-wine-600"
            >
              {store.content.heroCtaSecondary} <Heart size={18} />
            </Link>
          </div>
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["New pieces", publishedProducts.length],
              ["Sizes held", store.products.reduce((sum, product) => sum + totalStock(product), 0)],
              ["Orders dressed", store.orders.length],
            ].map(([label, value]) => (
              <div key={label} className="border border-brass-200 bg-pearl/82 p-4 shadow-sm">
                <span className="text-xs font-bold uppercase text-ink-600">{label}</span>
                <strong className="mt-1 block font-display text-display-sm text-wine-600">{value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Columns 1-2 hold the text cards, columns 3-6 the main image, so no
            card can sit on top of the photograph. A fixed row track on large
            screens keeps the collage from outgrowing the copy beside it. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:h-[600px] lg:grid-cols-6 lg:grid-rows-6 lg:gap-3">
          <div className="order-2 border border-brass-200 bg-ink-50 p-4 shadow-soft sm:order-none lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-2">
            <p className="font-display text-display-sm text-wine-800">{store.content.fittingNoteTitle}</p>
            <p className="mt-2 text-body-sm text-ink-600">{store.content.fittingNoteText}</p>
          </div>

          <div className="order-1 border border-brass-200 bg-ink-200 p-3 shadow-soft sm:order-none sm:col-span-2 lg:col-span-4 lg:col-start-3 lg:row-span-6 lg:row-start-1">
            <img
              src={store.content.heroImage}
              alt=""
              className="h-56 w-full object-cover sm:h-80 lg:h-full"
            />
          </div>

          <div className="order-3 border border-brass-200 bg-ink-50 p-3 shadow-soft sm:order-none lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-4">
            <img
              src={store.content.heroSecondaryImage}
              alt=""
              className="h-48 w-full object-cover lg:h-28"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-2">
              <span className="font-display text-display-sm text-wine-800">{store.content.heroSecondaryLabel}</span>
              <span className="rounded-full bg-brass-300 px-3 py-1 text-micro text-ink-900">
                {store.content.heroSecondaryBadge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

      <div className="lace-edge h-3 bg-ink-50 text-brass-400" aria-hidden="true" />

      <section className="border-b border-brass-200 bg-ink-50 px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-eyebrow uppercase text-clay-700">{content.collectionsEyebrow}</p>
              <h2 className="font-display text-display-md leading-tight text-wine-800 md:text-display-lg">
                {content.campaignTitle}
              </h2>
              <p className="mt-3 max-w-[68ch] text-body text-ink-700">{content.campaignCopy}</p>
            </div>
            <Link
              href="/collections"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-brass-600 px-4 font-semibold text-garden-700 transition hover:border-wine-600 hover:text-wine-600"
            >
              All collections <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((entry) => (
              <Link
                key={entry.title}
                href={`/collections/${String(entry.category).toLowerCase()}`}
                className="group relative min-h-72 overflow-hidden rounded-md border border-brass-200 bg-ink-200 text-left shadow-sm"
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
                    {entry.category}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-100 px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-eyebrow uppercase text-clay-700">{content.catalogEyebrow}</p>
              <h2 className="font-display text-display-md leading-tight text-wine-800 md:text-display-lg">
                {content.catalogTitle}
              </h2>
              <p className="mt-3 max-w-[68ch] text-body text-ink-700">{content.catalogCopy}</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-wine-600 px-4 font-semibold text-white transition hover:bg-wine-700"
            >
              Shop everything <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={store.wishlist.includes(product.id)}
                fmt={fmt}
                onWish={() => toggleWishlist(product.id)}
                onQuickAdd={() => {
                  const variant = product.variants.find((item) => item.stock > 0);
                  if (variant) addToCart(product, variant.id);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-wine-50 px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="mb-2 text-eyebrow uppercase text-clay-700">{content.accountEyebrow}</p>
            <h2 className="font-display text-display-md leading-tight text-wine-800">{content.accountTitle}</h2>
            <p className="mt-3 max-w-[68ch] text-body text-ink-700">{content.accountCopy}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/account"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-wine-600 px-6 font-semibold text-white transition hover:bg-wine-700"
            >
              Track an order
            </Link>
            <Link
              href="/size-guide"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-brass-600 px-6 font-semibold text-garden-700 transition hover:border-wine-600 hover:text-wine-600"
            >
              Size guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <StorefrontShell>
      <Landing />
    </StorefrontShell>
  );
}
