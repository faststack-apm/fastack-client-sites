import { createCart } from '@/lib/carts';
import { handler } from '@/lib/errors';

export const dynamic = 'force-dynamic';
export const POST = handler(async () => createCart(), 201);
