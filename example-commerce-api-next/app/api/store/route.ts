import { settings } from '@/lib/catalog';
import { handler } from '@/lib/errors';

export const dynamic = 'force-dynamic';
export const GET = handler(async () => settings());
