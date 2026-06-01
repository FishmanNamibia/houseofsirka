import "./globals.css";

export const metadata = {
  title: "House of Sirka | Online Boutique",
  description:
    "Premium CMS-driven online boutique storefront for House of Sirka.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
