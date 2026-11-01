import { useCallback, useEffect, useState } from 'react';
import { getBooks } from '../services/books';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setBooks(await getBooks());
    } catch (nextError) {
      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  return { books, isLoading, error, reload: loadBooks };
}
