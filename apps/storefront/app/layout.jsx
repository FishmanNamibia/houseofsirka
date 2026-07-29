import { display, body } from "./fonts";
import "./globals.css";

/**
 * Every page is rebuilt in the background at most five minutes after it goes
 * stale.
 *
 * Set once here rather than per route because the catalogue reaches even the
 * pages that show no products: /about and the rest carry the same header, so
 * their search overlay reads the same rail. Without it the whole site is frozen
 * at whatever the catalogue was when it was last deployed — a price changed in
 * the Medusa admin, or a piece selling out, would not reach the shop until
 * somebody triggered a build. Five minutes keeps pages as fast as static files
 * while making the admin feel connected to the shop; stock is re-checked at the
 * cart in any case.
 */
export const revalidate = 300;

export const metadata = {
  metadataBase: new URL("https://houseofsirka.com"),
  title: {
    default: "House of Sirka | Online Boutique",
    template: "%s | House of Sirka",
  },
  description:
    "A Windhoek boutique for dresses, tailoring, and intimate collections — classical silhouettes with a bright modern pulse.",
  openGraph: {
    type: "website",
    locale: "en_NA",
    siteName: "House of Sirka",
    title: "House of Sirka | Online Boutique",
    description:
      "A Windhoek boutique for dresses, tailoring, and intimate collections — classical silhouettes with a bright modern pulse.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans text-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-none focus:bg-wine-600 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
