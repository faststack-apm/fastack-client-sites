import { catalog } from './catalog';
import { query } from './db';
import { ApiError } from './errors';

// ---------- shapes (identical to the Java API) ----------
export interface ColorDto { name: string; hex: string }
export interface ProductSummary {
  id: number; slug: string; name: string; brand: string; categorySlug: string; imageKey: string;
  price: number; compareAtPrice: number | null; onSale: boolean; isNew: boolean; doorbuster: boolean;
  colors: ColorDto[]; rating: number; reviewCount: number; inStock: boolean;
}
export interface Crumb { slug: string; name: string }

interface ProductDbRow {
  id: string; sku: string; slug: string; name: string; brand: string; category_slug: string; kind: string;
  image_key: string; description: string; material: string; price: string; compare_at_price: string | null;
  on_sale: boolean; is_new: boolean; doorbuster: boolean; stock: number; rating: number; review_count: number;
  created_at: Date;
}
interface CategoryDbRow {
  slug: string; name: string; parent_slug: string | null; type: string; depth: number; sort_order: number;
  description: string; product_count: number; rule_scope: string | null; rule_is_new: boolean | null;
  rule_on_sale: boolean | null; rule_doorbuster: boolean | null; rule_max_price: string | null; rule_brand: string | null;
}

export interface ProductQuery {
  collection?: string; q?: string; colors: string[]; sizes: string[]; brands: string[];
  minPrice?: number; maxPrice?: number; sort: string; page: number; pageSize: number; includeFacets: boolean;
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '1X', '2X', '3X', '4X', '1', '3', '5', '6', '7', '8', '9', '10', '11', '13', 'One Size', 'Queen'];
const SORTS: Record<string, string> = {
  featured: 'p.review_count DESC, p.id ASC',
  best_selling: 'p.review_count DESC, p.id ASC',
  newest: 'p.created_at DESC, p.id ASC',
  price_asc: 'p.price ASC, p.id ASC',
  price_desc: 'p.price DESC, p.id ASC',
  rating: 'p.rating DESC, p.review_count DESC, p.id ASC',
  name: 'p.name ASC, p.id ASC',
};
export const MAX_PAGE_SIZE = 96;

const num = (v: string | null) => (v == null ? null : Number(v));
/** ISO-8601 like Java's Instant.toString(): drops ".000" when there are no millis. */
export const isoInstant = (d: Date | string) => new Date(d).toISOString().replace('.000Z', 'Z');

export function parseProductQuery(url: URL, collection?: string): ProductQuery {
  const sp = url.searchParams;
  const list = (k: string) => sp.getAll(k).flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);
  const optNum = (k: string) => {
    const v = sp.get(k);
    if (v == null || v === '') return undefined;
    const n = Number(v);
    if (Number.isNaN(n)) throw ApiError.badRequest('bad_request', 'Malformed request');
    return n;
  };
  const intParam = (k: string, d: number) => {
    const v = sp.get(k);
    if (v == null) return d;
    const n = Number.parseInt(v, 10);
    if (Number.isNaN(n)) throw ApiError.badRequest('bad_request', 'Malformed request');
    return n;
  };
  return {
    collection: collection ?? sp.get('collection') ?? undefined,
    q: sp.get('q') ?? undefined,
    colors: list('color'),
    sizes: list('size'),
    brands: list('brand'),
    minPrice: optNum('minPrice'),
    maxPrice: optNum('maxPrice'),
    sort: sp.get('sort') || 'featured',
    page: Math.max(1, intParam('page', 1)),
    pageSize: Math.min(MAX_PAGE_SIZE, Math.max(1, intParam('pageSize', 24))),
    includeFacets: sp.get('facets') !== 'false',
  };
}

async function findCategory(slug: string): Promise<CategoryDbRow | undefined> {
  const rows = await query<CategoryDbRow>('SELECT * FROM categories WHERE slug = $1', [slug]);
  return rows[0];
}

/** Builds the WHERE clause for a collection/keyword (+ optional attribute filters). */
function whereClause(q: ProductQuery, collection: CategoryDbRow | undefined, withFilters: boolean) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  const p = (v: unknown) => { params.push(v); return `$${params.length}`; };
  const inCategory = (slug: string) =>
    `EXISTS (SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id AND pc.category_slug = ${p(slug)})`;

  if (collection) {
    if (collection.type === 'smart') {
      if (collection.rule_scope) clauses.push(inCategory(collection.rule_scope));
      if (collection.rule_is_new) clauses.push('p.is_new');
      if (collection.rule_on_sale) clauses.push('p.on_sale');
      if (collection.rule_doorbuster) clauses.push('p.doorbuster');
      if (collection.rule_max_price != null) clauses.push(`p.price < ${p(collection.rule_max_price)}`);
      if (collection.rule_brand) clauses.push(`p.brand = ${p(collection.rule_brand)}`);
    } else {
      clauses.push(inCategory(collection.slug));
    }
  }
  if (q.q?.trim()) {
    for (const term of q.q.toLowerCase().trim().split(/\s+/)) {
      const like = p(`%${term.replace(/%/g, '')}%`);
      clauses.push(`(lower(p.name) LIKE ${like} OR lower(p.brand) LIKE ${like} OR lower(p.category_slug) LIKE ${like}
        OR EXISTS (SELECT 1 FROM product_colors cm WHERE cm.product_id = p.id AND lower(cm.name) LIKE ${like}))`);
    }
  }
  if (withFilters) {
    if (q.colors.length) clauses.push(`EXISTS (SELECT 1 FROM product_colors cf WHERE cf.product_id = p.id AND cf.name = ANY(${p(q.colors)}))`);
    if (q.sizes.length) clauses.push(`EXISTS (SELECT 1 FROM product_sizes sf WHERE sf.product_id = p.id AND sf.size = ANY(${p(q.sizes)}))`);
    if (q.brands.length) clauses.push(`p.brand = ANY(${p(q.brands)})`);
    if (q.minPrice != null) clauses.push(`p.price >= ${p(q.minPrice)}`);
    if (q.maxPrice != null) clauses.push(`p.price <= ${p(q.maxPrice)}`);
  }
  return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

async function colorsFor(ids: number[]): Promise<Map<number, ColorDto[]>> {
  const map = new Map<number, ColorDto[]>();
  if (!ids.length) return map;
  const rows = await query<{ product_id: string; name: string; hex: string }>(
    'SELECT product_id, name, hex FROM product_colors WHERE product_id = ANY($1) ORDER BY product_id, position', [ids]);
  for (const r of rows) {
    const id = Number(r.product_id);
    if (!map.has(id)) map.set(id, []);
    map.get(id)!.push({ name: r.name, hex: r.hex });
  }
  return map;
}

async function summaries(rows: ProductDbRow[]): Promise<ProductSummary[]> {
  const colors = await colorsFor(rows.map((r) => Number(r.id)));
  return rows.map((r) => toSummary(r, colors.get(Number(r.id)) ?? []));
}

function toSummary(r: ProductDbRow, colors: ColorDto[]): ProductSummary {
  return {
    id: Number(r.id), slug: r.slug, name: r.name, brand: r.brand, categorySlug: r.category_slug, imageKey: r.image_key,
    price: Number(r.price), compareAtPrice: num(r.compare_at_price), onSale: r.on_sale, isNew: r.is_new,
    doorbuster: r.doorbuster, colors, rating: r.rating, reviewCount: r.review_count, inStock: r.stock > 0,
  };
}

export async function searchProducts(q: ProductQuery) {
  let collection: CategoryDbRow | undefined;
  if (q.collection) {
    collection = await findCategory(q.collection);
    if (!collection) throw ApiError.notFound('Collection', q.collection);
  }
  const order = SORTS[q.sort];
  if (!order) {
    throw ApiError.badRequest('invalid_sort', 'sort must be one of featured, best_selling, newest, price_asc, price_desc, rating, name');
  }
  const where = whereClause(q, collection, true);
  const n = where.params.length;
  const [countRows, rows, facets] = await Promise.all([
    query<{ n: string }>(`SELECT count(*) AS n FROM products p ${where.sql}`, where.params),
    query<ProductDbRow>(
      `SELECT p.* FROM products p ${where.sql} ORDER BY ${order} LIMIT $${n + 1} OFFSET $${n + 2}`,
      [...where.params, q.pageSize, (q.page - 1) * q.pageSize]),
    q.includeFacets ? facetsFor(q, collection) : Promise.resolve(null),
  ]);
  const totalItems = Number(countRows[0].n);
  return {
    items: await summaries(rows),
    page: q.page,
    pageSize: q.pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / q.pageSize),
    facets,
  };
}

/** Facets reflect the collection + keyword, ignoring the attribute filters themselves. */
async function facetsFor(q: ProductQuery, collection: CategoryDbRow | undefined) {
  const { sql, params } = whereClause(q, collection, false);
  const [colors, sizes, brands, price] = await Promise.all([
    query<{ name: string; hex: string; count: string }>(
      `SELECT c.name, c.hex, count(*) AS count FROM products p JOIN product_colors c ON c.product_id = p.id ${sql}
       GROUP BY c.name, c.hex ORDER BY count(*) DESC, c.name`, params),
    query<{ value: string; count: string }>(
      `SELECT s.size AS value, count(*) AS count FROM products p JOIN product_sizes s ON s.product_id = p.id ${sql}
       GROUP BY s.size`, params),
    query<{ value: string; count: string }>(
      `SELECT p.brand AS value, count(*) AS count FROM products p ${sql} GROUP BY p.brand ORDER BY count(*) DESC, p.brand`, params),
    query<{ min: string | null; max: string | null }>(`SELECT min(p.price) AS min, max(p.price) AS max FROM products p ${sql}`, params),
  ]);
  const rank = (s: string) => { const i = SIZE_ORDER.indexOf(s); return i < 0 ? SIZE_ORDER.length : i; };
  return {
    colors: colors.map((c) => ({ name: c.name, hex: c.hex, count: Number(c.count) })),
    sizes: sizes.map((s) => ({ value: s.value, count: Number(s.count) })).sort((a, b) => rank(a.value) - rank(b.value)),
    brands: brands.map((b) => ({ value: b.value, count: Number(b.count) })),
    price: { min: num(price[0].min), max: num(price[0].max) },
  };
}

async function allCategoryRows(): Promise<CategoryDbRow[]> {
  return query<CategoryDbRow>('SELECT * FROM categories ORDER BY sort_order');
}

function breadcrumbs(c: CategoryDbRow | undefined, bySlug: Map<string, CategoryDbRow>): Crumb[] {
  const crumbs: Crumb[] = [];
  while (c) {
    crumbs.unshift({ slug: c.slug, name: c.name });
    c = c.parent_slug ? bySlug.get(c.parent_slug) : undefined;
  }
  return crumbs;
}

function categoryView(c: CategoryDbRow, all: CategoryDbRow[], bySlug: Map<string, CategoryDbRow>) {
  return {
    slug: c.slug, name: c.name, description: c.description, type: c.type, parentSlug: c.parent_slug,
    productCount: c.product_count, breadcrumbs: breadcrumbs(c, bySlug),
    children: all.filter((x) => x.parent_slug === c.slug).map((x) => ({ slug: x.slug, name: x.name, productCount: x.product_count })),
  };
}

export async function listCategories() {
  const all = await allCategoryRows();
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  return all.map((c) => categoryView(c, all, bySlug));
}

export async function getCategory(slug: string) {
  const all = await allCategoryRows();
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  const c = bySlug.get(slug);
  if (!c) throw ApiError.notFound('Collection', slug);
  return categoryView(c, all, bySlug);
}

export async function getProduct(slug: string) {
  const rows = await query<ProductDbRow>('SELECT * FROM products WHERE slug = $1', [slug]);
  const r = rows[0];
  if (!r) throw ApiError.notFound('Product', slug);
  const id = Number(r.id);
  const [colors, sizes, relatedRows, all] = await Promise.all([
    colorsFor([id]),
    query<{ size: string }>('SELECT size FROM product_sizes WHERE product_id = $1 ORDER BY position', [id]),
    query<ProductDbRow>(
      'SELECT * FROM products WHERE category_slug = $1 AND id <> $2 ORDER BY review_count DESC LIMIT 8', [r.category_slug, id]),
    allCategoryRows(),
  ]);
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  return {
    id, sku: r.sku, slug: r.slug, name: r.name, brand: r.brand, categorySlug: r.category_slug, kind: r.kind,
    imageKey: r.image_key, description: r.description, material: r.material, price: Number(r.price),
    compareAtPrice: num(r.compare_at_price), onSale: r.on_sale, isNew: r.is_new, doorbuster: r.doorbuster,
    colors: colors.get(id) ?? [], sizes: sizes.map((s) => s.size), stock: r.stock, inStock: r.stock > 0,
    rating: r.rating, reviewCount: r.review_count, createdAt: isoInstant(r.created_at),
    breadcrumbs: breadcrumbs(bySlug.get(r.category_slug), bySlug),
    related: await summaries(relatedRows),
  };
}

export async function getHome() {
  const home = catalog().home;
  const sections = await Promise.all(home.sections.map(async (s) => ({
    ...s,
    products: (await searchProducts({
      collection: s.collection, colors: [], sizes: [], brands: [], sort: 'featured', page: 1, pageSize: 8, includeFacets: false,
    })).items,
  })));
  return { ...home, sections };
}
