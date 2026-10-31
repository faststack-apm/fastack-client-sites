# Fastack demo client sites

Three example "customer" sites to instrument with telemetry for the Fastack APM product.

| Folder | What | Stack | Local port |
| --- | --- | --- | --- |
| `example-commerce-api-java` | **Vegas Clubwear** commerce REST API | Java 21, Spring Boot 4.1, JPA/Hibernate, PostgreSQL | 8080 |
| `example-commerce-api-next` | The same API, same contract | Next.js 16 route handlers, TypeScript, `pg` | 3001 |
| `example-commerce-ui-react` | Vegas Clubwear storefront (works with either API) | React 19, Vite, React Router | 5173 (→ Java), 5174 (→ Next) |
| `marketing-site-wordpress` | **Desert Air Heating & Cooling** marketing site with a contact form | WordPress 6.8, PHP 8.3, MariaDB | 8088 (Mailpit 8025) |
| `tools/catalog-generator` | Generates the shared product catalog | Node | — |
| `infra/postgres` | Creates one database per commerce API | — | 5432 |

## Run everything

```bash
docker compose up -d --build
```

- Storefront → Java API: http://localhost:5173
- Storefront → Next.js API: http://localhost:5174
- HVAC site: http://localhost:8088 (wp-admin: `admin` / `admin`), emails at http://localhost:8025

Run a single stack: `docker compose up -d --build postgres commerce-api-java commerce-ui-java`
(or `... commerce-api-next commerce-ui-next`, or `wordpress setup mailpit`).

## The commerce catalog

The catalog mirrors the reference clubwear site's navigation: **112 categories with 75 products each (8,400
products)**, plus 22 rule-based collections (New, Halloween, Clearance and its sub-collections, Under $20, Doorbusters,
brand pages). Every collection has at least 75 products, and the generator fails if one does not.
`tools/catalog-generator/generate.mjs` writes the same deterministic `catalog.json` into both APIs, so they serve
identical data. Each API seeds its own database from it on first start.

```bash
node tools/catalog-generator/generate.mjs   # regenerate after editing taxonomy.mjs
```

Branding: the store is named Vegas Clubwear. Real shoe brands and licensed character names from the reference site are
replaced with fictional ones (for example Stiletto Society, Gothika, Cape Royale, Harlequin Costumes). Product images are
SVG silhouettes tinted with each product's color, so no third-party photos are used.

## API contract (both implementations)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | `{status, service}` — the storefront footer shows which backend is serving |
| GET | `/api/store`, `/api/menu`, `/api/home` | store settings, mega-menu, home page sections |
| GET | `/api/categories`, `/api/categories/{slug}` | breadcrumbs, children, counts |
| GET | `/api/products` | `collection, q, color*, size*, brand*, minPrice, maxPrice, sort, page, pageSize, facets` |
| GET | `/api/collections/{slug}/products` | same filters, collection in the path |
| GET | `/api/products/{slug}` | detail with sizes, colors, breadcrumbs and related products |
| POST | `/api/carts` | create a cart |
| GET | `/api/carts/{id}` | cart with totals |
| POST | `/api/carts/{id}/items` | `{productId, color, size, quantity}`; merges duplicate lines |
| PATCH / DELETE | `/api/carts/{id}/items/{itemId}` | `{quantity}`; 0 removes the line |
| POST / DELETE | `/api/carts/{id}/promo` | `VEGAS10` (10% off), `JACKPOT20` (20% off $100+) |
| POST | `/api/orders` | reserves stock in a transaction, calls a simulated payment gateway (80–250 ms) |
| GET | `/api/orders/{orderNumber}?email=` | order lookup |

`sort` accepts `featured`, `best_selling`, `newest`, `price_asc`, `price_desc`, `rating` or `name`. Errors use the shape
`{status, code, message, path, timestamp}`. Pricing: free shipping at $50+ (otherwise $7.95), express $14.95, tax 8.375%.
Test cards: `4242 4242 4242 4242` is approved and `4000 0000 0000 0002` is declined (402).

## Built-in behavior for APM demos

- Realistic database work: correlated `EXISTS` filters, four facet aggregation queries per listing, batched collection
  fetches in Hibernate, and transactional checkout with row-level stock updates.
- Payment latency is simulated, and declines return errors you can trace.
- Telemetry entry points:
  - **Java:** set `JAVA_TOOL_OPTIONS=-javaagent:...` on the container.
  - **Next.js:** add `instrumentation.ts`.
  - **Browser:** `example-commerce-ui-react/src/telemetry.ts`.
  - **WordPress:** the `da_lead_created` action.
