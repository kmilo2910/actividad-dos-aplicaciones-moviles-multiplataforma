'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/core/formatters/currency';
import BookCover from '@/components/BookCover';
import { useI18n } from '@/i18n/provider';

export default function BookCard({ book, acquired = false }) {
  const { dictionary } = useI18n();
  const t = dictionary.library;
  return (
    <article className="group flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl border border-[#d8d5ce] bg-white shadow-[0_8px_24px_rgba(23,32,42,0.06)] transition-all duration-500 ease-in-out hover:-translate-y-1 hover:border-[#b8d2d6] hover:shadow-[0_18px_40px_rgba(31,79,102,0.16)]">
      <BookCover
        book={book}
        className="h-48 bg-gradient-to-br from-[#e7eef0] via-[#f4f1eb] to-[#dbe8ea] p-5"
        imageClassName="h-full w-auto saturate-[.88] contrast-[1.04] drop-shadow-[0_10px_10px_rgba(23,32,42,0.2)] transition duration-500 group-hover:scale-105 group-hover:saturate-100"
      />
      <div className="flex flex-1 flex-col p-5">
        <div>
          <div className="mb-7 flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#e7eef0] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1f4f66]">
                {book.type === 'magazine' ? t.typeMagazine : t.typeBook}
              </span>
              {acquired && (
                <span className="inline-flex items-center rounded-full border border-[#9bd3ad] bg-[#e8f5ed] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#237a43]">
                  {t.acquired}
                </span>
              )}
            </div>
            <span className="text-sm text-[#64707d]">{book.year}</span>
          </div>
          <h3 className="text-xl font-semibold leading-tight tracking-tight">{book.title}</h3>
          <p className="mt-2 text-sm text-[#64707d]">{book.author}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-8">
          <span className="font-semibold">{formatCurrency(book.price)}</span>
          <Link
            className="flex items-center gap-1 text-sm font-semibold text-[#1f4f66]"
            href={`/library/${book.id}`}
          >
            {t.detail} <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
