import { api } from './api';

export function getBooks() {
  return api.get('/api/books');
}

export function getBook(id) {
  return api.get(`/api/books/${encodeURIComponent(id)}`);
}
