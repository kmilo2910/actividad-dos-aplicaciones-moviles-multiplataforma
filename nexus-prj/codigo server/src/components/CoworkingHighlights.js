'use client';
import { useI18n } from '@/i18n/provider';
import { coworkingHighlights } from '@/i18n/coworking';
export default function CoworkingHighlights() {
  const { language } = useI18n();
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      {(coworkingHighlights[language] || coworkingHighlights.es).map(([title, text]) => (
        <div
          key={title}
          className="nexus-card !border-[#b9d8c5]/60 !bg-[#e8f3eb]/55 shadow-sm backdrop-blur-sm"
        >
          <p className="nexus-label !text-[#2f6f4e]">{title}</p>
          <p className="mt-2 font-semibold">{text}</p>
        </div>
      ))}
    </div>
  );
}
