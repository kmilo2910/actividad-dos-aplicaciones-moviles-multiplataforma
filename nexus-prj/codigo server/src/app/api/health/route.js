import { getPostgresPool } from '@/server/postgres';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startedAt = Date.now();
  try {
    await getPostgresPool().query('SELECT 1');
    return apiSuccess(
      {
        ok: true,
        service: 'nexus-campus-digital',
        database: 'connected',
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
        responseTimeMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      'Servicio disponible'
    );
  } catch {
    return apiError('Base de datos no disponible', 503, 'DATABASE_UNAVAILABLE');
  }
}
