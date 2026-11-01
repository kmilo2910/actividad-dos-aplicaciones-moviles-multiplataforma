import { FlatList, RefreshControl, Text, View } from 'react-native';
import BookCard from '../../src/components/books/BookCard';
import ErrorScreen from '../../src/components/ErrorScreen';
import LoadingScreen from '../../src/components/LoadingScreen';
import { useBooks } from '../../src/hooks/useBooks';

export default function BooksScreen() {
  const { books, isLoading, error, reload } = useBooks();

  if (isLoading && books.length === 0) {
    return <LoadingScreen />;
  }

  if (error && books.length === 0) {
    return <ErrorScreen onRetry={reload} />;
  }

  return (
    <View className="flex-1 bg-nexus-cream px-5 pt-12">
      <Text className="font-space-semibold text-4xl text-nexus-ink">Biblioteca</Text>
      <Text className="mt-2 font-inter-regular text-base text-slate-600">
        {books.length} publicaciones disponibles en el catálogo.
      </Text>
      <FlatList
        className="mt-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        data={books}
        keyExtractor={(book) => book.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={reload} />}
        renderItem={({ item }) => <BookCard book={item} />}
      />
    </View>
  );
}
