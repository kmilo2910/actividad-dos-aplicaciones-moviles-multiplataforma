'use client';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { useUser } from '@auth0/nextjs-auth0/client';
import { apiClient } from '@/infrastructure/http/api.client';
import { useI18n } from '@/i18n/provider';
export default function BookCatalog({ books }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [acquiredBookIds, setAcquiredBookIds] = useState([]);
  const { user } = useUser();
  const { dictionary } = useI18n();
  const t = dictionary.library;
  const hasFilters = query || type || category || year;
  useEffect(() => {
    if (!user) return;
    apiClient
      .get('/api/purchases')
      .then((purchases) => setAcquiredBookIds(purchases.map((purchase) => purchase.bookId)))
      .catch(() => setAcquiredBookIds([]));
  }, [user]);
  const categories = [...new Set(books.map((book) => book.category))];
  const years = [...new Set(books.map((book) => book.year))].sort((a, b) => b - a);
  const visible = useMemo(
    () =>
      books.filter(
        (book) =>
          `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()) &&
          (!type || book.type === type) &&
          (!category || book.category === category) &&
          (!year || String(book.year) === year)
      ),
    [books, query, type, category, year]
  );
  function clearFilters() {
    setQuery('');
    setType('');
    setCategory('');
    setYear('');
  }
  return (
    <>
      <div className="mt-14 flex flex-col gap-3 border-y border-[#d8d5ce] py-4 md:flex-row md:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3">
          <Search size={18} className="text-[#64707d]" />
          <input
            className="w-full bg-transparent outline-none"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="flex flex-col gap-3 md:flex-row md:gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-[#d8d5ce] bg-white px-3 py-3 text-sm">
            <SlidersHorizontal size={17} />
            <span className="relative">
              <select
                className="appearance-none bg-transparent pr-6 outline-none"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">{t.all}</option>
                <option value="book">{t.books}</option>
                <option value="magazine">{t.magazines}</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#64707d]"
              />
            </span>
          </label>
          <label className="relative rounded-xl border border-[#d8d5ce] bg-white px-3 py-3 text-sm">
            <select
              className="w-full appearance-none bg-transparent pr-6 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{t.categories}</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#64707d]"
            />
          </label>
          <label className="relative rounded-xl border border-[#d8d5ce] bg-white px-3 py-3 text-sm">
            <select
              className="w-full appearance-none bg-transparent pr-6 outline-none"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">{t.year}</option>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#64707d]"
            />
          </label>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl px-3 py-3 text-sm font-semibold text-[#1f4f66] transition hover:bg-[#e7eef0]"
            >
              {t.clearFilters}
            </button>
          )}
        </div>
      </div>
      {visible.length > 0 ? (
        <div className="grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((book) => (
            <BookCard key={book.id} book={book} acquired={acquiredBookIds.includes(book.id)} />
          ))}
        </div>
      ) : (
        <div className="my-10 rounded-2xl border border-dashed border-[#b8d2d6] bg-[#e7eef0]/60 px-6 py-12 text-center">
          <p className="text-lg font-semibold text-[#17202a]">{t.noResultsTitle}</p>
          <p className="mt-2 text-sm text-[#64707d]">{t.noResultsDescription}</p>
        </div>
      )}
    </>
  );
}
