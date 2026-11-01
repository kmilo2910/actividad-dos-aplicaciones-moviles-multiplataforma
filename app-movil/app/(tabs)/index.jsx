import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import HapticPressable from '../../src/components/ui/HapticPressable';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-nexus-cream" contentContainerClassName="p-6 pb-10">
      <Text className="mt-10 font-space-semibold text-xs uppercase tracking-[3px] text-nexus-green">
        Nexus University
      </Text>
      <Text className="mt-4 font-space-semibold text-4xl leading-tight text-nexus-ink">
        Tu campus para aprender, crear y compartir.
      </Text>
      <Text className="mt-5 font-inter-regular text-base leading-6 text-slate-600">
        Explora el catálogo universitario y encuentra el siguiente recurso para tu jornada.
      </Text>

      <View className="mt-8 rounded-3xl bg-nexus-blue p-6">
        <Text className="font-space-semibold text-2xl text-white">Biblioteca universitaria</Text>
        <Text className="mt-3 font-inter-regular leading-6 text-nexus-teal">
          Consulta libros y revistas disponibles desde una experiencia móvil nativa.
        </Text>
        <Link href="/books" asChild>
          <HapticPressable className="mt-6 rounded-full bg-white px-5 py-4" hapticStyle="light">
            <Text className="text-center font-inter-semibold text-nexus-blue">Explorar catálogo</Text>
          </HapticPressable>
        </Link>
      </View>

      <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-6">
        <Text className="font-space-semibold text-2xl text-nexus-ink">Coworking Nexus</Text>
        <Text className="mt-3 font-inter-regular leading-6 text-slate-600">
          Encuentra espacios de trabajo colaborativo y reserva tu puesto desde la aplicación.
        </Text>
      </View>
    </ScrollView>
  );
}
