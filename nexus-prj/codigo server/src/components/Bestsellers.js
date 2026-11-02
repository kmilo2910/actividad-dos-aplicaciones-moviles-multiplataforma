import BestsellerList from '@/components/BestsellerList';
import { listBestsellers } from '@/server/books';

export default async function Bestsellers() {
  const books = await listBestsellers(10);
  return <BestsellerList books={books} />;
}
