"use client";

import { useState } from "react";
import Link from "next/link";
import { Ruler } from "lucide-react";
import { classNames } from "@/lib/format";
import { sizingFor, sizesFor } from "@/lib/sizing";

/**
 * Garment measurements, fabric and fit — the content apparel sites most often
 * omit, and the reason most size-related returns happen.
 */
export default function SizeAndFit({ product }) {
  const sizing = sizingFor(product);
  const sizes = sizesFor(product, sizing);
  const [open, setOpen] = useState(false);

  return (
    <section aria-labelledby="size-fit" className="mt-10 border-t border-brass-200 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="size-fit" className="flex items-center gap-2 font-display text-display-sm text-wine-800">
          <Ruler size={20} className="text-garden-700" aria-hidden="true" />
          Size &amp; fit
        </h2>
        <Link href="/size-guide" className="text-body-sm font-semibold text-wine-600 underline underline-offset-4">
          How to measure
        </Link>
      </div>

      <dl className="mt-4 grid gap-3 text-body-sm sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="font-semibold text-ink-800">Fit</dt>
          <dd className="text-ink-700">{sizing.fit}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold text-ink-800">Fabric</dt>
          <dd className="text-ink-700">{sizing.fabric}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold text-ink-800">Stretch</dt>
          <dd className="text-ink-700">{sizing.stretch}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold text-ink-800">On the model</dt>
          <dd className="text-ink-700">{sizing.model}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="measurements"
        className={classNames(
          "mt-5 inline-flex h-11 items-center rounded-md border border-brass-600 px-4 text-body-sm font-semibold transition",
          "text-ink-800 hover:border-wine-600 hover:text-wine-600",
        )}
      >
        {open ? "Hide measurements" : "Show garment measurements"}
      </button>

      {open && (
        <div id="measurements" className="mt-4">
          <p className="text-body-sm text-ink-600">
            Garment measured flat, in centimetres. For body measurements see the{" "}
            <Link href="/size-guide" className="text-wine-600 underline">size guide</Link>.
          </p>
          <div className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[380px] border-collapse text-body-sm">
              <caption className="sr-only">
                {product.name} garment measurements in centimetres
              </caption>
              <thead>
                <tr className="border-b border-brass-400 text-left">
                  <th scope="col" className="py-2 pr-4 font-semibold text-ink-800">Size</th>
                  {sizing.columns.map((c) => (
                    <th key={c} scope="col" className="py-2 pr-4 font-semibold text-ink-800">{c} (cm)</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizes.map((size) => (
                  <tr key={size} className="border-b border-brass-200">
                    <th scope="row" className="py-2 pr-4 text-left font-semibold text-wine-800">{size}</th>
                    {sizing.rows[size].map((v, i) => (
                      <td key={sizing.columns[i]} className="tabular py-2 pr-4 text-ink-700">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
