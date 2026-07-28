import { Fraunces, Inter } from "next/font/google";

/**
 * Fraunces carries the boutique voice.
 *
 * Chosen over Cormorant Garamond for legibility: Cormorant is optically small
 * with hairline-thin strokes that go spindly below ~28px, which forced a hard
 * size floor and still read tired at card-title size. Fraunces has an optical-
 * size axis, so stroke weight increases automatically as the size drops — one
 * family stays comfortable from a 20px sub-head to an 80px hero.
 *
 * It is an old-style revival, so it keeps the "old-world heart" the brand copy
 * asks for while being noticeably warmer and easier on the eye.
 */
export const display = Fraunces({
  subsets: ["latin"],
  // Variable font: weight stays fluid, so `axes` may be declared but an
  // explicit weight list may not.
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  variable: "--font-display",
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

/**
 * Inter handles body and interface. Large x-height keeps small metadata legible
 * on cream, and tabular figures keep N$ columns aligned.
 */
export const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
});
