import { getCart } from '@/lib/carts';
import { handler } from '@/lib/errors';

type Ctx = { params: Promise<{ cartId: string }> };

export const dynamic = 'force-dynamic';
export const GET = handler(async (_req, { params }: Ctx) => getCart((await params).cartId));
