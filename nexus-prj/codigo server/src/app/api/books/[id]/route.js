import { getBook } from '@/server/books';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const book = await getBook((await params).id);
  return book
    ? apiSuccess(book, 'Publicación cargada correctamente')
    : apiError('Libro o revista no encontrado', 404, 'NOT_FOUND');
}
