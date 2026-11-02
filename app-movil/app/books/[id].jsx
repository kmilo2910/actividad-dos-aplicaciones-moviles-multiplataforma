import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorScreen from '../../src/components/ErrorScreen';
import LoadingScreen from '../../src/components/LoadingScreen';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { downloadBook, getBook, getBookCoverUrl, getPurchases, purchaseBook } from '../../src/services/books';

function formatCop(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [purchaseState, setPurchaseState] = useState('idle');
  const [downloadState, setDownloadState] = useState('idle');
  const [feedback, setFeedback] = useState(null);

  const loadBook = async () => {
    setError(null);
    setBook(null);

    try {
      const [loadedBook, purchases] = await Promise.all([
        getBook(id),
        Promise.race([
          getPurchases().catch(() => []),
          new Promise((resolve) => setTimeout(() => resolve([]), 1200)),
        ]),
      ]);

      setPurchaseState(
        purchases.some((purchase) => purchase.bookId === id) ? 'done' : 'idle',
      );
      setBook(loadedBook);
    } catch (loadError) {
      setError(loadError);
    }
  };

  useEffect(() => {
    loadBook();
  }, [id]);

  async function handlePurchase() {
    if (purchaseState === 'loading' || purchaseState === 'done') return;

    setFeedback({
      type: 'confirm',
      title: 'Confirmar adquisición',
      message: `¿Quieres adquirir “${book.title}” por ${formatCop(book.price)}?`,
    });
  }

  async function confirmPurchase() {
    setFeedback(null);

    setPurchaseState('loading');

    try {
      await purchaseBook(id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPurchaseState('done');
      setFeedback({
        type: 'success',
        title: 'Adquisición registrada',
        message: 'La publicación ya está disponible en tu biblioteca.',
      });
    } catch (purchaseError) {
      setPurchaseState('error');
      const requiresAuth = purchaseError.status === 401 || purchaseError.code === 'AUTH_REQUIRED';
      setFeedback({
        type: requiresAuth ? 'auth' : 'error',
        title: requiresAuth ? 'Inicia sesión para continuar' : 'No se pudo completar',
        message: requiresAuth
          ? 'Necesitas una sesión activa para adquirir publicaciones.'
          : purchaseError.message || 'Inténtalo nuevamente en unos segundos.',
      });
    }
  }

  async function handleDownload() {
    if (purchaseState !== 'done' || downloadState === 'loading') return;

    setDownloadState('loading');
    try {
      const result = await downloadBook(id);
      const Sharing = await import('expo-sharing');
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Guardar publicación de Nexus Library',
          UTI: 'com.adobe.pdf',
        });
      }
      setFeedback({
        type: 'success',
        title: 'Descarga lista',
        message: 'La publicación está preparada para guardarla o compartirla.',
      });
    } catch (downloadError) {
      setFeedback({
        type: 'error',
        title: 'No se pudo descargar',
        message: downloadError.message || 'Inténtalo nuevamente en unos segundos.',
      });
    } finally {
      setDownloadState('idle');
    }
  }

  if (error) return <ErrorScreen onRetry={loadBook} />;
  if (!book) return <LoadingScreen subtitle="Preparando tu libro" />;

  const coverUrl = getBookCoverUrl(book);

  return (
    <SafeAreaView className="flex-1 bg-nexus-cream" edges={['top', 'left', 'right']}>
      {book ? (
        <>
      <View className="flex-row items-center border-b border-[#E8E2D8] px-6 py-3">
        <HapticPressable
          accessibilityLabel="Volver a biblioteca"
          className="h-11 w-11 items-center justify-center rounded-full bg-[#E9F0F2]"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#245B73" />
        </HapticPressable>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text className="font-inter-semibold text-xs uppercase tracking-[2px] text-nexus-green">
            Nexus Library
          </Text>
          <Text className="mt-0.5 font-space-semibold text-lg text-nexus-ink">
            Detalle del libro
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 pb-10 pt-5">
        <View>

      <View>
        <View className="relative mt-7 h-96 overflow-hidden rounded-3xl bg-[#F5F2EC] p-4">
        {coverUrl ? (
          <Image
            className="absolute inset-0 h-full w-full"
            blurRadius={18}
            resizeMode="cover"
            source={{ uri: coverUrl }}
            style={{ opacity: 0.58, transform: [{ scale: 1.2 }] }}
          />
        ) : null}
        <View
          className="absolute inset-0"
          style={{ backgroundColor: '#F5F2EC', opacity: 0.12 }}
        />
        <View className="flex-1 items-center justify-center rounded-2xl">
          <View
            className="h-full w-2/3"
            style={{ aspectRatio: 0.68 }}
          >
            <Image
              className="absolute inset-0 h-full w-full"
              resizeMode="contain"
              source={coverUrl ? { uri: coverUrl } : undefined}
            />
          </View>
        </View>
        </View>
      </View>
      <View>
        <Text className="mt-6 font-space-semibold text-3xl text-nexus-ink">{book.title}</Text>
        <Text className="mt-2 font-inter-regular text-base text-slate-500">{book.author}</Text>
        <Text className="mt-5 font-inter-regular leading-6 text-slate-700">
          {book.type === 'magazine' ? 'Revista' : 'Libro'} · {book.category} · {book.year}
        </Text>
      </View>
      <View>
      <Text className="mt-5 font-space-semibold text-2xl text-nexus-blue">
        {formatCop(book.price)}
      </Text>
      <HapticPressable
        className="mt-8 min-h-[56px] flex-row items-center justify-center rounded-full bg-nexus-blue px-5 py-4 disabled:opacity-60"
        disabled={purchaseState === 'loading' || purchaseState === 'done'}
        hapticStyle="success"
        onPress={handlePurchase}
      >
        {purchaseState === 'loading' ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-center font-inter-semibold text-white">
            {purchaseState === 'done' ? 'Adquirido' : 'Adquirir publicación'}
          </Text>
        )}
      </HapticPressable>
      {purchaseState === 'done' ? (
        <HapticPressable
          className="mt-4 min-h-[56px] flex-row items-center justify-center rounded-full border border-nexus-blue bg-white px-5 py-4 disabled:opacity-60"
          disabled={downloadState === 'loading'}
          hapticStyle="light"
          onPress={handleDownload}
        >
          {downloadState === 'loading' ? (
            <ActivityIndicator color="#245B73" />
          ) : (
            <>
              <Ionicons name="download-outline" size={19} color="#245B73" />
              <Text className="ml-2 text-center font-inter-semibold text-nexus-blue">Descargar PDF</Text>
            </>
          )}
        </HapticPressable>
      ) : null}
      </View>

        </View>

      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={Boolean(feedback)}
        onRequestClose={() => setFeedback(null)}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 31, 44, 0.52)',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 360,
              borderRadius: 28,
              backgroundColor: '#F5F1E9',
              paddingHorizontal: 24,
              paddingTop: 28,
              paddingBottom: 24,
            }}
          >
            <View
              className={`h-16 w-16 items-center justify-center self-center rounded-2xl ${
                feedback?.type === 'success'
                  ? 'bg-[#E7F4EC]'
                    : feedback?.type === 'auth'
                    ? 'bg-[#E7EEF4]'
                      : feedback?.type === 'confirm'
                        ? 'bg-[#E7EEF4]'
                        : 'bg-[#FCE9E7]'
              }`}
            >
              <Ionicons
                name={
                  feedback?.type === 'success'
                    ? 'checkmark-circle-outline'
                    : feedback?.type === 'auth'
                      ? 'lock-closed-outline'
                      : feedback?.type === 'confirm'
                        ? 'cart-outline'
                        : 'alert-circle-outline'
                }
                size={34}
                color={
                  feedback?.type === 'success'
                    ? '#237A43'
                    : feedback?.type === 'auth'
                      ? '#245B73'
                      : feedback?.type === 'confirm'
                        ? '#245B73'
                        : '#B5443D'
                }
              />
            </View>
            <Text className="mt-5 text-center font-space-semibold text-2xl text-nexus-ink">
              {feedback?.title}
            </Text>
            <Text className="mt-3 text-center font-inter-regular text-base leading-6 text-slate-600">
              {feedback?.message}
            </Text>
            {feedback?.type === 'confirm' ? (
              <View className="mt-7 flex-row gap-3">
                <HapticPressable
                  className="min-h-[56px] flex-1 items-center justify-center rounded-full border border-[#B8C9CE] px-4"
                  onPress={() => setFeedback(null)}
                >
                  <Text className="font-inter-semibold text-base text-nexus-blue">Cancelar</Text>
                </HapticPressable>
                <HapticPressable
                  className="min-h-[56px] flex-1 items-center justify-center rounded-full bg-nexus-blue px-4"
                  onPress={confirmPurchase}
                >
                  <Text className="text-center font-inter-semibold text-base text-white">
                    Confirmar compra
                  </Text>
                </HapticPressable>
              </View>
            ) : (
              <HapticPressable
                className="mt-7 min-h-[60px] items-center justify-center rounded-full bg-nexus-blue px-5"
                onPress={() => setFeedback(null)}
              >
                <Text className="font-inter-semibold text-base text-white">
                  {feedback?.type === 'success' ? 'Continuar' : 'Entendido'}
                </Text>
              </HapticPressable>
            )}
          </View>
        </View>
      </Modal>
        </>
      ) : null}
    </SafeAreaView>
  );
}
