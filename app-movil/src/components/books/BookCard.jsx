import { Image, Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function BookCard({ book }) {
  return (
    <Link href={`/books/${book.id}`} asChild>
      <Pressable>
        <View className="mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4">
          <Image
            className="h-48 w-full rounded-2xl bg-slate-100"
            resizeMode="cover"
            source={book.coverUrl ? { uri: book.coverUrl } : undefined}
          />
          <Text className="mt-4 font-inter-semibold text-lg text-nexus-ink">{book.title}</Text>
          <Text className="mt-1 font-inter-regular text-sm text-slate-500">{book.author}</Text>
          <Text className="mt-3 font-inter-semibold text-nexus-blue">${book.price}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
