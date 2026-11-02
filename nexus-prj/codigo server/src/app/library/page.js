import LibraryShell from '@/components/LibraryShell';
import BookCatalog from '@/components/BookCatalog';
import Bestsellers from '@/components/Bestsellers';
import LibraryIntro from '@/components/LibraryIntro';
import LibraryBackLink from '@/components/LibraryBackLink';
import { listBooks } from '@/server/books';
export const dynamic = 'force-dynamic';
export default async function LibraryPage() {
  const books = await listBooks();
  return (
    <LibraryShell>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <LibraryBackLink href="/dashboard" labelKey="backToDashboard" />
        <LibraryIntro />
        <Bestsellers />
        <BookCatalog books={books} />
      </div>
    </LibraryShell>
  );
}
