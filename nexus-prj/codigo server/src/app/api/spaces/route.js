import { listSpaces } from '@/server/spaces';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const language = request.nextUrl.searchParams.get('lang') || 'es';
    return apiSuccess(await listSpaces(language), 'Espacios cargados correctamente');
  } catch (error) {
    return apiError(error.message || 'No se pudieron cargar los espacios');
  }
}
