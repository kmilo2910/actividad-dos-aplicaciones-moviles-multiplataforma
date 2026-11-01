'use client';

import { useI18n } from '@/i18n/provider';
import PurchaseButton from '@/components/PurchaseButton';
import { formatCurrency } from '@/core/formatters/currency';

export default function BookDetailInfo({ book }) {
  const { dictionary } = useI18n();
  const t = dictionary.library;
  return (
    <div>
      <span className="rounded-full bg-[#e7eef0] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1f4f66]">
        {book.type === 'magazine' ? t.typeMagazine : t.typeBook}
      </span>
      <h1 className="mt-5 text-5xl font-semibold tracking-[-.05em]">{book.title}</h1>
      <p className="mt-4 text-lg text-[#64707d]">
        {book.author} · {book.year}
      </p>
      <p className="mt-8 text-base leading-relaxed text-[#64707d]">
        {book.longDescription || book.shortDescription}
      </p>
      <p className="mt-8 text-3xl font-semibold">{formatCurrency(book.price)}</p>
      <PurchaseButton bookId={book.id} />
    </div>
  );
}
