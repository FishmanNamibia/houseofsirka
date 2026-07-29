"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Heart, ShieldCheck, Truck } from "lucide-react";
import { COLOR_SWATCHES, productSlug } from "@/lib/catalog";
import { classNames, productPrice, totalStock, unique } from "@/lib/format";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";
import ProductGallery from "@/components/shop/ProductGallery";
import SizeAndFit from "@/components/shop/SizeAndFit";
import Reviews from "@/components/shop/Reviews";
import RelatedProducts from "@/components/shop/RelatedProducts";
import StickyBuyBar from "@/components/shop/StickyBuyBar";

function Detail({ slug, seedProduct }) {
  const { store, hydrated, fmt, addToCart, toggleWishlist } = useStore();

  // Seed data renders first so the server HTML and the first client render
  // match; once localStorage is read, admin edits take over.
  const live = hydrated ? store.products.find((p) => productSlug(p) === slug) : null;
  const product = live || seedProduct;

  const [variantId, setVariantId] = useState(null);

  if (hydrated && !product) {
    return (
      <>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-display-lg text-wine-800">Piece not found</h1>
          <p className="mt-4 text-body text-ink-600">This piece may have been archived.</p>
          <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-none bg-wine-600 px-6 font-semibold text-white">
            Back to the boutique
          </Link>
        </div>
      </>
    );
  }

  if (!product) {
    return <div className="mx-auto max-w-6xl px-4 py-24" aria-busy="true" />;
  }

  const variants = product.variants || [];
  const activeVariant = variants.find((v) => v.id === variantId) || variants.find((v) => v.stock > 0) || variants[0];
  const stock = totalStock(product);
  const colors = unique(variants.map((v) => v.color));

  return (
    <div className="mx-auto max-w-shell px-4 py-8 md:px-8 xl:px-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-body-sm text-ink-600">
          <Link href="/" className="hover:text-wine-600">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link href={`/collections/${String(product.category).toLowerCase()}`} className="hover:text-wine-600">
            {product.category}
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-ink-800">{product.name}</span>
        </nav>

        {/*
          The media column is sized by its content rather than handed half the
          page. A portrait photograph bounded by the viewport does not need a
          fixed share of the width, and an even split left a band of empty cream
          beside it; `auto` gives whatever the image does not use to the
          details, which can always spend it.
        */}
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(22rem,1fr)] lg:gap-10 xl:gap-14">
          <ProductGallery
            images={product.images?.length ? product.images : [product.image]}
            alt={product.name}
          />

          {/*
            Sticky from lg up, so the price, size selector and Add to cart hold
            their place while you scan down a photograph taller than they are.

            Its reach is the grid row, not the page — a sticky element can only
            travel inside its containing block, which here is the row the image
            defines. Measured: 269px of hold before it releases and scrolls away
            with the image. Worth having, but it is not a rail that follows you
            into the sections below; making it one would mean moving those
            sections inside this grid, which is a different change.
          */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-eyebrow uppercase text-garden-700">{product.collection}</p>
            <h1 className="mt-2 font-display text-display-md text-wine-800 md:text-display-lg">{product.name}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              <strong className="tabular text-display-sm font-semibold text-ink-900">{fmt(productPrice(product))}</strong>
              {product.salePrice && (
                <del className="tabular text-body text-ink-600">{fmt(product.price)}</del>
              )}
            </div>

            <p className="mt-5 max-w-[68ch] text-body text-ink-700">{product.description}</p>

            <fieldset className="mt-7">
              <legend className="text-label uppercase tracking-wider text-ink-700">Size &amp; colour</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((v) => {
                  const out = !v.stock;
                  const active = activeVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={out}
                      aria-pressed={active}
                      onClick={() => setVariantId(v.id)}
                      className={classNames(
                        "inline-flex h-11 items-center gap-2 rounded-none border px-4 text-body-sm font-semibold transition",
                        active ? "border-wine-600 bg-wine-50 text-wine-700" : "border-brass-600 text-ink-800 hover:border-wine-600",
                        out && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-brass-400"
                        style={{ backgroundColor: COLOR_SWATCHES[v.color] || "#ddd" }}
                        aria-hidden="true"
                      />
                      {v.size} / {v.color}
                      {out && <span className="sr-only">(out of stock)</span>}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!stock || !activeVariant}
                onClick={() => activeVariant && addToCart(product, activeVariant.id, 1)}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-none bg-wine-600 px-6 font-semibold text-white transition hover:bg-wine-700 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {stock ? "Add to cart" : "Out of stock"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={store.wishlist.includes(product.id)}
                aria-label="Save to wishlist"
                className="grid h-12 w-12 place-items-center rounded-none border border-brass-600 text-wine-600 transition hover:border-wine-600"
              >
                <Heart size={20} fill={store.wishlist.includes(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            <dl className="mt-8 grid gap-3 border-t border-brass-200 pt-6 text-body-sm">
              <div className="flex items-center gap-2 text-ink-700">
                <Truck size={16} className="text-garden-700" aria-hidden="true" />
                <dt className="sr-only">Delivery</dt>
                <dd>Free Windhoek delivery over {fmt(store.settings.freeDeliveryThreshold)}</dd>
              </div>
              <div className="flex items-center gap-2 text-ink-700">
                <ShieldCheck size={16} className="text-garden-700" aria-hidden="true" />
                <dt className="sr-only">Payment</dt>
                <dd>Secure payment · eWallet, EFT, PayPulse or on delivery</dd>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-ink-700">
                <dt className="font-semibold">Colours:</dt>
                <dd>{colors.join(", ")}</dd>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-ink-700">
                <dt className="font-semibold">SKU:</dt>
                <dd className="tabular">{product.sku}</dd>
              </div>
            </dl>
          </div>
        </div>

        <SizeAndFit product={product} />
        <Reviews product={product} />
        <RelatedProducts product={product} />

        <StickyBuyBar
          product={product}
          variant={activeVariant}
          stock={stock}
          fmt={fmt}
          onAdd={() => activeVariant && addToCart(product, activeVariant.id, 1)}
        />
    </div>
  );
}

export default function ProductDetail({ products, ...props }) {
  return (
    <StorefrontShell products={products}>
      <Detail {...props} />
    </StorefrontShell>
  );
}
