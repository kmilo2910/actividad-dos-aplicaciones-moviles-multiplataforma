import { getSpace } from '@/server/spaces';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const language = request.nextUrl.searchParams.get('lang') || 'es';
    const space = await getSpace((await params).id, language);
    return space
      ? apiSuccess(space, 'Espacio cargado correctamente')
      : apiError('Espacio no encontrado', 404, 'NOT_FOUND');
  } catch (error) {
    return apiError(error.message || 'No se pudo cargar el espacio');
  }
}
