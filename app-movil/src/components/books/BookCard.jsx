import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { getBookCoverUrl } from '../../services/books';

function formatCop(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export default function BookCard({ book, columns = 1, isPurchased = false, isDownloading = false, onDownload }) {
  const compact = columns > 1;
  const [coverFailed, setCoverFailed] = useState(false);
  const coverUrl = getBookCoverUrl(book);

  return (
    <View
      className={`mb-4 overflow-hidden rounded-3xl border border-[#E7E2D9] bg-[#FCFBF8] p-4 ${compact ? 'mx-1' : ''}`}
      style={[
        compact ? { flex: 1, minHeight: 440 } : undefined,
        {
          shadowColor: '#17202A',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
          elevation: 3,
        },
      ]}
    >
      <Link href={`/books/${book.id}`} asChild style={compact ? { flex: 1 } : undefined}>
        <Pressable style={compact ? { flex: 1 } : undefined}>
          {coverUrl && !coverFailed ? (
            <Image
              className="w-full rounded-2xl bg-slate-100"
              style={{ aspectRatio: 0.72 }}
              resizeMode="contain"
              source={{ uri: coverUrl }}
              onError={() => setCoverFailed(true)}
            />
          ) : (
            <View className="w-full items-center justify-center rounded-2xl bg-nexus-blue" style={{ aspectRatio: 0.72 }}>
              <Ionicons name="book-outline" size={42} color="#DDEBED" />
              <Text className="mt-3 px-4 text-center font-space-semibold text-sm text-white">Nexus Library</Text>
            </View>
          )}
          <Text className="mt-4 font-inter-semibold text-lg leading-6 text-nexus-ink" numberOfLines={2}>
            {book.title}
          </Text>
          <Text className="mt-1 font-inter-regular text-sm text-slate-500" numberOfLines={1}>
            {book.author}
          </Text>
          <Text className="mt-3 font-inter-semibold text-nexus-blue">{formatCop(book.price)}</Text>
        </Pressable>
      </Link>
      {isPurchased ? (
        <Pressable
          className="mt-4 min-h-[44px] flex-row items-center justify-center rounded-full bg-nexus-blue px-4 active:opacity-80"
          disabled={isDownloading}
          onPress={() => onDownload?.(book.id)}
        >
          {isDownloading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="download-outline" size={17} color="#FFFFFF" />
              <Text className="ml-2 font-inter-semibold text-sm text-white">Descargar PDF</Text>
            </>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

export function BookCardSkeleton({ columns = 1 }) {
  const compact = columns > 1;
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View
      className={`mb-4 overflow-hidden rounded-3xl border border-[#E7E2D9] bg-[#FCFBF8] p-4 ${compact ? 'mx-1' : ''}`}
      style={compact ? { flex: 1 } : undefined}
    >
      <Animated.View className="w-full rounded-2xl bg-[#E5E1D8]" style={[{ aspectRatio: 0.72 }, { opacity }]} />
      <Animated.View className="mt-4 h-5 w-4/5 rounded-lg bg-[#E5E1D8]" style={{ opacity }} />
      <Animated.View className="mt-2 h-4 w-3/5 rounded-lg bg-[#E5E1D8]" style={{ opacity }} />
      <Animated.View className="mt-4 h-5 w-2/5 rounded-lg bg-[#E5E1D8]" style={{ opacity }} />
    </View>
  );
}
