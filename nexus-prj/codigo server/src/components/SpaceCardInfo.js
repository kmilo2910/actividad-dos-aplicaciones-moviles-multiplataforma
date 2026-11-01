'use client';
import { useI18n } from '@/i18n/provider';
export default function SpaceCardInfo({ space }) {
  const { language } = useI18n();
  const labels = {
    es: ['Capacidad', 'Planta'],
    en: ['Capacity', 'Floor'],
    fr: ['Capacité', 'Étage'],
    it: ['Capienza', 'Piano'],
    de: ['Kapazität', 'Etage'],
  };
  const [capacity, floor] = labels[language] || labels.es;
  return (
    <>
      <h2 className="relative z-10 mt-12 text-2xl font-semibold">{space.name}</h2>
      <p className="relative z-10 mt-2 text-sm text-[#64707d]">
        {capacity} para {space.capacity} · {floor} {space.floor}
      </p>
    </>
  );
}
