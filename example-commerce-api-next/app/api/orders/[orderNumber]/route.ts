import { handler } from '@/lib/errors';
import { getOrder } from '@/lib/orders';

type Ctx = { params: Promise<{ orderNumber: string }> };

export const dynamic = 'force-dynamic';
export const GET = handler(async (req, { params }: Ctx) =>
  getOrder((await params).orderNumber, new URL(req.url).searchParams.get('email')));
