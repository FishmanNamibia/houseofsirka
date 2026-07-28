"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Stack of currently-open dialogs. Only the topmost reacts to Escape, so a
 * gallery opened from inside a product modal closes itself first rather than
 * tearing down both.
 */
const stack = [];

function focusableWithin(root) {
  if (!root) return [];
  return [...root.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
  );
}

/**
 * Traps focus inside `ref` while `active`, restores it to whatever was focused
 * before, closes on Escape, and locks background scroll.
 */
export function useFocusTrap(ref, active, onClose) {
  const restoreTo = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!active) return undefined;

    const node = ref.current;
    restoreTo.current = document.activeElement;

    const token = {};
    stack.push(token);

    // Focus the first control, or the dialog itself when it holds none.
    const initial = focusableWithin(node)[0] || node;
    initial?.focus?.();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        if (stack[stack.length - 1] !== token) return;
        event.stopPropagation();
        closeRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusableWithin(node);
      if (!items.length) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      // Wrap at both ends, and pull focus back in if it escaped the dialog.
      if (event.shiftKey && (current === first || !node.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !node.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      const index = stack.indexOf(token);
      if (index > -1) stack.splice(index, 1);
      if (!stack.length) document.body.style.overflow = previousOverflow;
      restoreTo.current?.focus?.();
    };
  }, [active, ref]);
}
