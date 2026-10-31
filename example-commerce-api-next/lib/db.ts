import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool, type PoolClient, type QueryResultRow } from 'pg';
import { catalog } from './catalog';

const globalForDb = globalThis as unknown as { __pool?: Pool; __ready?: Promise<void> };

function pool(): Pool {
  if (!globalForDb.__pool) {
    globalForDb.__pool = new Pool({
      connectionString: process.env.DATABASE_URL ?? 'postgres://commerce:commerce@localhost:5432/commerce_next',
      max: Number(process.env.DB_POOL_SIZE ?? 10),
    });
  }
  return globalForDb.__pool;
}

/** Creates the schema and seeds the catalog the first time the API touches the database. */
export function ready(): Promise<void> {
  if (!globalForDb.__ready) {
    globalForDb.__ready = initialize().catch((err) => {
      globalForDb.__ready = undefined;
      throw err;
    });
  }
  return globalForDb.__ready;
}

export async function query<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ready();
  const res = await pool().query<T>(sql, params);
  return res.rows;
}

export async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  await ready();
  const client = await pool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function initialize(): Promise<void> {
  const client = await pool().connect();
  try {
    // Serialize schema creation/seeding across processes.
    await client.query('SELECT pg_advisory_lock(424242)');
    await client.query(readFileSync(join(process.cwd(), 'lib', 'schema.sql'), 'utf8'));
    const { rows } = await client.query<{ n: string }>('SELECT count(*) AS n FROM products');
    if (Number(rows[0].n) === 0) await seed(client);
  } finally {
    await client.query('SELECT pg_advisory_unlock(424242)').catch(() => {});
    client.release();
  }
}

async function seed(client: PoolClient): Promise<void> {
  const started = Date.now();
  const { categories, products } = catalog();
  await client.query('BEGIN');
  await client.query(
    `INSERT INTO categories (slug, name, parent_slug, type, depth, sort_order, description, product_count,
       rule_scope, rule_is_new, rule_on_sale, rule_doorbuster, rule_max_price, rule_brand)
     SELECT * FROM unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::int[], $6::int[], $7::text[], $8::int[],
       $9::text[], $10::bool[], $11::bool[], $12::bool[], $13::numeric[], $14::text[])`,
    [
      categories.map((c) => c.slug), categories.map((c) => c.name), categories.map((c) => c.parentSlug),
      categories.map((c) => c.type), categories.map((c) => c.depth), categories.map((c) => c.sortOrder),
      categories.map((c) => c.description), categories.map((c) => c.productCount),
      categories.map((c) => c.rule?.scope ?? null), categories.map((c) => c.rule?.isNew ?? null),
      categories.map((c) => c.rule?.onSale ?? null), categories.map((c) => c.rule?.doorbuster ?? null),
      categories.map((c) => c.rule?.maxPrice ?? null), categories.map((c) => c.rule?.brand ?? null),
    ],
  );
  const CHUNK = 2000;
  for (let i = 0; i < products.length; i += CHUNK) {
    const ps = products.slice(i, i + CHUNK);
    await client.query(
      `INSERT INTO products (id, sku, slug, name, brand, category_slug, kind, image_key, description, material, price,
         compare_at_price, on_sale, is_new, doorbuster, stock, rating, review_count, created_at)
       SELECT * FROM unnest($1::bigint[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[],
         $8::text[], $9::text[], $10::text[], $11::numeric[], $12::numeric[], $13::bool[], $14::bool[], $15::bool[],
         $16::int[], $17::float8[], $18::int[], $19::timestamptz[])`,
      [
        ps.map((p) => p.id), ps.map((p) => p.sku), ps.map((p) => p.slug), ps.map((p) => p.name), ps.map((p) => p.brand),
        ps.map((p) => p.categorySlug), ps.map((p) => p.kind), ps.map((p) => p.imageKey), ps.map((p) => p.description),
        ps.map((p) => p.material), ps.map((p) => p.price), ps.map((p) => p.compareAtPrice), ps.map((p) => p.onSale),
        ps.map((p) => p.isNew), ps.map((p) => p.doorbuster), ps.map((p) => p.stock), ps.map((p) => p.rating),
        ps.map((p) => p.reviewCount), ps.map((p) => p.createdAt),
      ],
    );
    const colors = ps.flatMap((p) => p.colors.map((c, pos) => [p.id, pos, c.name, c.hex] as const));
    await client.query(
      `INSERT INTO product_colors (product_id, position, name, hex)
       SELECT * FROM unnest($1::bigint[], $2::int[], $3::text[], $4::text[])`,
      [colors.map((c) => c[0]), colors.map((c) => c[1]), colors.map((c) => c[2]), colors.map((c) => c[3])],
    );
    const sizes = ps.flatMap((p) => p.sizes.map((s, pos) => [p.id, pos, s] as const));
    await client.query(
      `INSERT INTO product_sizes (product_id, position, size) SELECT * FROM unnest($1::bigint[], $2::int[], $3::text[])`,
      [sizes.map((s) => s[0]), sizes.map((s) => s[1]), sizes.map((s) => s[2])],
    );
    const paths = ps.flatMap((p) => p.categoryPath.map((slug, pos) => [p.id, pos, slug] as const));
    await client.query(
      `INSERT INTO product_categories (product_id, position, category_slug)
       SELECT * FROM unnest($1::bigint[], $2::int[], $3::text[])`,
      [paths.map((s) => s[0]), paths.map((s) => s[1]), paths.map((s) => s[2])],
    );
  }
  await client.query('COMMIT');
  console.log(`[seed] ${categories.length} categories and ${products.length} products in ${Date.now() - started} ms`);
}
