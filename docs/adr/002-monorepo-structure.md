# ADR 002 — Monorepo structure and deployment

**Status:** Accepted · 2026-07-28

## Context

`create-medusa-app` scaffolds a Turborepo of its own. Running it as
`create-medusa-app backend` therefore nested one repo inside another, leaving:

```
houseofsirka/
├── app/  components/  lib/      storefront, at the repo root
├── package.json                 no workspaces declared
├── package-lock.json
├── pnpm-lock.yaml               a second, stale lockfile
└── backend/
    ├── package.json             workspaces: apps/**
    ├── turbo.json
    ├── package-lock.json        a third lockfile
    └── apps/backend/            the actual Medusa app
```

Three problems, in order of severity:

1. **Two lockfiles at the repository root**, neither authoritative, and nothing
   declaring pnpm. Installs were nondeterministic — two developers could resolve
   different dependency trees from the same commit.
2. **Asymmetric depth.** Storefront at depth 0, backend at depth 2. Every
   script, CI path and container build context has to special-case one of them.
3. **The workspace root was the wrong one.** Turbo lived under `backend/`, so it
   could only see the backend: no shared build cache, no shared packages, and no
   way to stop the two sides duplicating code.

Point 3 was already costing us. Currency formatting and the order-status
vocabulary live in the storefront and were about to be written a second time in
the backend. When those drift, a customer is quoted one total and charged
another, or an order arrives in a state the storefront cannot render.

## Decision

Flatten to a conventional monorepo with a single workspace root:

```
houseofsirka/
├── apps/
│   ├── storefront/     Next.js 16, JavaScript
│   └── backend/        Medusa v2.18.0, TypeScript
├── packages/
│   └── shared/         currency, order status, payment vocabulary
├── turbo.json
├── package.json        workspaces: apps/*, packages/*
└── package-lock.json   one lockfile
```

Workspaces are namespaced `@sirka/storefront`, `@sirka/backend` and
`@sirka/shared` so `npm --workspace` and turbo filters are unambiguous.

Everything moved with `git mv`, so file history follows.

### What `packages/shared` is for

Only the values whose divergence is expensive: the currency code and symbol,
minor-unit conversion, order and payment status vocabulary, and the payment
rails. It is deliberately small. Anything either side can own alone should stay
where it is.

Money is held as **integer minor units**. Floating point cannot represent most
decimal fractions exactly, so accumulating prices as floats yields totals a cent
out and irreproducible. This matters more than usual here because Medusa stores
prices as decimals in *major* units, so any comparison between a Medusa total
and a bank statement must convert and compare integers.

## Deployment

| | |
|---|---|
| Storefront | Vercel, root directory `apps/storefront` |
| Backend | Hetzner VPS, `apps/backend` |
| Database | Postgres, on the same VPS initially |
| Cache / queues | Redis, on the same VPS |

**Why split rather than one host.** The two have opposite profiles. The
storefront is mostly static: product and collection pages are prerendered and
served from a CDN edge, so latency to the origin barely matters. The backend is
stateful, needs Postgres and Redis beside it, and runs as *two* processes —
server and worker.

**Why Hetzner over AWS Cape Town.** Roughly €20/month against roughly five times
that for a comparable managed setup in `af-south-1`. The latency penalty is
real — Europe to Namibia is on the order of 150–300ms — but it is paid only on
cart and checkout requests, not on browsing, because the pages a shopper spends
their time on are served from the edge.

**This should be measured, not assumed.** No published Windhoek latency figures
were found. Before committing, from a Windhoek connection:

```bash
mtr -rwc 100 <hetzner-host>
mtr -rwc 100 ec2.af-south-1.amazonaws.com
```

If checkout latency proves unacceptable, `af-south-1` is the fallback and the
only change is where the backend runs.

**Namibia's international capacity rides the WACS submarine cable**, which lands
at Swakopmund and has historically failed. Whichever host is chosen, the shop
should degrade rather than break when the origin is unreachable: static product
pages keep serving from the CDN, and only checkout stops.

## Consequences

- One lockfile. `npm install` at the root installs both apps.
- `npm run dev` runs both; `npm run storefront:dev` and `npm run backend:dev`
  run one.
- Turbo caches builds across both apps.
- The backend is TypeScript and the storefront is JavaScript. `packages/shared`
  is plain JavaScript with JSDoc so both consume it without a build step.
- `apps/backend/AGENTS.md` came from the Medusa scaffold and describes the
  structure this ADR replaces. It carries a note pointing here.
