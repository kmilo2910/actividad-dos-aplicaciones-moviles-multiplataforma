import { api } from './api';
import { APP_CONFIG } from '../config/environment';
import { getAccessToken } from './api';

export function downloadBook(bookId) {
  const token = getAccessToken();
  if (!token) {
    const error = new Error('Autenticación requerida');
    error.code = 'AUTH_REQUIRED';
    error.status = 401;
    return Promise.reject(error);
  }

  return import('expo-file-system/legacy').then(({ downloadAsync, cacheDirectory }) =>
    downloadAsync(
      `${APP_CONFIG.apiBaseUrl}/api/books/${encodeURIComponent(bookId)}/download`,
      `${cacheDirectory}nexus-${encodeURIComponent(bookId)}.pdf`,
      { headers: { Authorization: `Bearer ${token}` } },
    ),
  );
}

export function getBooks() {
  return api.get('/api/books');
}

export function getBook(id) {
  return api.get(`/api/books/${encodeURIComponent(id)}`);
}

export function purchaseBook(bookId) {
  return api.post('/api/purchases', { bookId });
}

export function getPurchases() {
  return api.get('/api/purchases');
}
