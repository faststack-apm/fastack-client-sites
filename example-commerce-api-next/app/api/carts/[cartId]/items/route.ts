import { addItem } from '@/lib/carts';
import { handler } from '@/lib/errors';
import { addItemSchema } from '@/lib/schemas';

type Ctx = { params: Promise<{ cartId: string }> };

export const dynamic = 'force-dynamic';
export const POST = handler(async (req, { params }: Ctx) =>
  addItem((await params).cartId, addItemSchema.parse(await req.json())));
