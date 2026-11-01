import { listBestsellers } from '@/server/books';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return apiSuccess(await listBestsellers(10), 'Más vendidos cargados correctamente');
  } catch (error) {
    return apiError(error.message || 'No se pudieron cargar los más vendidos');
  }
}
