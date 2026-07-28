"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { productSlug } from "@/lib/catalog";
import { productPrice, totalStock } from "@/lib/format";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";
import SmartImage from "@/components/ui/SmartImage";

function View({ category, seedProducts }) {
  const { hydrated, publishedProducts, fmt } = useStore();

  // Seed first so server HTML and first client render agree.
  const products = hydrated
    ? publishedProducts.filter((p) => p.category === category)
    : seedProducts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
          <Link href="/" className="hover:text-wine-600">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-ink-800">{category}</span>
        </nav>

        <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">{category}</h1>
        <p aria-live="polite" className="mt-3 text-body-sm text-ink-600">
          Showing {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-md border border-brass-200 bg-ink-50 shadow-sm transition hover:border-brass-400 hover:shadow-soft"
            >
              <Link href={`/products/${productSlug(product)}`} className="block">
                <div className="relative aspect-[4/5] bg-ink-200">
                  <SmartImage
                    src={product.image}
                    alt={product.name}
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="grid gap-2 p-4">
                  <h2 className="font-display text-display-sm text-wine-800">{product.name}</h2>
                  <p className="line-clamp-2 text-body-sm text-ink-600">{product.description}</p>
                  <div className="flex items-baseline gap-2">
                    <strong className="tabular text-body">{fmt(productPrice(product))}</strong>
                    {product.salePrice && <del className="tabular text-body-sm text-ink-600">{fmt(product.price)}</del>}
                  </div>
                  <span className={totalStock(product) ? "text-body-sm text-garden-700" : "text-body-sm text-wine-600"}>
                    {totalStock(product) ? `${totalStock(product)} in stock` : "Out of stock"}
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {!products.length && (
          <p className="mt-10 text-body text-ink-600">Nothing in this collection just now.</p>
        )}
    </div>
  );
}

export default function CollectionView(props) {
  return (
    <StorefrontShell>
      <View {...props} />
    </StorefrontShell>
  );
}
