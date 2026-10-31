import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import ErrorScreen from '../../src/components/ErrorScreen';
import LoadingScreen from '../../src/components/LoadingScreen';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { getBook } from '../../src/services/books';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  const loadBook = () => {
    setError(null);
    getBook(id).then(setBook).catch(setError);
  };

  useEffect(() => {
    loadBook();
  }, [id]);

  if (!book && !error) return <LoadingScreen />;
  if (error) return <ErrorScreen onRetry={loadBook} />;

  return (
    <ScrollView className="flex-1 bg-nexus-cream" contentContainerClassName="p-6 pb-10">
      <HapticPressable onPress={() => router.back()}>
        <Text className="font-inter-semibold text-nexus-blue">‹ Volver a biblioteca</Text>
      </HapticPressable>
      <Image
        className="mt-6 h-72 w-full rounded-3xl bg-slate-100"
        resizeMode="cover"
        source={book.coverUrl ? { uri: book.coverUrl } : undefined}
      />
      <Text className="mt-6 font-space-semibold text-3xl text-nexus-ink">{book.title}</Text>
      <Text className="mt-2 font-inter-regular text-base text-slate-500">{book.author}</Text>
      <Text className="mt-5 font-inter-regular leading-6 text-slate-700">
        {book.type === 'magazine' ? 'Revista' : 'Libro'} · {book.category} · {book.year}
      </Text>
      <Text className="mt-5 font-space-semibold text-2xl text-nexus-blue">${book.price}</Text>
      <HapticPressable
        className="mt-8 rounded-full bg-nexus-blue px-5 py-4"
        hapticStyle="success"
        onPress={() => {}}
      >
        <Text className="text-center font-inter-semibold text-white">Adquirir publicación</Text>
      </HapticPressable>
    </ScrollView>
  );
}
