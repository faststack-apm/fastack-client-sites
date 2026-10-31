import { listCategories } from '@/lib/catalog-queries';
import { handler } from '@/lib/errors';

export const dynamic = 'force-dynamic';
export const GET = handler(async () => listCategories());
