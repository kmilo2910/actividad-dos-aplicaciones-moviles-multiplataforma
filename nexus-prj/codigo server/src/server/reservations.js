import { getPostgresPool } from '@/server/postgres';
import { randomUUID } from 'node:crypto';

function newId() {
  return `reservation-${randomUUID()}`;
}

async function findUser(profile) {
  const email = profile?.email;
  const subject = profile?.sub || profile?.user_id;
  const result = await getPostgresPool().query(
    `SELECT data FROM nexus_records
     WHERE collection = 'users'
       AND (data ->> 'email' = $1 OR data ->> 'googleId' = $2)
     LIMIT 1`,
    [email || null, subject || null]
  );
  return result.rows[0]?.data;
}

async function findOrCreateUser(profile) {
  const existing = await findUser(profile);
  if (existing) return existing;
  const user = {
    id: `user-${randomUUID()}`,
    googleId: profile.sub || profile.user_id || profile.email,
    name: profile.name || profile.nickname || profile.email,
    email: profile.email || null,
    avatar: profile.picture || null,
    createdAt: new Date().toISOString(),
  };
  await getPostgresPool().query(
    `INSERT INTO nexus_records (collection, id, data, created_at, updated_at) VALUES ('users', $1, $2, $3, NOW())`,
    [user.id, user, user.createdAt]
  );
  return user;
}

async function findSpace(id) {
  const result = await getPostgresPool().query(
    `SELECT data FROM nexus_records WHERE collection = 'spaces' AND id = $1`,
    [id]
  );
  return result.rows[0]?.data;
}

export async function listReservations(profile) {
  const user = await findUser(profile);
  if (!user) return [];
  const result = await getPostgresPool().query(
    `SELECT data FROM nexus_records WHERE collection = 'reservations' AND data ->> 'userId' = $1 ORDER BY created_at DESC`,
    [user.id]
  );
  return Promise.all(
    result.rows.map(async ({ data }) => {
      const space = await findSpace(data.spaceId);
      return {
        ...data,
        spaceName: space?.name || data.spaceId,
        capacity: space?.capacity,
        floor: space?.floor,
      };
    })
  );
}

export async function createReservation(profile, input) {
  const user = await findOrCreateUser(profile);
  const space = await findSpace(input.spaceId);
  if (!user) throw new Error('Usuario no encontrado');
  if (!space) throw new Error('Espacio no encontrado');
  if (space.status !== 'available') throw new Error('El espacio no está disponible');

  const active = await getPostgresPool().query(
    `SELECT 1 FROM nexus_records WHERE collection = 'reservations' AND data ->> 'userId' = $1 AND data ->> 'status' = 'active' LIMIT 1`,
    [user.id]
  );
  if (active.rowCount) throw new Error('Ya tienes una reserva activa');

  const duration = Number(input.durationMinutes || 60);
  const reservationDate = input.reservationDate;
  const reservationTime = input.reservationTime || '08:00';
  const from = new Date(`${reservationDate}T${reservationTime}`);
  const until = new Date(from.getTime() + duration * 60000);
  const weekday = new Date(`${reservationDate}T12:00:00`).getDay();
  const [hours, minutes] = reservationTime.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + duration;
  if (Number.isNaN(from.getTime()) || from < new Date())
    throw new Error('Selecciona una fecha válida a partir de hoy');
  if ([0, 6].includes(weekday)) throw new Error('El coworking solo funciona de lunes a viernes');
  if (![15, 30, 45, 60].includes(duration))
    throw new Error('La duración debe ser de 15, 30, 45 o 60 minutos');
  if (!Number.isInteger(hours) || ![0, 15, 30, 45].includes(minutes))
    throw new Error('La hora debe estar en intervalos de 15 minutos');
  if (startMinutes < 480 || endMinutes > 1200)
    throw new Error('El horario de atención es de 08:00 a 20:00');

  const reservation = {
    id: newId(),
    userId: user.id,
    spaceId: input.spaceId,
    startsAt: from.toISOString(),
    endsAt: until.toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  const pool = getPostgresPool();
  await pool.query(
    `INSERT INTO nexus_records (collection, id, data, created_at, updated_at) VALUES ('reservations', $1, $2, $3, NOW())`,
    [reservation.id, reservation, reservation.createdAt]
  );
  const updatedSpace = {
    ...space,
    status: 'occupied',
    occupiedBy: user.name,
    occupiedByEmail: user.email,
    reservationId: reservation.id,
    occupiedFrom: from.toISOString(),
    availableAt: until.toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await pool.query(
    `UPDATE nexus_records SET data = $2, updated_at = NOW() WHERE collection = 'spaces' AND id = $1`,
    [space.id, updatedSpace]
  );
  return reservation;
}

export async function cancelReservation(profile, id) {
  const user = await findUser(profile);
  const pool = getPostgresPool();
  const result = await pool.query(
    `SELECT data FROM nexus_records WHERE collection = 'reservations' AND id = $1`,
    [id]
  );
  const reservation = result.rows[0]?.data;
  if (!user || !reservation || reservation.userId !== user.id)
    throw new Error('Reserva no encontrada');
  if ((new Date(reservation.startsAt).getTime() - Date.now()) / 60000 <= 30)
    throw new Error(
      'La reserva no puede cancelarse dentro de los 30 minutos previos a su inicio ni después de comenzar'
    );
  const cancelled = { ...reservation, status: 'cancelled', updatedAt: new Date().toISOString() };
  await pool.query(
    `UPDATE nexus_records SET data = $2, updated_at = NOW() WHERE collection = 'reservations' AND id = $1`,
    [id, cancelled]
  );
  const space = await findSpace(reservation.spaceId);
  if (space)
    await pool.query(
      `UPDATE nexus_records SET data = $2, updated_at = NOW() WHERE collection = 'spaces' AND id = $1`,
      [
        space.id,
        {
          ...space,
          status: 'available',
          occupiedBy: null,
          occupiedFrom: null,
          availableAt: null,
          occupiedByEmail: null,
          reservationId: null,
          updatedAt: new Date().toISOString(),
        },
      ]
    );
  return cancelled;
}
