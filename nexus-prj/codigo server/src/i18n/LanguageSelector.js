'use client';

import { Globe2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from './config';
import { useI18n } from './provider';

const labels = { es: 'ES', en: 'EN', fr: 'FR', it: 'IT', de: 'DE' };

export default function LanguageSelector() {
  const { language, changeLanguage } = useI18n();
  const router = useRouter();
  return (
    <label className="relative hidden cursor-pointer items-center gap-1.5 rounded-full border border-[#d8d5ce] bg-white/70 px-3 py-2 text-xs font-semibold text-[#17202a] transition hover:bg-white md:flex">
      <Globe2 size={14} className="text-[#64707d]" />
      <span className="sr-only">Seleccionar idioma</span>
      <select
        aria-label="Seleccionar idioma"
        value={language}
        onChange={(event) => {
          changeLanguage(event.target.value);
          router.refresh();
        }}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 outline-none"
      >
        {SUPPORTED_LANGUAGES.map((item) => (
          <option key={item} value={item}>
            {labels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
