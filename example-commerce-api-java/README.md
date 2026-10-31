# example-commerce-api-java

Vegas Clubwear commerce REST API — Java 21 and Spring Boot 4.1 (Spring MVC, Data JPA/Hibernate, Bean Validation,
Actuator) on PostgreSQL. See the root README for the API contract.

## Run

```bash
# with Postgres from the root compose file
docker compose up -d postgres            # from the repo root
./mvnw spring-boot:run                   # http://localhost:8080

# or with no Docker at all (in-memory H2)
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

On first start, `schema.sql` creates the tables and `CatalogSeeder` bulk-loads `src/main/resources/catalog/catalog.json`
(8,400 products), before the server starts accepting requests.

| Env var | Default |
| --- | --- |
| `PORT` | `8080` |
| `DB_URL` / `DB_USER` / `DB_PASSWORD` | `jdbc:postgresql://localhost:5432/commerce_java` / `commerce` / `commerce` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:4173` |

Actuator: `/actuator/health`, `/actuator/metrics`.

## Layout

```
catalog/   Category, Product entities · ProductSearchService (Criteria API: filters, sort, facets) · CatalogSeeder
cart/      Cart, CartItem · CartService · Pricing (promos, shipping, tax)
order/     CustomerOrder, OrderItem · OrderService (transactional checkout) · PaymentGateway (simulated)
content/   StoreContent — loads catalog.json (menu, home layout, store settings)
common/    error handling, CORS, health
```

To instrument, attach a Java agent: `JAVA_TOOL_OPTIONS="-javaagent:/path/agent.jar"`.
