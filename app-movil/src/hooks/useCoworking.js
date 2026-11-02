import { useCallback, useEffect, useState } from 'react';
import {
  cancelReservation,
  createReservation,
  getReservations,
  getSpaces,
} from '../services/coworking';

export function useCoworking(isAuthenticated) {
  const [spaces, setSpaces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextSpaces = await getSpaces();
      setSpaces(nextSpaces || []);

      if (!isAuthenticated) {
        setReservations([]);
        return;
      }

      try {
        setReservations((await getReservations()) || []);
      } catch (reservationError) {
        if (reservationError.code === 'AUTH_REQUIRED' || reservationError.status === 401) {
          setReservations([]);
          return;
        }
        throw reservationError;
      }
    } catch (nextError) {
      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    reload();
  }, [reload]);

  const reserve = useCallback(async (input) => {
    const reservation = await createReservation(input);
    await reload();
    return reservation;
  }, [reload]);

  const cancel = useCallback(async (id) => {
    const result = await cancelReservation(id);
    await reload();
    return result;
  }, [reload]);

  return { spaces, reservations, isLoading, error, reload, reserve, cancel };
}
