import { api } from './api';

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
