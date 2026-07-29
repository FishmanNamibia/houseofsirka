import { Marcellus, Inter } from "next/font/google";

/**
 * Marcellus carries the boutique voice.
 *
 * Third attempt, and the reasoning for landing here:
 *
 *   Cormorant Garamond — genuinely elegant, but optically small with hairline
 *   strokes. It needed a hard 28px floor and still read tired on product cards.
 *
 *   Fraunces — solved legibility with its optical-size axis, but it is a warm,
 *   characterful face. The softened terminals and WONK axis read friendly
 *   rather than refined, which is the wrong register for a boutique.
 *
 *   Marcellus — modelled on Roman inscriptional capitals, the oldest luxury
 *   signal in typography. Restrained rather than decorative, with strokes
 *   sturdy enough to hold at 18px, so headings stay elegant without a size
 *   floor.
 *
 * It ships a single weight, which is a constraint worth accepting: hierarchy
 * comes from size and colour rather than bolding, and that restraint is itself
 * the premium signal. Where emphasis is genuinely needed — prices, buttons,
 * labels — Inter carries it.
 */
export const display = Marcellus({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-display",
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

/**
 * Inter does the functional work: prices, sizes, filters, forms, measurement
 * tables. Large x-height keeps 15px metadata legible on cream, and tabular
 * figures keep N$ columns aligned.
 */
export const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
});
