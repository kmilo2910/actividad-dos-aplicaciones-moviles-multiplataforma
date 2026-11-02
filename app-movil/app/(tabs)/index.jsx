import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { useAuth } from '../../src/context/AuthContext';
import { downloadBook, getBook, getBookCoverUrl, getPurchases } from '../../src/services/books';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function HomeScreen() {
  const { isAuthenticated, user } = useAuth();
  const [acquiredBooks, setAcquiredBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const firstName = user?.name?.split(' ')[0] || user?.nickname || user?.email?.split('@')[0];
  const greeting = getTimeGreeting();

  const loadAcquiredBooks = useCallback(async () => {
    if (!isAuthenticated) {
      setAcquiredBooks([]);
      return;
    }

    setLoadingBooks(true);
    try {
      const purchases = await getPurchases();
      const books = await Promise.all(
        purchases.slice(0, 3).map(async (purchase) => {
          try {
            return { ...purchase, book: await getBook(purchase.bookId) };
          } catch {
            return { ...purchase, book: null };
          }
        }),
      );
      setAcquiredBooks(books);
    } catch {
      setAcquiredBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      loadAcquiredBooks();
    }, [loadAcquiredBooks]),
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
    } catch {
      // The download action remains quiet here; the API and platform share sheet show the relevant state.
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <ScrollView className="flex-1 bg-nexus-cream" contentContainerClassName="p-6 pb-10">
      <Text className="mt-8 font-inter-semibold text-sm text-nexus-green">
        {isAuthenticated ? `${greeting}, ${firstName || 'de nuevo'}` : `${greeting}, bienvenido`}
      </Text>
      <Text className="mt-8 font-space-semibold text-xs uppercase tracking-[3px] text-nexus-green">
        Nexus University
      </Text>
      <Text className="mt-5 font-space-semibold text-4xl leading-tight text-nexus-ink">
        Tu campus para aprender, crear y compartir.
      </Text>
      <Text className="mt-7 font-inter-regular text-base leading-6 text-slate-600">
        Explora el catálogo universitario y encuentra el siguiente recurso para tu jornada.
      </Text>

      <View
        className="mt-10 rounded-3xl border border-white/20 bg-nexus-blue p-7"
        style={{
          shadowColor: '#17202A',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.14,
          shadowRadius: 18,
          elevation: 7,
        }}
      >
        <Text className="font-inter-semibold text-xs uppercase tracking-[2px] text-nexus-teal">
          Recurso destacado
        </Text>
        <Text className="mt-4 font-space-semibold text-2xl text-white">Biblioteca universitaria</Text>
        <Text className="mt-3 font-inter-regular leading-6 text-nexus-teal">
          Consulta libros y revistas disponibles desde una experiencia móvil nativa.
        </Text>
        <Link href="/books" asChild>
          <HapticPressable className="mt-8 rounded-full bg-white px-5 py-4 active:opacity-80" hapticStyle="light">
            <Text className="text-center font-inter-semibold text-nexus-blue">Explorar catálogo</Text>
          </HapticPressable>
        </Link>
      </View>

      <View
        className="mt-8 rounded-3xl border border-slate-200 bg-white p-7"
        style={{
          shadowColor: '#17202A',
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
          elevation: 4,
        }}
      >
        <Text className="font-inter-semibold text-xs uppercase tracking-[2px] text-nexus-green">
          Tu biblioteca
        </Text>
        <Text className="mt-4 font-space-semibold text-2xl text-nexus-ink">Publicaciones adquiridas</Text>
        <Text className="mt-4 font-inter-regular leading-6 text-slate-600">
          Accede a tus libros y descarga el material de ejemplo cuando lo necesites.
        </Text>

        {!isAuthenticated ? (
          <Text className="mt-6 font-inter-regular leading-6 text-slate-500">
            Inicia sesión para consultar tus adquisiciones.
          </Text>
        ) : loadingBooks ? (
          <ActivityIndicator className="mt-6 self-start" color="#245B73" />
        ) : acquiredBooks.length === 0 ? (
          <Text className="mt-6 font-inter-regular leading-6 text-slate-500">
            Aún no tienes publicaciones adquiridas.
          </Text>
        ) : (
          <View className="mt-6 gap-4">
            {acquiredBooks.map(({ book, bookId }) => (
              <View key={bookId} className="flex-row items-center rounded-2xl bg-[#F5F1E9] p-3">
                {getBookCoverUrl(book) ? (
                  <Image className="h-20 w-14 rounded-lg" resizeMode="cover" source={{ uri: getBookCoverUrl(book) }} />
                ) : (
                  <View className="h-20 w-14 items-center justify-center rounded-lg bg-[#DDE6E8]">
                    <Text className="font-space-semibold text-lg text-nexus-blue">N</Text>
                  </View>
                )}
                <View className="ml-3 flex-1">
                  <Text numberOfLines={2} className="font-inter-semibold text-base text-nexus-ink">
                    {book?.title || `Publicación ${bookId}`}
                  </Text>
                  <HapticPressable
                    className="mt-2 self-start rounded-full bg-nexus-blue px-4 py-2 active:opacity-80"
                    disabled={downloadingId === bookId}
                    hapticStyle="light"
                    onPress={() => handleDownload(bookId)}
                  >
                    {downloadingId === bookId ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text className="font-inter-semibold text-xs text-white">Descargar PDF</Text>
                    )}
                  </HapticPressable>
                </View>
              </View>
            ))}
          </View>
        )}
        <Link href="/books" asChild>
          <HapticPressable className="mt-7 rounded-full border border-nexus-blue px-5 py-4 active:bg-slate-50" hapticStyle="light">
            <Text className="text-center font-inter-semibold text-nexus-blue">Explorar biblioteca</Text>
          </HapticPressable>
        </Link>
      </View>
    </ScrollView>
  );
}
