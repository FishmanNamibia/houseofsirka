"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { productSlug } from "@/lib/catalog";
import { productPrice } from "@/lib/format";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

/**
 * Search is the single largest gap against class-leading retail navigation:
 * Baymard finds up to 31% of shoppers abandon a site outright when on-site
 * search fails them, and it is present in the primary nav of essentially every
 * comparable boutique.
 *
 * Deliberately forgiving — it matches on name, SKU, category, collection,
 * description and tags, and tolerates a leading/trailing space rather than
 * requiring an exact prefix.
 */
export default function SearchOverlay({ open, onClose, products, fmt }) {
  const ref = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  useFocusTrap(ref, open, onClose);

  useEffect(() => {
    if (open) {
      setQuery("");
      // Focus after the trap has run, so it does not get overridden.
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        [p.name, p.sku, p.category, p.collection, p.description, (p.tags || []).join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 8);
  }, [query, products]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/55" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Search the rail"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="mx-auto mt-0 max-h-[85vh] w-full overflow-auto border-b border-brass-200 bg-ink-50 p-4 shadow-soft outline-none md:p-6"
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <Search size={20} className="shrink-0 text-ink-600" aria-hidden="true" />
            <label htmlFor="site-search" className="sr-only">Search for a piece</label>
            <input
              id="site-search"
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dresses, blazers, linen…"
              className="h-12 flex-1 rounded-md border border-brass-600 bg-white px-3 text-body text-ink-900"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-brass-200 text-ink-800 transition hover:border-wine-600 hover:text-wine-600"
            >
              <X size={18} />
            </button>
          </div>

          <p aria-live="polite" className="mt-3 text-body-sm text-ink-600">
            {query.trim()
              ? `${results.length} ${results.length === 1 ? "piece" : "pieces"} matching “${query.trim()}”`
              : "Type to search the rail."}
          </p>

          {results.length > 0 && (
            <ul className="mt-4 grid gap-2">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${productSlug(product)}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-md border border-brass-200 bg-white p-2 transition hover:border-wine-600"
                  >
                    <img src={product.image} alt="" className="h-16 w-12 shrink-0 rounded object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink-800">{product.name}</span>
                      <span className="block text-body-sm text-ink-600">{product.category}</span>
                    </span>
                    <span className="tabular shrink-0 font-semibold">{fmt(productPrice(product))}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.trim() && !results.length && (
            <p className="mt-4 rounded-md border border-brass-200 bg-white p-4 text-body-sm text-ink-700">
              Nothing matches that. Try a fabric or an occasion — “linen”, “satin”, “evening” — or{" "}
              <Link href="/shop" onClick={onClose} className="text-wine-600 underline">
                browse the whole rail
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
