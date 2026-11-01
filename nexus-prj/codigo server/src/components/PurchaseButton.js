'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ShoppingBag } from 'lucide-react';
import { apiClient } from '@/infrastructure/http/api.client';
import { useI18n } from '@/i18n/provider';
export default function PurchaseButton({ bookId }) {
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const { dictionary } = useI18n();
  const t = dictionary.library;
  useEffect(() => {
    if (!user) return;
    apiClient
      .get('/api/purchases')
      .then((items) => {
        if (items.some((item) => item.bookId === bookId)) {
          setState('done');
          setMessage(t.alreadyAcquired);
        }
      })
      .catch(() => {});
  }, [bookId, t.alreadyAcquired, user]);
  async function buy() {
    setState('loading');
    setMessage('');
    try {
      await apiClient.post('/api/purchases', { bookId });
      setState('done');
      setMessage(t.purchaseRegistered);
    } catch (error) {
      setState('error');
      setMessage(error.message);
    }
  }
  return (
    <div>
      {state === 'done' && (
        <span className="mt-8 inline-flex items-center rounded-full border border-[#9bd3ad] bg-[#e8f5ed] px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#237a43]">
          {t.acquiredPublication}
        </span>
      )}
      <button
        onClick={buy}
        disabled={state === 'loading' || state === 'done'}
        className="mt-4 flex items-center gap-2 rounded-full bg-[#1f4f66] px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        <ShoppingBag size={18} />
        {state === 'loading' ? t.processing : state === 'done' ? t.acquired : t.buy}
      </button>
      {message && (
        <p className={`mt-3 text-sm ${state === 'error' ? 'text-red-700' : 'text-green-700'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
