import { Cormorant_Garamond, Inter } from "next/font/google";

/**
 * Cormorant Garamond carries the boutique voice. It is optically small with
 * thin hairlines, so it is only used at 28px and above — see the "display-*"
 * scale in tailwind.config.js. Weight decreases as size grows.
 */
export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

/**
 * Inter handles everything below 28px. Large x-height keeps 14px metadata
 * legible on cream, and tabular figures keep N$ columns aligned.
 */
export const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
});
