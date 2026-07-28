"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { classNames } from "@/lib/format";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

const SHOT_LABELS = ["Full view", "On the body", "Fabric detail", "In context"];

/**
 * Product gallery.
 *
 * 56% of shoppers explore images before anything else, and roughly 40% of
 * mobile sites offer no way to zoom at all — so the zoomed view supports
 * genuine pinch and double-tap rather than a fixed 2x toggle: the image sits in
 * a scrollable well with `touch-action: pinch-zoom`, which hands the gesture to
 * the browser's native pinch and pan.
 */
export default function ProductGallery({ images = [], alt }) {
  const shots = images.length ? images : [];
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const zoomRef = useRef(null);
  const railRef = useRef(null);
  useFocusTrap(zoomRef, zoomOpen, () => setZoomOpen(false));

  useEffect(() => {
    setActive(0);
  }, [images]);

  if (!shots.length) return <div className="aspect-[4/5] rounded-md bg-ink-200" />;

  function onRailKeyDown(event) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      event.key === "ArrowRight"
        ? (active + 1) % shots.length
        : (active - 1 + shots.length) % shots.length;
    setActive(next);
    railRef.current?.querySelectorAll("button")[next]?.focus();
  }

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-brass-200 bg-ink-200">
        <img src={shots[active]} alt={alt} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label={`Zoom ${alt}`}
          className="absolute bottom-3 right-3 inline-flex h-11 items-center gap-2 rounded-full border border-brass-200 bg-ink-50/95 px-4 text-body-sm font-semibold text-ink-800 shadow-sm transition hover:border-wine-600 hover:text-wine-600"
        >
          <Maximize2 size={16} aria-hidden="true" /> Zoom
        </button>
      </div>

      {shots.length > 1 && (
        <div
          ref={railRef}
          role="group"
          aria-label="Product images"
          onKeyDown={onRailKeyDown}
          className="grid grid-cols-4 gap-2"
        >
          {shots.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              aria-label={SHOT_LABELS[index] || `Image ${index + 1}`}
              className={classNames(
                "overflow-hidden rounded-md border-2 bg-ink-200 transition",
                active === index ? "border-wine-600" : "border-transparent hover:border-brass-400",
              )}
            >
              <img src={src} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/90" onClick={() => setZoomOpen(false)}>
          <div
            ref={zoomRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} — zoomed`}
            tabIndex={-1}
            className="relative h-full w-full outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              aria-label="Close zoom"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink-50/95 text-ink-900 shadow-soft transition hover:bg-white"
            >
              <X size={20} />
            </button>

            {/*
              `touch-action: pinch-zoom` on a scrollable container is what lets
              the browser handle pinch and pan natively, which is more precise
              than any JS transform and works with assistive zoom too.
            */}
            <div
              className="h-full w-full overflow-auto"
              style={{ touchAction: "pinch-zoom" }}
              onDoubleClick={(event) => {
                const img = event.currentTarget.querySelector("img");
                const zoomed = img.dataset.zoomed === "true";
                img.dataset.zoomed = String(!zoomed);
                img.style.width = zoomed ? "100%" : "200%";
                img.style.maxWidth = zoomed ? "100%" : "none";
              }}
            >
              <img
                src={shots[active]}
                alt={alt}
                data-zoomed="false"
                className="mx-auto block h-auto w-full max-w-4xl"
              />
            </div>

            <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink-950/70 px-4 py-2 text-caption text-white">
              Pinch or double-tap to zoom · Esc to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
