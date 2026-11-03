import { authenticatedUser } from '@/lib/authenticated-user';
import { createPurchase, listPurchases } from '@/server/purchases';
import { apiError, apiSuccess } from '@/server/api-response';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const user = await authenticatedUser(request);
  if (!user?.email && !user?.sub) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  return apiSuccess(
    await listPurchases(user),
    'Adquisiciones cargadas correctamente'
  );
}
export async function POST(request) {
  const user = await authenticatedUser(request);
  if (!user?.email && !user?.sub) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  try {
    return apiSuccess(
      await createPurchase(user, (await request.json()).bookId),
      'Adquisición registrada correctamente',
      201,
      'CREATED'
    );
  } catch (error) {
    return apiError(error.message, 400, 'PURCHASE_ERROR');
  }
}
