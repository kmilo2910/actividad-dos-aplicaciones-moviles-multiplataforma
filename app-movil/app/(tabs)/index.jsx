import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { useAuth } from '../../src/context/AuthContext';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function HomeScreen() {
  const { isAuthenticated, user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || user?.nickname || user?.email?.split('@')[0];
  const greeting = getTimeGreeting();

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
          Próximo en tu campus
        </Text>
        <Text className="mt-4 font-space-semibold text-2xl text-nexus-ink">Coworking Nexus</Text>
        <Text className="mt-4 font-inter-regular leading-6 text-slate-600">
          Encuentra espacios de trabajo colaborativo y reserva tu puesto desde la aplicación.
        </Text>
        <Link href="/(tabs)/coworking" asChild>
          <HapticPressable className="mt-7 rounded-full border border-nexus-blue px-5 py-4 active:bg-slate-50" hapticStyle="light">
            <Text className="text-center font-inter-semibold text-nexus-blue">Ver espacios</Text>
          </HapticPressable>
        </Link>
      </View>
    </ScrollView>
  );
}
