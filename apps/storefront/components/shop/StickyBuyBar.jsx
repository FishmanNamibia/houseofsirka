"use client";

import { useEffect, useState } from "react";
import { productPrice } from "@/lib/format";

/**
 * Mobile buy bar.
 *
 * Once a shopper scrolls into the description, measurements and reviews, the
 * add-to-cart button is far above them. This keeps price, chosen variant and
 * the action within reach without scrolling back.
 *
 * Hidden until the primary button leaves the viewport so the two never appear
 * at once, and hidden entirely from md up where the button stays visible.
 */
export default function StickyBuyBar({ product, variant, stock, fmt, onAdd }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 520);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brass-200 bg-ink-50 p-3 shadow-soft md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-sm font-semibold text-ink-800">{product.name}</p>
          <p className="tabular text-body-sm text-ink-600">
            {fmt(productPrice(product))}
            {variant ? ` · ${variant.size} / ${variant.color}` : ""}
          </p>
        </div>
        <button
          type="button"
          disabled={!stock || !variant}
          onClick={onAdd}
          className="h-12 shrink-0 rounded-none bg-wine-600 px-6 font-semibold text-white transition hover:bg-wine-700 disabled:opacity-55"
        >
          {stock ? "Add" : "Sold out"}
        </button>
      </div>
    </div>
  );
}
