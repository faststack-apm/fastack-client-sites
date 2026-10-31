import { updateItem } from '@/lib/carts';
import { ApiError, handler } from '@/lib/errors';
import { updateItemSchema } from '@/lib/schemas';

type Ctx = { params: Promise<{ cartId: string; itemId: string }> };

function itemId(raw: string) {
  const id = Number(raw);
  if (!Number.isInteger(id)) throw ApiError.badRequest('bad_request', 'Malformed request');
  return id;
}

export const dynamic = 'force-dynamic';

export const PATCH = handler(async (req, { params }: Ctx) => {
  const { cartId, itemId: raw } = await params;
  return updateItem(cartId, itemId(raw), updateItemSchema.parse(await req.json()).quantity);
});

export const DELETE = handler(async (_req, { params }: Ctx) => {
  const { cartId, itemId: raw } = await params;
  return updateItem(cartId, itemId(raw), 0);
});
