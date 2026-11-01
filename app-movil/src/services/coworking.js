import { api } from './api';

export function getSpaces(language = 'es') {
  return api.get(`/api/spaces?lang=${language}`);
}

export function getReservations() {
  return api.get('/api/reservations');
}

export function createReservation(input) {
  return api.post('/api/reservations', input);
}

export function cancelReservation(id) {
  return api.patch(`/api/reservations/${encodeURIComponent(id)}/cancel`);
}
