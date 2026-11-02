'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n/provider';

export default function LibraryBackLink({
  href = '/library',
  labelKey = 'backToLibrary',
  dictionaryKey = 'library',
}) {
  const { dictionary } = useI18n();
  const label = dictionary[dictionaryKey][labelKey];
  return (
    <Link href={href} className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#1f4f66]">
      <ArrowLeft size={16} /> {label}
    </Link>
  );
}
