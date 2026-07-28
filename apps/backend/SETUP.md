# House of Sirka — backend setup

Project-specific notes. `README.md` is the Medusa starter's own documentation
and is left as shipped.

Medusa v2, pinned **2.18.0**. See
[`docs/adr/001-backend-architecture.md`](../docs/adr/001-backend-architecture.md)
for why Medusa rather than a custom Node backend.

## Running locally

Postgres and Redis must be up first. On this machine both run natively — no
Docker needed:

```bash
# Postgres 15 via Postgres.app, Redis via Homebrew
psql -h 127.0.0.1 -d houseofsirka -c 'select 1'
redis-cli ping
```

Then:

```bash
cd backend
npm run dev
```

| | |
|---|---|
| API | http://localhost:9001 |
| Admin | http://localhost:9001/app |
| Storefront | http://localhost:3080 |

**Port 9001, not Medusa's default 9000** — php-fpm already holds
`127.0.0.1:9000` on this machine, and the overlap is confusing to debug.

## Configuration notes

Two scaffolder defaults were wrong for our purposes. Both are corrected in
`apps/backend/medusa-config.ts` and `.env`:

1. **`JWT_SECRET` and `COOKIE_SECRET` shipped as the literal string
   `supersecret`.** These sign auth and session tokens; anyone who knows the
   default could forge either. Both regenerated as 64-character random hex.

2. **Redis was set in `.env` but never read by the config**, so Medusa started
   on its in-memory fallbacks and logged *"a fake redis instance will be used"*.
   Those fallbacks lose durable workflow state on restart, and the in-memory
   lock provider cannot coordinate between the server and worker processes —
   which is precisely what prevents two customers buying the same last item.
   The config now fails loudly if `REDIS_URL` is missing rather than quietly
   degrading.

Verify Redis is genuinely in use — BullMQ queues should be present:

```bash
redis-cli --scan --pattern 'bull:medusa-*' | head
```

## Admin access

Created with `npx medusa user -e <email> -p <password>`. Credentials are not
stored in this repository.
