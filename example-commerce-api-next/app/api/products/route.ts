import { parseProductQuery, searchProducts } from '@/lib/catalog-queries';
import { handler } from '@/lib/errors';

export const dynamic = 'force-dynamic';
export const GET = handler(async (req) => searchProducts(parseProductQuery(new URL(req.url))));
