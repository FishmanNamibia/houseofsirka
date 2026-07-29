"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { classNames } from "@/lib/format";
import SmartImage from "@/components/ui/SmartImage";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

/**
 * Product gallery.
 *
 * Two things drive the shape of this. Images are what shoppers open first, so
 * the photograph has to be the largest thing on the page — and it has to be
 * visible without scrolling, which means its height is bounded by the viewport
 * rather than by the width of the column it sits in. A 4:5 photograph in a
 * half-width column of a 1600px page is over 1,000px tall: taller than most
 * laptop screens, so the garment was cut off before you had seen it.
 *
 * Height therefore leads and width follows. The stage is given a height derived
 * from the viewport and an aspect ratio, so the browser computes the width; it
 * is centred in whatever column width is left over. `svh` rather than `vh`
 * because mobile browser chrome makes `vh` taller than what you can actually
 * see.
 *
 * The full-screen view is a scroll-snapped track rather than a single swapped
 * image. That buys native swipe and momentum on touch, and it composes with
 * pinch: `touch-action: pan-x pinch-zoom` hands both gestures to the browser,
 * which pans and zooms more precisely than any JS transform and cooperates with
 * assistive zoom. Roughly 40% of mobile sites offer no way to enlarge a product
 * photograph at all.
 */
export default function ProductGallery({ images = [], alt }) {
  const shots = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxRef = useRef(null);
  const trackRef = useRef(null);
  const railRef = useRef(null);
  useFocusTrap(lightboxRef, lightboxOpen, () => setLightboxOpen(false));

  useEffect(() => {
    setActive(0);
  }, [images]);

  /**
   * Moves the track by assigning scrollLeft rather than calling scrollTo with
   * `behavior: "smooth"`.
   *
   * That is not a preference. With `scroll-snap-type: mandatory` the snap
   * engine cancels a programmatic smooth scroll and re-snaps to where it
   * started: measured here, the counter advanced to "2 / 4" while scrollLeft
   * stayed at 0 — the arrows read as broken, and the caption lied about which
   * photograph you were looking at. A control that does nothing is far worse
   * than one that changes instantly, and swiping still has native momentum
   * because that path never goes through JS.
   */
  function scrollToIndex(index) {
    const track = trackRef.current;
    if (track) track.scrollLeft = index * track.clientWidth;
  }

  // Open on the image the shopper was already looking at, with no visible
  // scramble to get there — hence a layout effect, before paint.
  useLayoutEffect(() => {
    if (lightboxOpen) scrollToIndex(active);
  }, [lightboxOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!shots.length) {
    return <div className="aspect-[4/5] w-full bg-ink-200" />;
  }

  const count = shots.length;
  const label = (index) => `Image ${index + 1} of ${count}`;

  function goTo(index) {
    const next = (index + count) % count;
    setActive(next);
    scrollToIndex(next);
  }

  function onLightboxKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  }

  /** Arrow keys move between thumbnails without leaving the rail. */
  function onRailKeyDown(event) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? (active + 1) % count : (active - 1 + count) % count;
    setActive(next);
    railRef.current?.querySelectorAll("button")[next]?.focus();
  }

  const thumbnails = count > 1 && (
    <div
      ref={railRef}
      role="group"
      aria-label="Product images"
      onKeyDown={onRailKeyDown}
      className="grid grid-cols-5 gap-2 lg:grid-cols-1 lg:content-start"
    >
      {shots.map((src, index) => (
        <button
          key={`${src}-${index}`}
          type="button"
          onClick={() => setActive(index)}
          aria-pressed={active === index}
          aria-label={label(index)}
          className={classNames(
            "relative aspect-[4/5] overflow-hidden bg-ink-200 transition-colors duration-150 lg:w-[72px]",
            // An outline rather than a border, so the selected thumbnail does
            // not change size and shuffle the ones beside it.
            active === index
              ? "outline outline-2 -outline-offset-2 outline-wine-600"
              : "outline outline-1 -outline-offset-1 outline-brass-200 hover:outline-brass-400",
          )}
        >
          <SmartImage src={src} alt="" className="object-cover" sizes="120px" />
        </button>
      ))}
    </div>
  );

  return (
    <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-4">
      <div className="order-2 lg:order-1">{thumbnails}</div>

      <div className="order-1 flex justify-center lg:order-2">
        {/*
          Height leads, width follows. 42rem is a ceiling for very tall screens,
          where a photograph that simply keeps growing starts to look like a
          mistake rather than a decision.
        */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Open ${alt} full screen`}
          className="group relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden border border-brass-200 bg-ink-200 lg:h-[min(calc(100svh-14rem),42rem)] lg:w-auto"
        >
          <SmartImage
            src={shots[active]}
            alt={alt}
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-3 inline-flex h-10 items-center gap-2 border border-brass-200 bg-ink-50/95 px-3 text-body-sm font-semibold text-ink-800 transition-colors duration-150 group-hover:border-wine-600 group-hover:text-wine-600"
          >
            <Expand size={15} /> View
          </span>
        </button>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950">
          <div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} — full screen`}
            tabIndex={-1}
            onKeyDown={onLightboxKeyDown}
            className="grid h-full w-full grid-rows-[auto_minmax(0,1fr)_auto] outline-none"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="tabular text-body-sm text-white/80" aria-live="polite">
                {active + 1} / {count}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close gallery"
                className="grid h-11 w-11 place-items-center bg-ink-50 text-ink-900 transition-colors duration-150 hover:bg-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative min-h-0">
              {/*
                One scroll container, one slide per image, snapped. Swipe,
                momentum and pinch all come from the browser; `pan-x pinch-zoom`
                is what keeps both available at once. `scrollbar-none` only
                hides the bar — the track still scrolls by every other means.
              */}
              <div
                ref={trackRef}
                onScroll={(event) => {
                  const width = event.currentTarget.clientWidth;
                  if (!width) return;
                  const index = Math.round(event.currentTarget.scrollLeft / width);
                  if (index !== active && index >= 0 && index < count) setActive(index);
                }}
                className="scrollbar-none flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
                style={{ touchAction: "pan-x pinch-zoom" }}
              >
                {shots.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative h-full w-full shrink-0 snap-center"
                    aria-hidden={index !== active}
                  >
                    <SmartImage
                      src={src}
                      alt={index === active ? alt : ""}
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>

              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(active - 1)}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-ink-50/90 text-ink-900 transition-colors duration-150 hover:bg-white md:left-4"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(active + 1)}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-ink-50/90 text-ink-900 transition-colors duration-150 hover:bg-white md:right-4"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            <div className="px-4 py-3">
              {count > 1 && (
                <div className="mx-auto flex max-w-2xl justify-center gap-2">
                  {shots.map((src, index) => (
                    <button
                      key={`${src}-${index}`}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-pressed={active === index}
                      aria-label={label(index)}
                      className={classNames(
                        "relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-ink-900 transition-opacity duration-150",
                        active === index ? "outline outline-2 -outline-offset-2 outline-white" : "opacity-60 hover:opacity-100",
                      )}
                    >
                      <SmartImage src={src} alt="" className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-2 text-center text-caption text-white/70">
                Swipe or use the arrow keys · pinch to zoom · Esc to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
