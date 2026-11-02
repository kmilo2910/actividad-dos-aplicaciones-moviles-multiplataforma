import { authenticatedUser } from '@/lib/authenticated-user';
import { cancelReservation } from '@/server/reservations';
import { apiError, apiSuccess } from '@/server/api-response';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  const user = await authenticatedUser(request);
  if (!user?.email && !user?.sub) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  try {
    return apiSuccess(
      await cancelReservation(user, (await params).id),
      'Reserva cancelada correctamente'
    );
  } catch (error) {
    return apiError(error.message, 400, 'CANCELLATION_ERROR');
  }
}
