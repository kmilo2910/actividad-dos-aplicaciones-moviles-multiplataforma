import { listBooks } from '@/server/books';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return apiSuccess(await listBooks(), 'Catálogo cargado correctamente');
  } catch (error) {
    return apiError(error.message || 'No se pudo cargar el catálogo');
  }
}
