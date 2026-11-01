import { auth0 } from '@/lib/auth0';
import { createPurchase, listPurchases } from '@/server/purchases';
import { apiError, apiSuccess } from '@/server/api-response';
export const dynamic = 'force-dynamic';
export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user?.email) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  return apiSuccess(
    await listPurchases(session.user.email),
    'Adquisiciones cargadas correctamente'
  );
}
export async function POST(request) {
  const session = await auth0.getSession();
  if (!session?.user?.email) return apiError('Autenticación requerida', 401, 'AUTH_REQUIRED');
  try {
    return apiSuccess(
      await createPurchase(session.user, (await request.json()).bookId),
      'Adquisición registrada correctamente',
      201,
      'CREATED'
    );
  } catch (error) {
    return apiError(error.message, 400, 'PURCHASE_ERROR');
  }
}
