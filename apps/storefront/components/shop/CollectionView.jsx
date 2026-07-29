"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { ProductCard } from "@/components/shop/parts";

function View({ category, seedProducts }) {
  const { store, hydrated, publishedProducts, fmt, addToCart, toggleWishlist } = useStore();

  // Seed first so server HTML and first client render agree.
  const products = hydrated
    ? publishedProducts.filter((p) => p.category === category)
    : seedProducts;

  return (
    <div className="mx-auto max-w-shell px-4 py-8 md:px-8 xl:px-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
          <Link href="/" className="hover:text-wine-600">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-ink-800">{category}</span>
        </nav>

        <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">{category}</h1>
        <p aria-live="polite" className="mt-3 text-body-sm text-ink-600">
          Showing {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>

        {/* Same card as /shop and /wishlist. This page previously carried its
            own copy, which drifted the moment the card was redesigned. */}
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wished={store.wishlist.includes(product.id)}
              fmt={fmt}
              onWish={() => toggleWishlist(product.id)}
              onQuickAdd={() => {
                const variant = product.variants.find((v) => v.stock > 0);
                if (variant) addToCart(product, variant.id);
              }}
            />
          ))}
        </div>

        {!products.length && (
          <p className="mt-10 text-body text-ink-600">Nothing in this collection just now.</p>
        )}
    </div>
  );
}

export default function CollectionView({ products, ...props }) {
  return (
    <StorefrontShell products={products}>
      <View {...props} />
    </StorefrontShell>
  );
}
