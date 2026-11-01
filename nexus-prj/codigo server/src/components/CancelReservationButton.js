'use client';
import { useState } from 'react';
import { apiClient } from '@/infrastructure/http/api.client';
import { useI18n } from '@/i18n/provider';
export default function CancelReservationButton({ reservationId, onCancelled }) {
  const [loading, setLoading] = useState(false);
  const { dictionary } = useI18n();
  async function cancel() {
    if (!window.confirm(`${dictionary.coworking.cancelReservation}?`)) return;
    setLoading(true);
    try {
      await apiClient.patch(`/api/reservations/${reservationId}/cancel`);
      onCancelled(reservationId);
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
      onClick={cancel}
      disabled={loading}
      className="text-sm font-semibold text-red-700 hover:underline"
    >
      {loading ? dictionary.common.loading : dictionary.coworking.cancelReservation}
    </button>
  );
}
