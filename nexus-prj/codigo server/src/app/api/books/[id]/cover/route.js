import { NextResponse } from 'next/server';
import { getBook } from '@/server/books';
export const dynamic = 'force-dynamic';
export async function GET(_request, { params }) {
  const book = await getBook((await params).id);
  if (!book?.coverUrl)
    return NextResponse.json({ error: 'Portada no disponible' }, { status: 404 });
  return NextResponse.redirect(book.coverUrl);
}
