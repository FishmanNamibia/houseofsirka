# House of Sirka Online Boutique

House of Sirka is now scaffolded as a **Next.js + Tailwind CSS** boutique prototype. The app includes a polished public storefront plus CMS-style admin modules for the e-commerce requirements in the project brief.

## Run Locally

```bash
npm.cmd install
npm.cmd run dev
```

Then open:

```text
http://localhost:3080
```

Admin CMS:

```text
http://localhost:3080/admin
```

Demo admin login:

```text
Email: admin@houseofsirka.local
Password: sirka-admin
```

## Current Implementation

- Next.js app router project structure
- Tailwind CSS design system with boutique colors, responsive layouts, and product-focused UI
- House of Sirka logo assets extracted from the supplied PDF and used across storefront/admin branding
- Premium homepage/storefront with CMS-controlled announcement, hero, and campaign copy
- Product catalog with search, category, size, color, max-price, and sorting filters
- Product detail modal with variants, stock, wishlist, and add-to-cart
- Cart drawer with quantities, admin-managed promotion codes, delivery, tax, and total calculation
- Checkout that requires customer contact/address details, supports guest or registered customer profile creation, and deducts variant inventory
- Payment methods for online card payment, eWallet transfer, EFT bank transfer, and pay upon delivery
- Proof-of-payment upload requirement for eWallet and EFT checkout
- Customer account section with wishlist and order tracking timeline
- Login-gated admin control center at `/admin` with role selector
- Admin client roster with customer contact details and payment follow-up queue
- Product CMS for adding products with uploaded product images and archiving/restoring products
- Content CMS for homepage and campaign copy updates
- Order management with status changes
- Promotions panel with create/edit/toggle/delete controls, targeting rules, dates, usage tracking, and checkout integration
- Inventory panel with variant stock updates and stock movement logs
- Reports dashboard with revenue, average order, stock, and role permissions

## Seed Promotions

- `SIRKA10`: 10% off carts over N$800
- `FREESHIP`: free delivery

## Production Next Steps

This is still a front-end prototype. Before launch, connect it to production services:

- Real authentication and server-enforced role permissions
- PostgreSQL/MySQL database for users, products, variants, carts, orders, coupons, CMS content, reviews, and inventory logs
- Strapi, Directus, Shopify, WooCommerce, or a custom admin backend
- Payment gateway with webhook verification
- Shipping zones, delivery fees, courier tracking, returns, and refunds
- Email/SMS notifications
- Secure image/media uploads and CDN storage
- SEO metadata, sitemap, analytics, backups, monitoring, and audit logs
