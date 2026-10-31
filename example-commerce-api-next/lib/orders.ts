import { randomInt } from 'node:crypto';
import type { PoolClient } from 'pg';
import { cartLines, findOpenCart, itemCount, subtotalCents } from './carts';
import { query, transaction } from './db';
import { ApiError } from './errors';
import { authorize } from './payment';
import { fromCents, toCents, totals } from './pricing';
import type { CreateOrderInput } from './schemas';

interface OrderRow {
  id: string; order_number: string; status: string; email: string; first_name: string; last_name: string;
  address1: string; address2: string | null; city: string; state: string; postal_code: string; country: string;
  phone: string | null; shipping_method: string; promo_code: string | null; subtotal: string; discount: string;
  shipping: string; tax: string; total: string; card_brand: string; card_last4: string; created_at: Date;
}
interface OrderItemRow {
  product_id: string; sku: string; slug: string; name: string; image_key: string; color: string; size: string;
  unit_price: string; quantity: number; line_total: string;
}

export async function placeOrder(req: CreateOrderInput) {
  const orderId = await transaction(async (db) => {
    // Lock the cart row so a double-submit can't create two orders.
    await db.query('SELECT id FROM carts WHERE id = $1 FOR UPDATE', [req.cartId]);
    const cart = await findOpenCart(req.cartId, db);
    const lines = await cartLines(cart.id, db);
    if (!lines.length) throw ApiError.badRequest('empty_cart', 'Cart is empty');
    const method = req.shippingMethod ?? 'standard';
    const t = totals(subtotalCents(lines), itemCount(lines), cart.promo_code, method);

    // Reserve inventory first; any shortfall rolls back the whole transaction.
    for (const l of lines) {
      const res = await db.query('UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1', [l.quantity, l.product_id]);
      if (res.rowCount === 0) throw ApiError.conflict('insufficient_stock', `Not enough stock for ${l.name}`);
    }
    const auth = await authorize(req.payment, t.total);
    const orderNumber = await nextOrderNumber(db);
    const a = req.shippingAddress;
    const inserted = await db.query<{ id: string }>(
      `INSERT INTO orders (order_number, cart_id, status, email, first_name, last_name, address1, address2, city, state,
         postal_code, country, phone, shipping_method, promo_code, subtotal, discount, shipping, tax, total, card_brand,
         card_last4, created_at)
       VALUES ($1,$2,'confirmed',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21, now())
       RETURNING id`,
      [orderNumber, cart.id, req.email, a.firstName, a.lastName, a.address1, a.address2 ?? null, a.city, a.state,
        a.postalCode, a.country, a.phone ?? null, method, t.discount > 0 ? cart.promo_code : null, t.subtotal,
        t.discount, t.shipping, t.tax, t.total, auth.brand, auth.last4]);
    const id = inserted.rows[0].id;
    for (const l of lines) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, sku, slug, name, image_key, color, size, unit_price, quantity, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [id, l.product_id, l.sku, l.slug, l.name, l.image_key, l.color, l.size, Number(l.price), l.quantity,
          fromCents(toCents(l.price) * l.quantity)]);
    }
    await db.query(`UPDATE carts SET status = 'converted', updated_at = now() WHERE id = $1`, [cart.id]);
    console.log(`Order ${orderNumber} placed: ${lines.length} items, total ${t.total}`);
    return id;
  });
  const rows = await query<OrderRow>('SELECT * FROM orders WHERE id = $1', [orderId]);
  return view(rows[0]);
}

export async function getOrder(orderNumber: string, email?: string | null) {
  const rows = await query<OrderRow>('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
  const o = rows[0];
  if (!o || (email && o.email.toLowerCase() !== email.toLowerCase())) throw ApiError.notFound('Order', orderNumber);
  return view(o);
}

async function nextOrderNumber(db: PoolClient) {
  for (;;) {
    const n = `VC${randomInt(10_000_000, 99_999_999)}`;
    const { rowCount } = await db.query('SELECT 1 FROM orders WHERE order_number = $1', [n]);
    if (!rowCount) return n;
  }
}

async function view(o: OrderRow) {
  const items = await query<OrderItemRow>('SELECT * FROM order_items WHERE order_id = $1 ORDER BY id', [o.id]);
  return {
    orderNumber: o.order_number, status: o.status, email: o.email, createdAt: new Date(o.created_at).toISOString(),
    items: items.map((i) => ({
      productId: Number(i.product_id), sku: i.sku, slug: i.slug, name: i.name, imageKey: i.image_key, color: i.color,
      size: i.size, unitPrice: Number(i.unit_price), quantity: i.quantity, lineTotal: Number(i.line_total),
    })),
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    shippingAddress: {
      firstName: o.first_name, lastName: o.last_name, address1: o.address1, address2: o.address2, city: o.city,
      state: o.state, postalCode: o.postal_code, country: o.country, phone: o.phone,
    },
    shippingMethod: o.shipping_method, promoCode: o.promo_code, subtotal: Number(o.subtotal), discount: Number(o.discount),
    shipping: Number(o.shipping), tax: Number(o.tax), total: Number(o.total), cardBrand: o.card_brand, cardLast4: o.card_last4,
  };
}
