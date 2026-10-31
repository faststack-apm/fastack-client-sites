import { getCategory } from '@/lib/catalog-queries';
import { handler } from '@/lib/errors';

type Ctx = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';
export const GET = handler(async (_req, { params }: Ctx) => getCategory((await params).slug));
