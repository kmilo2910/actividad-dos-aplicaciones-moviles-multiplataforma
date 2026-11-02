'use client';
import { useI18n } from '@/i18n/provider';

export default function LibraryIntro() {
  const { dictionary } = useI18n();
  return (
    <div className="max-w-3xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">
        {dictionary.library.eyebrow}
      </p>
      <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-7xl">
        {dictionary.library.title}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#64707d]">
        {dictionary.library.description}
      </p>
    </div>
  );
}
