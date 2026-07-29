/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      /**
       * Every original brand hex is preserved, repositioned into a numeric ramp.
       * Contrast ratios noted below are against ink-100 (#FFF9F1), the page
       * surface. The DEFAULT aliases keep the pre-ramp class names compiling
       * during the migration; they are removed in the final consolidation pass.
       */
      colors: {
        // Warm neutral — absorbs pearl, paper, cream, charcoal, ink
        ink: {
          50: "#FFFDF8", // was `pearl`
          100: "#FFF9F1", // was `paper`
          200: "#F7EAD8", // was `cream`
          300: "#E7DCCB",
          400: "#C9BCA6",
          500: "#9C9084",
          600: "#6E655C", //  5.46:1 — floor for real text
          700: "#4A443E", //  9.18:1
          800: "#282624", // was `charcoal` — 14.41:1
          900: "#151413", // was `ink` — 17.59:1
          950: "#0B0A09",
          DEFAULT: "#151413",
        },
        // Primary — absorbs wine, merlot, blush, petal
        wine: {
          50: "#FCE7E2", // was `petal`
          100: "#F7D8D4", // was `blush`
          200: "#F0B9C4",
          300: "#DE8399",
          400: "#C4506F", //  4.25:1 — large text only
          500: "#A82A4E", //  6.46:1
          600: "#8B1E3F", // was `wine` — 8.52:1 (white on it: 8.92:1)
          700: "#6E1832", // 10.91:1 — button hover
          800: "#561026", // was `merlot` — 13.40:1
          900: "#3C0B1B",
          950: "#240610",
          DEFAULT: "#8B1E3F",
        },
        // Metallic accent — absorbs brass and marigold
        brass: {
          50: "#FDF7EA",
          100: "#FAECC9",
          200: "#F5DA9B", // decorative hairlines
          300: "#F2B84B", // was `marigold` (ink-900 on it: 10.28:1)
          400: "#D69C3C",
          500: "#B88933", // was `brass` — 3.01:1, NON-TEXT ONLY
          600: "#9C7129", //  4.18:1 — control borders
          700: "#7A5A1F", //  6.06:1 — gold that is legible as text
          800: "#5C4417", //  8.75:1
          900: "#3E2E0F",
          950: "#271D09",
          DEFAULT: "#B88933",
        },
        // Positive / secondary — absorbs garden
        garden: {
          50: "#EEF5F1",
          100: "#D7E7DD",
          300: "#8FB9A3",
          500: "#3F7A5E",
          600: "#356850",
          700: "#2F5B47", // was `garden` — 7.41:1
          800: "#22422F",
          DEFAULT: "#2F5B47",
        },
        // Attention / sale — absorbs clay
        clay: {
          50: "#FDF1EB",
          100: "#F9DCCF",
          300: "#EBA88B",
          500: "#D36B4A", // was `clay` — 3.36:1, NON-TEXT ONLY
          600: "#B85735", //  4.51:1
          700: "#A44A2C", //  5.58:1 — sale price text
          800: "#7E3820",
          DEFAULT: "#D36B4A",
        },

        // Legacy flat aliases still referenced during the migration.
        paper: "#FFF9F1",
        pearl: "#FFFDF8",
        cream: "#F7EAD8",
        charcoal: "#282624",
        merlot: "#561026",
        blush: "#F7D8D4",
        petal: "#FCE7E2",
        marigold: "#F2B84B",
      },

      /**
       * Page shell width. 1280px (max-w-7xl) left noticeable dead margin on the
       * 1440px+ displays most desktop shoppers use, and squeezed the product
       * grid to four columns when there was room for five.
       */
      /**
       * 52px. Tailwind jumps 48px (h-12) to 56px (h-14); the primary action on
       * checkout and account wants the step between. `h-13` was already in use
       * and compiling to nothing, so the button was sized by padding alone.
       */
      height: {
        13: "3.25rem",
      },

      maxWidth: {
        shell: "1600px",
        "shell-narrow": "1100px",
      },

      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "Cambria", "serif"],
      },

      /**
       * Marcellus ships one weight, so hierarchy comes from size and colour
       * rather than bolding. Sizes sit slightly below the Fraunces scale they
       * replace: Marcellus has a taller cap height and reads larger at the same
       * point size.
       *
       * Every text token keeps line-height >= 1.5 (WCAG SC 1.4.12).
       */
      fontSize: {
        "display-2xl": ["4rem", { lineHeight: "1.08", letterSpacing: "-0.015em", fontWeight: "400" }],
        "display-xl": ["3rem", { lineHeight: "1.12", letterSpacing: "-0.012em", fontWeight: "400" }],
        "display-lg": ["2.375rem", { lineHeight: "1.18", letterSpacing: "-0.010em", fontWeight: "400" }],
        "display-md": ["1.75rem", { lineHeight: "1.26", letterSpacing: "-0.006em", fontWeight: "400" }],
        "display-sm": ["1.375rem", { lineHeight: "1.34", letterSpacing: "-0.002em", fontWeight: "400" }],
        "display-xs": ["1.125rem", { lineHeight: "1.44", letterSpacing: "0", fontWeight: "400" }],

        // Inter. 17px base — the extra step over 16px measurably eases reading
        // on the warm, low-contrast background.
        "body-lg": ["1.1875rem", { lineHeight: "1.68", letterSpacing: "0" }],
        body: ["1.0625rem", { lineHeight: "1.65", letterSpacing: "0" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.60", letterSpacing: "0.003em" }],
        caption: ["0.8125rem", { lineHeight: "1.538", letterSpacing: "0.010em" }],
        label: ["0.8125rem", { lineHeight: "1.400", letterSpacing: "0.020em", fontWeight: "600" }],
        eyebrow: ["0.75rem", { lineHeight: "1.333", letterSpacing: "0.140em", fontWeight: "700" }],
        micro: ["0.6875rem", { lineHeight: "1.454", letterSpacing: "0.080em", fontWeight: "700" }],
      },

      boxShadow: {
        soft: "0 18px 55px rgba(21, 20, 19, 0.12)",
        raised: "0 2px 8px rgba(21, 20, 19, 0.06)",
      },
    },
  },
  plugins: [],
};
