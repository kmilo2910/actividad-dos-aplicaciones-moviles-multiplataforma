'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { apiClient } from '@/infrastructure/http/api.client';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { useI18n } from '@/i18n/provider';
export default function PersonalStats() {
  const { dictionary } = useI18n();
  const t = dictionary.dashboard;
  const { user } = useUser();
  const [purchases, setPurchases] = useState(null);
  useEffect(() => {
    if (!user) return;
    apiClient
      .get('/api/purchases')
      .then(setPurchases)
      .catch(() => setPurchases([]));
  }, [user]);
  return (
    <Link
      href="/library/acquired"
      className="group flex min-h-44 flex-col rounded-2xl border border-[#d8d5ce] bg-white p-5 text-[#17202a] transition-all duration-500 ease-in-out hover:-translate-y-1 hover:border-[#1f4f66] hover:bg-[#1f4f66] hover:text-[#f4f1eb] hover:shadow-lg"
    >
      <BookOpen className="text-[#1f4f66] transition-colors duration-300 group-hover:text-[#f4f1eb]" />
      <p className="mt-5 text-sm text-[#64707d] transition-colors duration-300 group-hover:text-[#dbe8ea]">
        {t.yourLibrary}
      </p>
      <p className="mt-2 min-h-7 text-xl font-semibold transition-colors duration-300 group-hover:text-white">
        {purchases === null ? t.loading : t.acquisitionsCount(purchases.length)}
      </p>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[#1f4f66] transition-colors duration-300 group-hover:text-white">
        {t.viewAcquisitions}{' '}
        <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
