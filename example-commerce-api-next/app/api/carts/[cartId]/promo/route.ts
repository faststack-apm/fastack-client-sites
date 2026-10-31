import { applyPromo, removePromo } from '@/lib/carts';
import { handler } from '@/lib/errors';
import { promoSchema } from '@/lib/schemas';

type Ctx = { params: Promise<{ cartId: string }> };

export const dynamic = 'force-dynamic';

export const POST = handler(async (req, { params }: Ctx) =>
  applyPromo((await params).cartId, promoSchema.parse(await req.json()).code));

export const DELETE = handler(async (_req, { params }: Ctx) => removePromo((await params).cartId));
