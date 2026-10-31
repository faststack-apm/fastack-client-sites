# example-commerce-ui-react

The Vegas Clubwear storefront: a React 19 + Vite SPA that uses only the REST API, so it runs against either
`example-commerce-api-java` or `example-commerce-api-next`.

Pages: home (hero carousel, category tiles, product rails) · mega-menu navigation · collection pages with color, size,
price and brand filters, sorting and pagination · search · product detail (color and size selection, related items) ·
slide-out bag · cart with promo codes · checkout · order confirmation and order lookup.

## Run

```bash
npm install
npm run dev:java     # proxies /api to http://localhost:8080
npm run dev:next     # proxies /api to http://localhost:3001
```

`VITE_API_PROXY_TARGET` chooses the dev proxy target. Set `VITE_API_BASE_URL` to call an API directly instead
(the APIs allow CORS).

In Docker, nginx serves the build and proxies `/api` to `API_UPSTREAM`. The root compose file runs it twice: :5173 → Java
and :5174 → Next.js. The footer shows which API is answering.

Add your browser telemetry SDK in `src/telemetry.ts`.
