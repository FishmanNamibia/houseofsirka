import { display, body } from "./fonts";
import "./globals.css";

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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-wine-600 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
