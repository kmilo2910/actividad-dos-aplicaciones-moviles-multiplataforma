import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View, useWindowDimensions } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BookCard, { BookCardSkeleton } from '../../src/components/books/BookCard';
import ErrorScreen from '../../src/components/ErrorScreen';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { useAuth } from '../../src/context/AuthContext';
import { useBooks } from '../../src/hooks/useBooks';
import { downloadBook, getPurchases } from '../../src/services/books';

export default function BooksScreen() {
  const insets = useSafeAreaInsets();
  const { books, isLoading, error, reload } = useBooks();
  const { isAuthenticated } = useAuth();
  const { width } = useWindowDimensions();
  const columns = width >= 390 ? 2 : 1;
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const loadPurchases = useCallback(async () => {
    if (!isAuthenticated) {
      setPurchasedIds([]);
      return;
    }

    try {
      const purchases = await getPurchases();
      setPurchasedIds(purchases.map((purchase) => purchase.bookId));
    } catch {
      setPurchasedIds([]);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      loadPurchases();
    }, [loadPurchases]),
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

  if (error && books.length === 0) {
    return <ErrorScreen onRetry={reload} />;
  }

  return (
    <View className="flex-1 bg-nexus-cream">
      <View className="bg-nexus-cream px-6 pb-4" style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text className="font-space-semibold text-xs uppercase tracking-[3px] text-nexus-green">
          Nexus Library
        </Text>
        <Text className="mt-4 font-space-semibold text-4xl leading-tight text-nexus-ink">
          Biblioteca
        </Text>
        <Text className="mt-5 font-inter-regular text-base leading-6 text-slate-600">
          {books.length} publicaciones disponibles en el catálogo.
        </Text>
        {isAuthenticated && purchasedIds.length > 0 ? (
          <View className="mt-4 flex-row items-center">
            <Text className="font-inter-regular text-sm text-slate-500">
              {purchasedIds.length} {purchasedIds.length === 1 ? 'publicación adquirida' : 'publicaciones adquiridas'}
            </Text>
            {isLoading ? <ActivityIndicator className="ml-2" size="small" color="#245B73" /> : null}
          </View>
        ) : null}
        {isAuthenticated ? (
          <Link href="/books/acquired" asChild>
            <HapticPressable className="mt-5 flex-row items-center justify-center rounded-full border border-nexus-blue bg-white px-5 py-3" hapticStyle="light">
              <Text className="font-inter-semibold text-sm text-nexus-blue">Ver publicaciones adquiridas</Text>
            </HapticPressable>
          </Link>
        ) : null}
        <LinearGradient
          colors={['rgba(244, 241, 235, 0.96)', 'rgba(244, 241, 235, 0)']}
          pointerEvents="none"
          style={styles.headerFade}
        />
      </View>
      <FlatList
        className="flex-1 px-6 pt-5"
        key={columns}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? { gap: 12 } : undefined}
        contentContainerStyle={{ paddingBottom: 24 }}
        data={isLoading && books.length === 0 ? [1, 2, 3, 4] : books}
        keyExtractor={(book) => (typeof book === 'number' ? `skeleton-${book}` : book.id)}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={reload} />}
        renderItem={({ item }) =>
          typeof item === 'number' ? (
            <BookCardSkeleton columns={columns} />
          ) : (
            <BookCard
              book={item}
              columns={columns}
              isPurchased={purchasedIds.includes(item.id)}
              isDownloading={downloadingId === item.id}
              onDownload={handleDownload}
            />
          )
        }
      />
    </View>
  );
}

const styles = {
  header: {
    elevation: 8,
    overflow: 'visible',
    position: 'relative',
    zIndex: 10,
  },
  headerFade: {
    bottom: -24,
    height: 24,
    left: 0,
    position: 'absolute',
    right: 0,
  },
};
