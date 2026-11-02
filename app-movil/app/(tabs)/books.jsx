import { FlatList, RefreshControl, Text, View, useWindowDimensions } from 'react-native';
import BookCard, { BookCardSkeleton } from '../../src/components/books/BookCard';
import ErrorScreen from '../../src/components/ErrorScreen';
import { useBooks } from '../../src/hooks/useBooks';

export default function BooksScreen() {
  const { books, isLoading, error, reload } = useBooks();
  const { width } = useWindowDimensions();
  const columns = width >= 390 ? 2 : 1;

  if (error && books.length === 0) {
    return <ErrorScreen onRetry={reload} />;
  }

  return (
    <View className="flex-1 bg-nexus-cream px-6 pt-6">
      <Text className="mt-10 font-space-semibold text-xs uppercase tracking-[3px] text-nexus-green">
        Nexus Library
      </Text>
      <Text className="mt-4 font-space-semibold text-4xl leading-tight text-nexus-ink">
        Biblioteca
      </Text>
      <Text className="mt-5 font-inter-regular text-base leading-6 text-slate-600">
        {books.length} publicaciones disponibles en el catálogo.
      </Text>
      <FlatList
        className="mt-8"
        key={columns}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? { gap: 12 } : undefined}
        contentContainerStyle={{ paddingBottom: 24 }}
        data={isLoading && books.length === 0 ? [1, 2, 3, 4] : books}
        keyExtractor={(book) => (typeof book === 'number' ? `skeleton-${book}` : book.id)}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={reload} />}
        renderItem={({ item }) =>
          typeof item === 'number' ? <BookCardSkeleton columns={columns} /> : <BookCard book={item} columns={columns} />
        }
      />
    </View>
  );
}
