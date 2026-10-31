import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-1 justify-center bg-nexus-cream px-6">
      <Text className="font-space-semibold text-4xl text-nexus-ink">Iniciar sesión</Text>
      <Text className="mt-4 font-inter-regular text-base leading-6 text-slate-600">
        El flujo OAuth de Auth0 se conectará aquí con el callback móvil configurado para Nexus.
      </Text>
      <Link href="/(tabs)" replace className="mt-8 rounded-full bg-nexus-blue px-5 py-4">
        <Text className="text-center font-inter-semibold text-white">Volver al inicio</Text>
      </Link>
    </View>
  );
}
