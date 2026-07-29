"use client";

import Link from "next/link";
import { productSlug } from "@/lib/catalog";
import { productPrice } from "@/lib/format";
import { useStore } from "@/components/store/StoreProvider";

/**
 * Cross-navigation off a product page. Prefers the same collection, then the
 * same category, so the suggestions read as "goes with this" rather than
 * "here is more stock".
 */
export default function RelatedProducts({ product }) {
  const { publishedProducts, fmt } = useStore();

  const others = publishedProducts.filter((p) => p.id !== product.id);
  const sameCollection = others.filter((p) => p.collection === product.collection);
  const sameCategory = others.filter(
    (p) => p.category === product.category && p.collection !== product.collection,
  );
  const related = [...sameCollection, ...sameCategory, ...others].slice(0, 4);

  if (!related.length) return null;

  return (
    <section aria-labelledby="related" className="mt-12 border-t border-brass-200 pt-8">
      <h2 id="related" className="font-display text-display-sm text-wine-800">
        Wears well with
      </h2>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item) => (
          <li key={item.id}>
            <Link
              href={`/products/${productSlug(item)}`}
              className="group block overflow-hidden rounded-none border border-brass-200 bg-ink-50 transition hover:border-brass-400"
            >
              <div className="aspect-[4/5] overflow-hidden bg-ink-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="grid gap-1 p-3">
                <p className="font-display text-display-xs text-wine-800">{item.name}</p>
                <p className="text-body-sm text-ink-600">{item.category}</p>
                <p className="tabular text-body-sm font-semibold">{fmt(productPrice(item))}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
