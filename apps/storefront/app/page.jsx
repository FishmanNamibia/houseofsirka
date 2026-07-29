"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
      {/*
        A single editorial split: one image, one heading, one line, one primary
        action. The previous hero carried a badge pill, a three-up stat block and
        two cards floating over the photograph. The stat block was the worst of it
        — "Orders dressed 0" is anti-persuasion on a new shop, and "Sizes held 75"
        means nothing to a shopper. Restraint and scale read as premium; ornament
        reads as noise.
      */}
      <section className="border-b border-brass-200 bg-ink-50">
        <div className="mx-auto grid max-w-shell items-center gap-10 px-4 py-12 md:px-8 xl:px-12 xl:px-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <p className="text-eyebrow uppercase text-garden-700">{content.heroBadge}</p>
            <h1 className="display-hero mt-4 font-display text-display-lg text-wine-800 sm:text-display-xl">
              {content.heroTitle}
            </h1>
            <p className="mt-6 max-w-[58ch] text-body-lg text-ink-700">{content.heroSubtitle}</p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-md bg-wine-600 px-8 py-3.5 text-body font-semibold text-white transition hover:bg-wine-700"
              >
                {content.heroCtaPrimary} <ChevronRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/collections"
                className="text-body font-semibold text-garden-700 underline underline-offset-4 transition hover:text-wine-600"
              >
                {content.heroCtaSecondary}
              </Link>
            </div>

            <p className="mt-8 border-t border-brass-200 pt-6 text-body-sm text-ink-600">
              {content.fittingNoteText}
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-ink-200">
            <img src={content.heroImage} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-ink-100 px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-shell">
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

      <section className="bg-ink-100 px-4 py-12 md:px-8 xl:px-12 xl:px-12 md:py-16">
        <div className="mx-auto max-w-shell">
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

      <section className="bg-wine-50 px-4 py-12 md:px-8 xl:px-12 xl:px-12 md:py-16">
        <div className="mx-auto grid max-w-shell gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
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
