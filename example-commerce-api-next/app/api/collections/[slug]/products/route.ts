import { parseProductQuery, searchProducts } from '@/lib/catalog-queries';
import { handler } from '@/lib/errors';

type Ctx = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';
export const GET = handler(async (req, { params }: Ctx) =>
  searchProducts(parseProductQuery(new URL(req.url), (await params).slug)));
