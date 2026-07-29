import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'
import { houseOfSirkaAdminBrand } from './admin-brand'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const REDIS_URL = process.env.REDIS_URL

/**
 * Redis is not optional here.
 *
 * Without it Medusa silently substitutes an in-memory event bus, workflow
 * engine and lock provider. Those are development conveniences: they lose
 * durable workflow state on restart, and the in-memory lock cannot coordinate
 * across the server and worker processes — which is exactly what stops two
 * customers buying the same last item.
 *
 * The scaffolded config never read REDIS_URL, so the server was starting on
 * fake Redis while a real instance sat unused on 6379.
 */
if (!REDIS_URL) {
  throw new Error(
    'REDIS_URL is not set. Medusa would fall back to in-memory event bus, ' +
      'workflow engine and locking, which lose state on restart and cannot ' +
      'coordinate across processes. Set REDIS_URL in apps/backend/.env.',
  )
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  /**
   * `vite` is the only hook that reaches the whole dashboard rather than the
   * zones inside it, so it is what brands the login screen, the browser title
   * and the favicon. See admin-brand.ts.
   */
  admin: {
    /**
     * Returns only the additions, never a copy of the config it was handed.
     *
     * The signature reads `(config: InlineConfig) => InlineConfig`, which
     * invites you to spread the incoming config and return the whole thing.
     * Medusa then runs `mergeConfig(baseConfig, yours)`, and Vite's merge
     * concatenates arrays — so every plugin already present arrives twice.
     * React lands twice with it, and the dev server dies on a duplicated
     * react-refresh preamble ("The symbol 'inWebWorker' has already been
     * declared"). The production build does not complain, so this only shows
     * up when someone runs the admin locally.
     */
    vite: () => ({
      plugins: [houseOfSirkaAdminBrand()],
      // Inlined at build time; the admin is a static bundle with no server to
      // ask where the shop lives.
      define: {
        __SIRKA_STOREFRONT_URL__: JSON.stringify(
          process.env.STOREFRONT_URL || 'http://localhost:3080',
        ),
      },
    }),
  },
  modules: [
    {
      resolve: '@medusajs/medusa/cache-redis',
      options: { redisUrl: REDIS_URL },
    },
    {
      resolve: '@medusajs/medusa/event-bus-redis',
      options: { redisUrl: REDIS_URL },
    },
    {
      resolve: '@medusajs/medusa/workflow-engine-redis',
      options: { redis: { url: REDIS_URL } },
    },
    {
      // Locking backs inventory reservations. Redis so the server and worker
      // processes contend on the same lock rather than one each.
      resolve: '@medusajs/medusa/locking',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/locking-redis',
            id: 'locking-redis',
            is_default: true,
            options: { redisUrl: REDIS_URL },
          },
        ],
      },
    },
  ],
})
