'use client';
import { useEffect, useState } from 'react';
import LibraryShell from '@/components/LibraryShell';
import { apiClient } from '@/infrastructure/http/api.client';
import { formatCurrency } from '@/core/formatters/currency';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import DownloadReceipt from '@/components/DownloadReceipt';
import BookCover from '@/components/BookCover';
import { useI18n } from '@/i18n/provider';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import LibraryBackLink from '@/components/LibraryBackLink';
export default function AcquiredPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const { user } = useUser();
  const { dictionary } = useI18n();
  const t = dictionary.acquisitions;
  useEffect(() => {
    if (!user) return;
    apiClient
      .get('/api/purchases')
      .then(async (purchases) => {
        const items = await Promise.all(
          purchases.map(async (purchase) => {
            try {
              const book = await fetch(`/api/books/${purchase.bookId}`)
                .then((response) => response.json())
                .then((payload) => payload.data);
              return { ...purchase, book };
            } catch {
              return purchase;
            }
          })
        );
        setItems(items);
      })
      .catch((err) => setError(err.message));
  }, [user, t.loginRequired]);
  return (
    <LibraryShell>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <LibraryBackLink href="/library" labelKey="backToLibrary" dictionaryKey="acquisitions" />
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">{t.eyebrow}</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-.06em]">{t.title}</h1>
        {error && <p className="mt-8 text-red-700">{error}</p>}
        {!error && (
          <div className="mt-12 overflow-hidden rounded-2xl border border-[#d8d5ce] bg-white">
            {items.length ? (
              <>
                <div className="grid min-w-0 max-w-full gap-3 p-3 md:hidden">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#eeeae2] bg-[#faf9f6] p-4"
                    >
                      <div className="flex gap-4">
                        <BookCover
                          book={item.book || { id: item.bookId }}
                          className="h-24 w-16 shrink-0 rounded-lg bg-transparent p-0"
                          imageClassName="max-h-full w-auto rounded-md object-contain shadow-[0_6px_12px_rgba(23,32,42,0.18)]"
                        />
                        <div className="min-w-0 flex-1">
                          <Link
                            className="block truncate font-semibold text-[#1f4f66]"
                            href={`/library/${item.bookId}`}
                          >
                            {item.book?.title || `Publicación ${item.bookId}`}
                          </Link>
                          <p className="mt-1 truncate text-sm text-[#64707d]">
                            {item.book?.author || '—'}
                          </p>
                          <p className="mt-3 text-xs text-[#64707d]">
                            {t.purchaseDate}:{' '}
                            {new Date(item.purchasedAt).toLocaleDateString('es-CO')}
                          </p>
                          <p className="mt-1 font-semibold">{formatCurrency(item.price)}</p>
                        </div>
                      </div>
                      <div className="mt-4 min-w-0 max-w-full border-t border-[#e5e1d9] pt-3">
                        <DownloadReceipt purchase={item} book={item.book} />
                      </div>
                    </article>
                  ))}
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="border-b border-[#d8d5ce] bg-[#f8f7f4] text-xs uppercase tracking-wider text-[#64707d]">
                      <tr>
                        <th className="px-5 py-4">{t.cover}</th>
                        <th className="px-5 py-4">{t.publication}</th>
                        <th className="px-5 py-4">{t.author}</th>
                        <th className="px-5 py-4">{t.purchaseDate}</th>
                        <th className="px-5 py-4">{t.price}</th>
                        <th className="px-5 py-4">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-[#eeeae2] last:border-0 hover:bg-[#faf9f6]"
                        >
                          <td className="px-5 py-4">
                            <BookCover
                              book={item.book || { id: item.bookId }}
                              className="h-20 w-14 rounded-lg bg-transparent p-0"
                              imageClassName="max-h-full w-auto rounded-md object-contain shadow-[0_6px_12px_rgba(23,32,42,0.18)]"
                            />
                          </td>
                          <td className="px-5 py-5 font-semibold">
                            <Link
                              className="text-[#1f4f66] hover:underline"
                              href={`/library/${item.bookId}`}
                            >
                              {item.book?.title || `Publicación ${item.bookId}`}
                            </Link>
                          </td>
                          <td className="px-5 py-5 text-[#64707d]">{item.book?.author || '—'}</td>
                          <td className="px-5 py-5 text-[#64707d]">
                            {new Date(item.purchasedAt).toLocaleDateString('es-CO')}
                          </td>
                          <td className="px-5 py-5 font-semibold">{formatCurrency(item.price)}</td>
                          <td className="px-5 py-5">
                            <DownloadReceipt purchase={item} book={item.book} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="relative overflow-hidden px-6 py-16 text-center md:px-12">
                <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#e7eef0]/70" />
                <div className="absolute -bottom-24 -left-10 h-44 w-44 rounded-full bg-[#f4f1eb]" />
                <div className="relative mx-auto max-w-md">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7eef0] text-[#1f4f66] shadow-sm">
                    <BookOpen size={25} />
                  </span>
                  <p className="mt-6 text-2xl font-semibold tracking-tight text-[#17202a]">
                    {t.emptyTitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#64707d]">
                    {t.emptyDescription}
                  </p>
                  <Link
                    href="/library"
                    className="!text-white mt-7 inline-flex items-center gap-2 rounded-full bg-[#1f4f66] px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:!text-white hover:bg-[#173b4d]"
                  >
                    {t.explore}
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </LibraryShell>
  );
}
