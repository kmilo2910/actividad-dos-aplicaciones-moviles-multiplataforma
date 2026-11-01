import { NextResponse } from 'next/server';

export function apiSuccess(
  data,
  message = 'Operación realizada correctamente',
  status = 200,
  code = 'SUCCESS'
) {
  return NextResponse.json({ code, message, data }, { status });
}

export function apiError(message, status = 500, code = 'INTERNAL_ERROR') {
  return NextResponse.json({ code, message, data: null }, { status });
}
