"use client";

import { useId, useRef } from "react";
import { X } from "lucide-react";
import { classNames } from "@/lib/format";
import { useFocusTrap } from "./useFocusTrap";

const SIDES = {
  right: "right-0 top-0 h-screen w-[min(430px,100vw)]",
  left: "left-0 top-0 h-screen w-[min(360px,85vw)]",
  bottom: "bottom-0 left-0 max-h-[85vh] w-full rounded-t-xl",
};

/**
 * Edge-anchored panel sharing Modal's focus management. Used for the cart, and
 * for mobile navigation and filters.
 */
export default function Sheet({
  open,
  onClose,
  side = "right",
  title,
  children,
  className,
  id,
}) {
  const ref = useRef(null);
  const titleId = useId();
  useFocusTrap(ref, open, onClose);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink-950/50" onClick={onClose} />
      <aside
        ref={ref}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={classNames(
          "fixed z-50 grid grid-rows-[auto_1fr_auto] bg-ink-50 shadow-soft outline-none",
          SIDES[side],
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-brass-200 p-5 pb-4">
          <h2 id={titleId} className="font-display text-display-sm text-wine-800">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${String(title || "panel").toLowerCase()}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-brass-200 text-ink-800 transition hover:border-wine-600 hover:text-wine-600"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
