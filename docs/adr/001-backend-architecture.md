# ADR 001 — Backend architecture

**Status:** Accepted · 2026-07-28

## Context

The storefront was a Next.js prototype with no backend. Products, orders,
customers, cart and wishlist all lived in the visitor's `localStorage`, which
meant:

- "Login" was an unverified email lookup — entering any address showed that
  person's order history.
- Orders existed only in the browser that placed them; clearing the cache lost
  them.
- Each visitor held their own copy of the catalogue, so admin edits never
  reached anyone.
- Stock decremented locally, so two customers could buy the same last item.

The shop needs real accounts, durable orders, and shared inventory before it can
take money from anyone.

## Decision

**Self-hosted Medusa v2 (pinned 2.18.0), Postgres and Redis, with the existing
Next.js storefront consuming it over the JS SDK.**

### Why not build custom on Node

The original instinct was to write a backend from scratch. Node itself is a
perfectly good choice — commerce is IO-bound, which is where Node is strong, and
language is not the risk here. The risk is the commerce primitives:

- inventory reservations that survive concurrent checkout
- an order state machine
- a promotions engine
- a variant and price matrix
- an admin UI

That is roughly four to six months of work to reach the point where
`create-medusa-app` starts, and every one of those is a place where bugs cost
real money — oversold stock, double-charged customers, orders that silently
change after the fact.

Medusa is MIT-licensed and self-hosted, so choosing it does not trade ownership
for speed. There is no GMV fee, no vendor lock-in, and the source can be forked.

### Why not the alternatives

| Option | Reason rejected |
|---|---|
| **Payload CMS ecommerce plugin** | Officially Beta, Stripe-only, handles no shipping or tax. Tempting because it is Next.js-native, but the wrong foundation for money. |
| **Saleor** | Mature and BSD-licensed, but Python/Django/Celery across six services. Wrong language for a JavaScript team. |
| **Vendure** | Technically excellent. GPLv3 by default plus a heavier GraphQL/NestJS conceptual load; MIT and a simpler surface tipped it to Medusa. |
| **Supabase alone** | A database with auth attached, not a commerce engine. Every commerce rule would still be hand-written. |

### Consequences

- **The backend is TypeScript.** Medusa is TS-first; every documentation example
  and community answer assumes it. The storefront stays JavaScript.
- **Four processes to run**: Postgres, Redis, the Medusa server and a Medusa
  worker. Redis is not optional in production — it backs the workflow engine and
  event bus, and the in-memory fallback loses durable workflow state on restart.
- **Pin exact minor versions.** Medusa minors have carried breaking changes in
  extension surfaces (admin widget injection zones, ORM relation handling).
  Budget time per upgrade rather than tracking latest.
- **Money.** Medusa stores prices as decimals in major units, not integer minor
  units. NAD has two decimals so this is the well-trodden case, but any code
  comparing a Medusa total against a bank statement must compare rounded
  minor-unit integers, never floats.

## Payments

**No payment gateway integration in the first release.** Card payment was
removed at the owner's request — no card details are collected, transmitted or
stored anywhere in this system, which keeps the shop at the lightest PCI-DSS
tier and removes an entire category of liability.

PayToday was investigated and dropped: it publishes no public API
documentation, only a WooCommerce plugin, so there is nothing to integrate
against without a commercial conversation.

Every remaining rail is therefore **manual**, handled by Medusa's built-in
manual payment provider:

| Rail | How it works |
|---|---|
| EFT bank transfer | Customer transfers using the order number as reference |
| FNB eWallet | `*140*321#`, N$5,000 cap |
| PayPulse / BlueVoucher (Standard Bank) | `*140*6626#`, PIN valid 72 hours |
| EasyWallet (Bank Windhoek) | `*140*295#` |
| Send Money (Nedbank) | N$5,000 daily cap |
| FNB Pay2Cell | FNB to FNB only |
| Cash on delivery | Windhoek and Okahandja |

In each case the order is placed, payment sits pending, the customer uploads
proof, and the shop confirms it by hand. If a gateway is added later it becomes
one custom payment provider — a full-page redirect, never an embedded iframe,
since a redirect keeps the shop outside the PCI script-integrity requirements
that apply to embedded payment forms.

## Security

- Passwords hashed with argon2id at the current OWASP minimum: m=19456 KiB,
  t=2, p=1.
- Opaque session cookies, `Secure`, `HttpOnly`, `SameSite=Lax`. Not `Strict` —
  that breaks the return leg of any future payment redirect.
- Login rate limiting keyed to the **account**, not the source IP, since an
  attacker rotates IPs freely.
- Proof-of-payment uploads contain bank account numbers: validate by magic
  bytes rather than file extension, store outside the web root, serve only
  through signed URLs, and expire on a schedule.

## Data protection

Namibia has **no Data Protection Act in force**. A draft Bill has existed since
2021 and had not been enacted as of early 2026, so there are currently no
statutory breach-notification, registration or security-standard obligations —
only Article 13 of the Constitution and sector-specific confidentiality law.

We build to the draft Bill's shape anyway, because it will pass eventually and
retrofitting consent records and deletion into a live shop is far more expensive
than building them in. South Africa's POPIA is fully in force with an active
regulator, and applies to any South African customer.

Concretely: soft-delete with a PII-scrub path on customers, an audit log of
admin access to customer records, a marketing-consent flag kept separate from
account creation, and a documented retention period.

## Hosting

Not yet decided. Hetzner at roughly €20/month is the leading candidate on
cost and operational quality, with AWS `af-south-1` (Cape Town) the
lower-latency, roughly five-times-more-expensive alternative.

**Measure before committing** — no published Windhoek latency figures were
found, so this should be settled with `mtr -rwc 100` from a Windhoek connection
against both, not with estimates.
