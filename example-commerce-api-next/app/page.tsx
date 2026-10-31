const endpoints = [
  'GET /api/health', 'GET /api/store', 'GET /api/menu', 'GET /api/home', 'GET /api/categories',
  'GET /api/categories/{slug}', 'GET /api/products?collection=&q=&color=&size=&brand=&minPrice=&maxPrice=&sort=&page=&pageSize=',
  'GET /api/collections/{slug}/products', 'GET /api/products/{slug}', 'POST /api/carts', 'GET /api/carts/{id}',
  'POST /api/carts/{id}/items', 'PATCH /api/carts/{id}/items/{itemId}', 'DELETE /api/carts/{id}/items/{itemId}',
  'POST /api/carts/{id}/promo', 'DELETE /api/carts/{id}/promo', 'POST /api/orders', 'GET /api/orders/{orderNumber}',
];

export default function Home() {
  return (
    <main>
      <h1>Vegas Clubwear Commerce API — Next.js</h1>
      <p>REST API only. Point the React storefront at this server.</p>
      <ul>{endpoints.map((e) => <li key={e}><code>{e}</code></li>)}</ul>
    </main>
  );
}
