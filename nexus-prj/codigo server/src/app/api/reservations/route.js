import { authenticatedUser } from '@/lib/authenticated-user';
import { createReservation, listReservations } from '@/server/reservations';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = await authenticatedUser(request);
  if (!user?.email && !user?.sub) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  return apiSuccess(await listReservations(user), 'Reservas cargadas correctamente');
}

export async function POST(request) {
  const user = await authenticatedUser(request);
  if (!user?.email && !user?.sub) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  try {
    return apiSuccess(
      await createReservation(user, await request.json()),
      'Reserva creada correctamente',
      201,
      'CREATED'
    );
  } catch (error) {
    return apiError(error.message, 400, 'RESERVATION_ERROR');
  }
}
