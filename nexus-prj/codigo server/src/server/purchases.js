import { getPostgresPool } from '@/server/postgres';
import { randomUUID } from 'node:crypto';

async function userByEmail(email) {
  const r = await getPostgresPool().query(
    `SELECT data FROM nexus_records WHERE collection='users' AND data->>'email'=$1 LIMIT 1`,
    [email]
  );
  return r.rows[0]?.data;
}
export async function listPurchases(email) {
  const user = await userByEmail(email);
  if (!user) return [];
  const r = await getPostgresPool().query(
    `SELECT data FROM nexus_records WHERE collection='purchases' AND data->>'userId'=$1 ORDER BY created_at DESC`,
    [user.id]
  );
  return r.rows.map(({ data }) => data);
}
export async function createPurchase(profile, bookId) {
  const pool = getPostgresPool();
  const user = await userByEmail(profile.email);
  if (!user) throw new Error('Usuario no encontrado');
  const bookResult = await pool.query(
    `SELECT data FROM nexus_records WHERE collection='books' AND id=$1`,
    [bookId]
  );
  const book = bookResult.rows[0]?.data;
  if (!book) throw new Error('Libro o revista no encontrado');
  if (Number(book.stock) < 1) throw new Error('El producto no tiene stock disponible');
  const existing = await pool.query(
    `SELECT 1 FROM nexus_records WHERE collection='purchases' AND data->>'userId'=$1 AND data->>'bookId'=$2 LIMIT 1`,
    [user.id, bookId]
  );
  if (existing.rowCount) throw new Error('Ya has adquirido esta publicación');
  const purchase = {
    id: `purchase-${randomUUID()}`,
    userId: user.id,
    bookId,
    price: book.price,
    purchasedAt: new Date().toISOString(),
  };
  await pool.query(
    `UPDATE nexus_records SET data=$2, updated_at=NOW() WHERE collection='books' AND id=$1`,
    [
      bookId,
      {
        ...book,
        stock: Number(book.stock) - 1,
        soldLastWeeks: Number(book.soldLastWeeks || 0) + 1,
      },
    ]
  );
  await pool.query(
    `INSERT INTO nexus_records (collection,id,data,created_at,updated_at) VALUES ('purchases',$1,$2,$3,NOW())`,
    [purchase.id, purchase, purchase.purchasedAt]
  );
  return purchase;
}
