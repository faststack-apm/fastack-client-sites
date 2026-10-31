import { randomUUID } from 'node:crypto';
import type { PoolClient } from 'pg';
import { query } from './db';
import { ApiError } from './errors';
import { findPromo, fromCents, toCents, totals } from './pricing';

export const MAX_LINE_QUANTITY = 20;

interface CartRow { id: string; status: string; promo_code: string | null; created_at: Date; updated_at: Date }
export interface CartLineRow {
  id: string; product_id: string; color: string; size: string; quantity: number; slug: string; name: string;
  brand: string; image_key: string; price: string; compare_at_price: string | null; stock: number; sku: string;
  color_hex: string | null;
}

type Db = Pick<PoolClient, 'query'> | null;
const run = async <T extends object>(db: Db, sql: string, params: unknown[]): Promise<T[]> =>
  db ? (await db.query(sql, params)).rows as T[] : query<T & Record<string, unknown>>(sql, params);

export async function createCart() {
  const id = randomUUID();
  await query('INSERT INTO carts (id, status, created_at, updated_at) VALUES ($1, $2, now(), now())', [id, 'open']);
  return getCart(id);
}

export async function findCart(id: string, db: Db = null): Promise<CartRow> {
  const rows = await run<CartRow>(db, 'SELECT * FROM carts WHERE id = $1', [id]);
  if (!rows[0]) throw ApiError.notFound('Cart', id);
  return rows[0];
}

export async function findOpenCart(id: string, db: Db = null): Promise<CartRow> {
  const cart = await findCart(id, db);
  if (cart.status !== 'open') throw ApiError.conflict('cart_closed', `Cart ${id} has already been checked out`);
  return cart;
}

export async function cartLines(cartId: string, db: Db = null): Promise<CartLineRow[]> {
  return run<CartLineRow>(db,
    `SELECT ci.id, ci.product_id, ci.color, ci.size, ci.quantity, p.slug, p.name, p.brand, p.image_key, p.price,
            p.compare_at_price, p.stock, p.sku,
            (SELECT c.hex FROM product_colors c WHERE c.product_id = p.id AND lower(c.name) = lower(ci.color) LIMIT 1) AS color_hex
       FROM cart_items ci JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1 ORDER BY ci.id`, [cartId]);
}

export const subtotalCents = (lines: CartLineRow[]) => lines.reduce((s, l) => s + toCents(l.price) * l.quantity, 0);
export const itemCount = (lines: CartLineRow[]) => lines.reduce((s, l) => s + l.quantity, 0);

export async function getCart(id: string) {
  const cart = await findCart(id);
  return view(cart, await cartLines(id));
}

function view(cart: CartRow, lines: CartLineRow[]) {
  const count = itemCount(lines);
  const t = totals(subtotalCents(lines), count, cart.promo_code, 'standard');
  const promo = findPromo(cart.promo_code);
  return {
    id: cart.id,
    status: cart.status,
    items: lines.map((l) => ({
      id: Number(l.id), productId: Number(l.product_id), slug: l.slug, name: l.name, brand: l.brand, imageKey: l.image_key,
      color: l.color, colorHex: l.color_hex ?? '#999999', size: l.size, unitPrice: Number(l.price),
      compareAtPrice: l.compare_at_price == null ? null : Number(l.compare_at_price), quantity: l.quantity,
      lineTotal: fromCents(toCents(l.price) * l.quantity), available: l.stock,
    })),
    itemCount: count,
    promoCode: cart.promo_code,
    promoDescription: promo?.description ?? null,
    ...t,
    updatedAt: new Date(cart.updated_at).toISOString(),
  };
}

function checkStock(name: string, stock: number, qty: number) {
  if (qty > MAX_LINE_QUANTITY) throw ApiError.badRequest('quantity_limit', `Maximum ${MAX_LINE_QUANTITY} per item`);
  if (stock < qty) throw ApiError.conflict('insufficient_stock', `Only ${stock} left of ${name}`);
}

const touch = (id: string) => query('UPDATE carts SET updated_at = now() WHERE id = $1', [id]);

export async function addItem(cartId: string, req: { productId: number; color: string; size: string; quantity: number }) {
  await findOpenCart(cartId);
  const products = await query<{ id: string; name: string; stock: number }>('SELECT id, name, stock FROM products WHERE id = $1', [req.productId]);
  const product = products[0];
  if (!product) throw ApiError.notFound('Product', req.productId);
  const [colors, sizes] = await Promise.all([
    query<{ name: string }>('SELECT name FROM product_colors WHERE product_id = $1', [req.productId]),
    query<{ size: string }>('SELECT size FROM product_sizes WHERE product_id = $1', [req.productId]),
  ]);
  const color = colors.find((c) => c.name.toLowerCase() === req.color.toLowerCase());
  if (!color) throw ApiError.badRequest('invalid_color', `Color '${req.color}' is not available for ${product.name}`);
  const size = sizes.find((s) => s.size.toLowerCase() === req.size.toLowerCase());
  if (!size) throw ApiError.badRequest('invalid_size', `Size '${req.size}' is not available for ${product.name}`);

  const existing = await query<{ id: string; quantity: number }>(
    `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2 AND lower(color) = lower($3) AND lower(size) = lower($4)`,
    [cartId, req.productId, req.color, req.size]);
  const newQty = (existing[0]?.quantity ?? 0) + req.quantity;
  checkStock(product.name, product.stock, newQty);
  if (existing[0]) {
    await query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [newQty, existing[0].id]);
  } else {
    await query('INSERT INTO cart_items (cart_id, product_id, color, size, quantity) VALUES ($1, $2, $3, $4, $5)',
      [cartId, req.productId, req.color, req.size, req.quantity]);
  }
  await touch(cartId);
  return getCart(cartId);
}

export async function updateItem(cartId: string, itemId: number, quantity: number) {
  await findOpenCart(cartId);
  const lines = await query<{ id: string; name: string; stock: number }>(
    `SELECT ci.id, p.name, p.stock FROM cart_items ci JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1 AND ci.id = $2`, [cartId, itemId]);
  if (!lines[0]) throw ApiError.notFound('Cart item', itemId);
  if (quantity === 0) {
    await query('DELETE FROM cart_items WHERE id = $1', [itemId]);
  } else {
    checkStock(lines[0].name, lines[0].stock, quantity);
    await query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [quantity, itemId]);
  }
  await touch(cartId);
  return getCart(cartId);
}

export async function applyPromo(cartId: string, code: string) {
  await findOpenCart(cartId);
  const promo = findPromo(code);
  if (!promo) throw ApiError.badRequest('invalid_promo', `Promo code '${code}' is not valid`);
  await query('UPDATE carts SET promo_code = $1, updated_at = now() WHERE id = $2', [promo.code, cartId]);
  return getCart(cartId);
}

export async function removePromo(cartId: string) {
  await findOpenCart(cartId);
  await query('UPDATE carts SET promo_code = NULL, updated_at = now() WHERE id = $1', [cartId]);
  return getCart(cartId);
}
