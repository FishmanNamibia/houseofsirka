"use client";

import { useId, useRef } from "react";
import { X } from "lucide-react";
import { classNames } from "@/lib/format";
import { useFocusTrap } from "./useFocusTrap";

/**
 * Centered dialog with focus management.
 *
 * Replaces the previous bare-div overlay, which had no focus trap, no Escape
 * handler, no role/aria-modal, and closed only on mousedown — unreachable by
 * keyboard.
 */
/**
 * Surface treatments are enumerated rather than passed as classes, because
 * Tailwind resolves conflicting utilities by stylesheet order, not by the order
 * they appear in the class string — an overriding `bg-` in `className` would
 * win only by luck.
 */
const TONES = {
  panel: "border border-brass-200 bg-ink-50",
  dark: "border border-ink-800 bg-ink-900 text-white",
};

export default function Modal({
  open = true,
  onClose,
  title,
  label,
  children,
  className,
  tone = "panel",
  showClose = true,
  width = "min(1000px, calc(100vw - 2rem))",
}) {
  const ref = useRef(null);
  const titleId = useId();
  useFocusTrap(ref, open, onClose);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink-950/55 p-4"
      onClick={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : label}
        tabIndex={-1}
        style={{ width }}
        className={classNames(
          "relative max-h-[calc(100vh-2rem)] rounded-md shadow-soft outline-none",
          TONES[tone],
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        )}
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-md border border-brass-200 bg-ink-50/90 text-ink-800 transition hover:border-wine-600 hover:text-wine-600"
          >
            <X size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
