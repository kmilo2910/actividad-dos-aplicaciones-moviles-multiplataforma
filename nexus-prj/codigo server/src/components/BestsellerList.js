'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n/provider';

export default function BestsellerList({ books }) {
  const { dictionary } = useI18n();
  const t = dictionary.library;
  return (
    <section className="mt-10 rounded-3xl border border-[#b8d2d6] bg-[#e7eef0] p-7 text-[#17202a]">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">{t.bestsellers}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {books.map((book, index) => (
          <Link
            key={book.id}
            href={`/library/${book.id}`}
            className="border-t border-[#1f4f66]/20 pt-4 transition-colors hover:text-[#1f4f66]"
          >
            <span className="text-sm font-semibold text-[#1f4f66]">0{index + 1}</span>
            <h2 className="mt-5 font-semibold">{book.title}</h2>
            <p className="mt-1 text-sm text-[#64707d]">
              {book.soldLastWeeks} {t.recentSales}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
