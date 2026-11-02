import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { useAuth } from '../../src/context/AuthContext';
import { useBooks } from '../../src/hooks/useBooks';
import { downloadBook, getBookCoverUrl, getPurchases } from '../../src/services/books';

export default function AcquiredBooksScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { books, isLoading: isLoadingBooks } = useBooks();
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const loadPurchases = useCallback(async () => {
    if (!isAuthenticated) {
      setPurchasedIds([]);
      setIsLoadingPurchases(false);
      return;
    }

    setIsLoadingPurchases(true);
    try {
      const purchases = await getPurchases();
      setPurchasedIds(purchases.map((purchase) => purchase.bookId));
    } finally {
      setIsLoadingPurchases(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      loadPurchases();
    }, [loadPurchases]),
  );

  const purchasedBooks = useMemo(
    () => purchasedIds.map((bookId) => books.find((book) => String(book.id) === String(bookId))).filter(Boolean),
    [books, purchasedIds],
  );

  async function handleDownload(bookId) {
    setDownloadingId(bookId);
    try {
      const result = await downloadBook(bookId);
      const Sharing = await import('expo-sharing');
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Guardar publicación de Nexus Library',
          UTI: 'com.adobe.pdf',
        });
      }
    } finally {
      setDownloadingId(null);
    }
  }

  const loading = isLoadingBooks || isLoadingPurchases;

  return (
    <View className="flex-1 bg-nexus-cream">
      <View className="flex-row items-center border-b border-[#E7E2D9] bg-nexus-cream px-6 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <HapticPressable accessibilityLabel="Volver a Biblioteca" className="h-11 w-11 items-center justify-center rounded-full bg-white" onPress={() => router.back()} hapticStyle="light">
          <Ionicons name="arrow-back" size={22} color="#245B73" />
        </HapticPressable>
        <View className="ml-4 flex-1">
          <Text className="font-space-semibold text-xs uppercase tracking-[2px] text-nexus-green">Nexus Library</Text>
          <Text className="mt-1 font-space-semibold text-xl text-nexus-ink">Mis publicaciones</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 pb-10 pt-6">
        <Text className="font-inter-regular text-base leading-6 text-slate-600">
          Aquí puedes consultar y descargar todos los libros que has adquirido.
        </Text>

        {loading ? (
          <ActivityIndicator className="mt-10" color="#245B73" />
        ) : purchasedBooks.length === 0 ? (
          <View className="mt-8 rounded-3xl border border-[#E7E2D9] bg-white p-6">
            <Ionicons name="library-outline" size={34} color="#245B73" />
            <Text className="mt-4 font-space-semibold text-xl text-nexus-ink">Aún no tienes publicaciones</Text>
            <Text className="mt-2 font-inter-regular leading-6 text-slate-600">
              Explora el catálogo para encontrar un libro para tu jornada.
            </Text>
            <HapticPressable className="mt-6 rounded-full bg-nexus-blue px-5 py-4" onPress={() => router.replace('/books')} hapticStyle="light">
              <Text className="text-center font-inter-semibold text-white">Explorar biblioteca</Text>
            </HapticPressable>
          </View>
        ) : (
          <View className="mt-6 gap-4">
            {purchasedBooks.map((book) => {
              const coverUrl = getBookCoverUrl(book);
              return (
                <View key={book.id} className="flex-row items-center rounded-3xl border border-[#E7E2D9] bg-white p-4">
                  {coverUrl ? (
                    <Image className="h-28 w-20 rounded-xl" resizeMode="cover" source={{ uri: coverUrl }} />
                  ) : (
                    <View className="h-28 w-20 items-center justify-center rounded-xl bg-nexus-blue">
                      <Ionicons name="book-outline" size={30} color="#DDEBED" />
                    </View>
                  )}
                  <View className="ml-4 flex-1">
                    <Text numberOfLines={2} className="font-space-semibold text-xl text-nexus-ink">{book.title}</Text>
                    <Text numberOfLines={1} className="mt-1 font-inter-regular text-sm text-slate-500">{book.author}</Text>
                    <HapticPressable className="mt-4 flex-row items-center self-start rounded-full bg-nexus-blue px-4 py-2.5" disabled={downloadingId === book.id} onPress={() => handleDownload(book.id)} hapticStyle="light">
                      {downloadingId === book.id ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Ionicons name="download-outline" size={16} color="#FFFFFF" />}
                      <Text className="ml-2 font-inter-semibold text-sm text-white">Descargar PDF</Text>
                    </HapticPressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
