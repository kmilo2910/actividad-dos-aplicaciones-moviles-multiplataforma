'use client';
import { Building2, Users } from 'lucide-react';
import { useI18n } from '@/i18n/provider';
const labels = {
  es: ['Capacidad', 'Planta'],
  en: ['Capacity', 'Floor'],
  fr: ['Capacité', 'Étage'],
  it: ['Capienza', 'Piano'],
  de: ['Kapazität', 'Etage'],
};
export default function SpaceDetailInfo({ space }) {
  const { language } = useI18n();
  const [capacity, floor] = labels[language] || labels.es;
  return (
    <>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-5xl">{space.name}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-[#f4f1eb]">
          <Users size={15} /> {capacity}: {space.capacity} personas
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-[#f4f1eb]">
          <Building2 size={15} /> {floor} {space.floor}
        </span>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#dceee2]">
        {space.longDescription || space.shortDescription}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {(space.benefits || []).map((benefit) => (
          <div key={benefit} className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
            {benefit}
          </div>
        ))}
      </div>
    </>
  );
}
