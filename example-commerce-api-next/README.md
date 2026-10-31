# example-commerce-api-next

The Vegas Clubwear commerce REST API implemented with Next.js 16 route handlers (TypeScript) and `pg`. It returns the
same routes, response shapes, pricing rules and errors as `example-commerce-api-java`, so the React storefront works
against either one. See the root README for the contract.

## Run

```bash
docker compose up -d postgres     # from the repo root
cp .env.example .env.local
npm install
npm run dev                       # http://localhost:3001
```

The first API request creates the schema (`lib/schema.sql`, shared with the Java API) and seeds `data/catalog.json`.
An advisory lock makes this safe when several instances start at once.

| Env var | Default |
| --- | --- |
| `DATABASE_URL` | `postgres://commerce:commerce@localhost:5432/commerce_next` |
| `DB_POOL_SIZE` | `10` |
| `CORS_ALLOWED_ORIGIN` | `*` |

## Layout

```
app/api/**/route.ts    thin route handlers
lib/catalog-queries.ts listing/search SQL, facets, product detail, categories, home
lib/carts.ts           cart operations
lib/orders.ts          transactional checkout (row lock on the cart, conditional stock update)
lib/pricing.ts         promos, shipping, tax (integer cents)
lib/payment.ts         simulated gateway
lib/db.ts              pool, schema bootstrap, bulk seeding (unnest)
```

To instrument, add an `instrumentation.ts` at the project root (Next.js calls `register()` on startup).
