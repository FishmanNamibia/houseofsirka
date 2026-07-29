"use client";

import Link from "next/link";
import { ChevronRight, Heart } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { ProductCard } from "@/components/shop/parts";

function Wishlist() {
  const { store, publishedProducts, fmt, addToCart, toggleWishlist } = useStore();

  const saved = store.wishlist
    .map((id) => publishedProducts.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-shell px-4 py-8 md:px-8 xl:px-12 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
        <Link href="/" className="hover:text-wine-600">Home</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className="text-ink-800">Wishlist</span>
      </nav>

      <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">Wishlist</h1>
      <p aria-live="polite" className="mt-3 text-body-sm text-ink-600">
        {saved.length} {saved.length === 1 ? "piece" : "pieces"} saved
      </p>

      {saved.length ? (
        <>
        <h2 className="sr-only">Saved pieces</h2>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {saved.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wished
              fmt={fmt}
              onWish={() => toggleWishlist(product.id)}
              onQuickAdd={() => {
                const variant = product.variants.find((v) => v.stock > 0);
                if (variant) addToCart(product, variant.id);
              }}
            />
          ))}
        </div>
        </>
      ) : (
        <div className="mt-10 rounded-none border border-brass-200 bg-ink-50 p-10 text-center">
          <Heart size={28} className="mx-auto text-wine-600" aria-hidden="true" />
          <p className="mt-4 text-body text-ink-700">
            Nothing saved yet. Tap the heart on any piece to keep it here.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-none bg-wine-600 px-6 font-semibold text-white transition hover:bg-wine-700"
          >
            Browse the rail <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function WishlistView({ products }) {
  return (
    <StorefrontShell products={products}>
      <Wishlist />
    </StorefrontShell>
  );
}
