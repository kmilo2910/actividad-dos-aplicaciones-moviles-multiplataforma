import { authenticatedUser } from '@/lib/authenticated-user';
import { getBook } from '@/server/books';
import { getPurchaseForBook } from '@/server/purchases';
import { Buffer } from 'node:buffer';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function escapePdfText(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, '');
}

function createExamplePdf(book, purchase) {
  const lines = [
    'NEXUS UNIVERSITY',
    book.title,
    `Autor: ${book.author || 'Nexus Library'}`,
    `Tipo: ${book.type === 'magazine' ? 'Revista' : 'Libro'}`,
    `Categoria: ${book.category || 'General'}`,
    `Adquirido: ${new Date(purchase.purchasedAt).toLocaleDateString('es-CO')}`,
    '',
    'Material digital de ejemplo',
    '',
    'Este documento es una muestra descargable de Nexus Library.',
    'El contenido completo de la publicacion se incorporara posteriormente.',
  ];
  const text = lines
    .map((line, index) => `BT /F1 ${index === 0 ? 22 : index === 1 ? 18 : 12} Tf 50 ${760 - index * 42} Td (${escapePdfText(line)}) Tj ET`)
    .join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(text, 'ascii')} >>\nstream\n${text}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'ascii'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, 'ascii');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'ascii');
}

export async function GET(request, { params }) {
  const user = await authenticatedUser(request);
  if (!user?.email) {
    return NextResponse.json({ code: 'AUTH_REQUIRED', message: 'Autenticación requerida' }, { status: 401 });
  }

  const bookId = params.id;
  const [book, purchase] = await Promise.all([
    getBook(bookId),
    getPurchaseForBook(user.email, bookId),
  ]);

  if (!book) return NextResponse.json({ code: 'NOT_FOUND', message: 'Publicación no encontrada' }, { status: 404 });
  if (!purchase) return NextResponse.json({ code: 'PURCHASE_REQUIRED', message: 'Debes adquirir la publicación primero' }, { status: 403 });

  const file = createExamplePdf(book, purchase);
  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="nexus-${bookId}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
