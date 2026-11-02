import { getPostgresPool } from '@/server/postgres';

function rowToBook(row) {
  return row.data;
}

export async function listBooks() {
  const result = await getPostgresPool().query(
    `SELECT data FROM nexus_records
     WHERE collection = 'books'
     ORDER BY created_at ASC`
  );
  return result.rows.map(rowToBook);
}

export async function getBook(id) {
  const result = await getPostgresPool().query(
    `SELECT data FROM nexus_records WHERE collection = 'books' AND id = $1`,
    [id]
  );
  return result.rows[0] ? rowToBook(result.rows[0]) : null;
}

export async function listBestsellers(limit = 10) {
  const result = await getPostgresPool().query(
    `SELECT data FROM nexus_records
     WHERE collection = 'books'
     ORDER BY COALESCE((data ->> 'soldLastWeeks')::int, 0) DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows.map(rowToBook);
}
