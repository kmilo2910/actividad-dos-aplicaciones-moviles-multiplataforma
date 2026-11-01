'use client';
import { useI18n } from '@/i18n/provider';

export default function CoworkingIntro() {
  const { dictionary } = useI18n();
  const t = dictionary.coworking;
  return (
    <>
      <div className="mt-14 max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#2f6f4e]">
          {t.eyebrow}
        </p>
        <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-7xl">{t.title}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#64707d]">
          {t.description ||
            'Consulta la disponibilidad de los espacios y reserva el que mejor se adapte a tu jornada.'}
        </p>
      </div>
      <div className="mt-10 rounded-2xl border border-[#b9d8c5] bg-[#e8f3eb] p-5 text-sm leading-relaxed text-[#2f6f4e]">
        <strong>{t.howItWorks || '¿Cómo funcionan las reservas?'}</strong>
        <p className="mt-2">
          {t.instructions ||
            'Elige una fecha, una hora de inicio y un bloque de 15, 30, 45 o 60 minutos.'}
        </p>
      </div>
    </>
  );
}
