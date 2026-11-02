'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { apiClient } from '@/infrastructure/http/api.client';
import Toast from '@/components/Toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowUpRight, CalendarDays, ChevronDown, Clock3, Timer } from 'lucide-react';
import { useI18n } from '@/i18n/provider';
export default function ReserveButton({
  spaceId,
  disabled = false,
  availableAt,
  occupiedFrom,
  occupiedByEmail,
  reservationId,
  detailHref,
  light = false,
}) {
  const [currentEmail, setCurrentEmail] = useState(null);
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00');
  const [duration, setDuration] = useState('60');
  const [reservation, setReservation] = useState(null);
  const [toast, setToast] = useState('');
  const [cancelled, setCancelled] = useState(false);
  const { user } = useUser();
  const { dictionary, language } = useI18n();
  const t = dictionary.coworking;
  const localeByLanguage = { es: 'es-CO', en: 'en-US', fr: 'fr-FR', it: 'it-IT', de: 'de-DE' };
  const locale = localeByLanguage[language] || 'es-CO';
  const router = useRouter();
  const maxStartMinutes = 20 * 60 - Number(duration);
  const maxStart = `${String(Math.floor(maxStartMinutes / 60)).padStart(2, '0')}:${String(maxStartMinutes % 60).padStart(2, '0')}`;
  const weekdays = Array.from({ length: 21 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  }).filter((date) => ![0, 6].includes(date.getDay()));
  const timeOptions = Array.from(
    { length: Math.floor((maxStartMinutes - 8 * 60) / 15) + 1 },
    (_, index) => {
      const total = 8 * 60 + index * 15;
      return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    }
  );
  const [scheduleMessage, setScheduleMessage] = useState('');
  useEffect(() => setCurrentEmail(user?.email || null), [user]);
  const isOwner = currentEmail && occupiedByEmail && currentEmail === occupiedByEmail;
  const minutesUntilStart = occupiedFrom
    ? (new Date(occupiedFrom).getTime() - Date.now()) / 60000
    : Infinity;
  const cancellationBlocked = minutesUntilStart <= 30;
  async function reserve() {
    if (!date) {
      setMessage('Selecciona una fecha');
      return;
    }
    const selectedDate = new Date(`${date}T12:00:00`);
    if ([0, 6].includes(selectedDate.getDay())) {
      setScheduleMessage('El coworking solo funciona de lunes a viernes');
      return;
    }
    setScheduleMessage('');
    setState('loading');
    setMessage('');
    try {
      const created = await apiClient.post('/api/reservations', {
        spaceId,
        durationMinutes: duration,
        reservationDate: date,
        reservationTime: time,
      });
      setReservation(created);
      setState('idle');
      setToast('Reserva confirmada correctamente');
      router.refresh();
    } catch (error) {
      setState('error');
      setMessage(error.message);
    }
  }
  async function cancel() {
    setState('loading');
    try {
      await apiClient.patch(`/api/reservations/${reservation?.id || reservationId}/cancel`);
      setReservation(null);
      setCancelled(true);
      setState('idle');
      setToast('Reserva cancelada');
      router.refresh();
    } catch (error) {
      setState('error');
      setMessage(error.message);
    }
  }
  const ownStart = reservation?.startsAt || occupiedFrom;
  const ownMinutesUntilStart = ownStart
    ? (new Date(ownStart).getTime() - Date.now()) / 60000
    : Infinity;
  const ownCancellationBlocked = ownMinutesUntilStart <= 30;
  if (reservation)
    return (
      <>
        <div className={`text-sm ${light ? 'text-[#2f6f4e]' : 'text-[#dceee2]'}`}>
          <p className="font-semibold">Reservado por ti</p>
          <p className="mt-1 text-xs text-[#64707d]">
            {new Date(reservation.startsAt).toLocaleString('es-CO')}
          </p>
          {ownCancellationBlocked ? (
            <span className="mt-2 block text-xs text-[#64707d]">
              La cancelación ya no está disponible
            </span>
          ) : (
            <button
              onClick={cancel}
              className={`mt-2 text-sm font-semibold hover:underline ${
                light ? 'text-[#a4511f] hover:text-[#7e351f]' : 'text-[#ffd8cf] hover:text-white'
              }`}
            >
              {t.cancelReservation}
            </button>
          )}
        </div>
        <Toast message={toast} onClose={() => setToast('')} />
      </>
    );
  if (disabled && !cancelled) {
    if (isOwner)
      return (
        <>
          <div className={`text-sm ${light ? 'text-[#2f6f4e]' : 'text-[#ffe4b8]'}`}>
            <div className="flex items-center gap-2">
              {t.reservedByYou}{' '}
              {cancellationBlocked && (
                <span
                  aria-label="Información sobre la cancelación"
                  className="group relative grid h-5 w-5 cursor-help place-items-center rounded-full border border-[#a4511f] text-xs font-bold"
                >
                  i
                  <span className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden w-64 -translate-x-1/2 rounded-lg bg-[#17202a] p-3 text-left text-xs font-normal leading-relaxed text-white shadow-lg group-hover:block">
                    No puedes cancelar dentro de los 30 minutos previos al inicio ni después de que
                    la reserva haya comenzado.
                  </span>
                </span>
              )}
            </div>
            {cancellationBlocked ? (
              <span className="block text-xs text-[#64707d]">
                La cancelación ya no está disponible
              </span>
            ) : (
              <button
                onClick={cancel}
                disabled={state === 'loading'}
                className={`mt-2 text-sm font-semibold hover:underline ${
                  light ? 'text-[#a4511f] hover:text-[#7e351f]' : 'text-[#ffd8cf] hover:text-white'
                }`}
              >
                {state === 'loading' ? dictionary.common.loading : t.cancelReservation}
              </button>
            )}
            {detailHref && (
              <div className="mt-3">
                <Link
                  href={detailHref}
                  className="!text-[#17202a] inline-flex items-center gap-1 text-sm font-semibold hover:!text-[#0f172a] hover:underline"
                >
                  Ver detalle <ArrowUpRight size={15} />
                </Link>
              </div>
            )}
          </div>
          <Toast message={toast} onClose={() => setToast('')} />
        </>
      );
    return (
      <div className="text-sm text-[#a4511f]">
        {detailHref && (
          <Link
            href={detailHref}
            className="!text-[#17202a] mb-3 flex w-full items-center justify-end gap-1 text-sm font-semibold hover:!text-[#0f172a] hover:underline"
          >
            Ver detalle <ArrowUpRight size={15} />
          </Link>
        )}
        {t.occupied}
        {availableAt && (
          <span className="block text-xs text-[#64707d]">
            Se libera a las{' '}
            {new Date(availableAt).toLocaleTimeString('es-CO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    );
  }
  return (
    <>
      <div className="w-full max-w-lg">
        <div className="mb-3 grid grid-cols-3 gap-2">
          <label className="text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-[#dceee2]" /> {t.date}
            </span>
            <span className="relative mt-1 block">
              <select
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setScheduleMessage('');
                }}
                className="w-full appearance-none rounded-lg border border-[#d8e2dc] bg-white p-2 pr-8 text-sm font-medium text-[#17202a] shadow-sm outline-none focus:border-[#b9d8c5] focus:ring-2 focus:ring-[#b9d8c5]"
              >
                <option value="">{t.selectDate}</option>
                {weekdays.map((option) => (
                  <option
                    key={option.toISOString().slice(0, 10)}
                    value={option.toISOString().slice(0, 10)}
                  >
                    {option.toLocaleDateString(locale, {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#2f6f4e]"
                size={15}
              />
            </span>
          </label>
          <label className="text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <Clock3 size={14} className="text-[#dceee2]" /> {t.time}
            </span>
            <span className="relative mt-1 block">
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#d8e2dc] bg-white p-2 pr-8 text-sm font-medium text-[#17202a] shadow-sm outline-none focus:border-[#b9d8c5] focus:ring-2 focus:ring-[#b9d8c5]"
              >
                {timeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#2f6f4e]"
                size={15}
              />
            </span>
          </label>
          <label className="text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <Timer size={14} className="text-[#dceee2]" /> {t.duration}
            </span>
            <span className="relative mt-1 block">
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#d8e2dc] bg-white p-2 pr-8 text-sm font-medium text-[#17202a] shadow-sm outline-none focus:border-[#b9d8c5] focus:ring-2 focus:ring-[#b9d8c5]"
              >
                <option value="15">15 {t.minutes}</option>
                <option value="30">30 {t.minutes}</option>
                <option value="45">45 {t.minutes}</option>
                <option value="60">60 {t.minutes}</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#2f6f4e]"
                size={15}
              />
            </span>
          </label>
        </div>
        {scheduleMessage && (
          <p className="mb-2 flex items-start gap-2 rounded-lg bg-[#fff1eb]/15 px-3 py-2 text-xs font-medium text-[#ffe4d8]">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {scheduleMessage}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={reserve}
            disabled={state === 'loading' || state === 'done'}
            className="rounded-full bg-[#2f6f4e] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {state === 'loading'
              ? dictionary.common.loading
              : state === 'done'
                ? 'Reservado'
                : t.reserve}
          </button>
          {detailHref && (
            <Link
              href={detailHref}
              className="!text-[#17202a] ml-auto inline-flex items-center gap-1 text-sm font-semibold hover:!text-[#0f172a] hover:underline"
            >
              Ver detalle <ArrowUpRight size={15} />
            </Link>
          )}
        </div>
        {message && (
          <p
            className={`mt-2 flex items-start gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
              state === 'error'
                ? 'bg-[#fff1eb]/15 text-[#ffe4d8]'
                : 'bg-[#dceee2]/15 text-[#dceee2]'
            }`}
          >
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {message}
          </p>
        )}
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
