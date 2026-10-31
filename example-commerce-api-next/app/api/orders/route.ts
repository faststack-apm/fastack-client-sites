import { handler } from '@/lib/errors';
import { placeOrder } from '@/lib/orders';
import { createOrderSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';
export const POST = handler(async (req) => placeOrder(createOrderSchema.parse(await req.json())), 201);
