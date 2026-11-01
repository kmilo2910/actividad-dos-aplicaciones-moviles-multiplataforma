import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <View className="flex-1 bg-nexus-cream px-6 pt-14">
      <Text className="font-space-semibold text-4xl text-nexus-ink">Tu perfil</Text>
      <Text className="mt-3 font-inter-regular text-base leading-6 text-slate-600">
        La sesión permitirá consultar adquisiciones y gestionar reservas.
      </Text>

      {isAuthenticated ? (
        <HapticPressable
          className="mt-8 rounded-full bg-nexus-blue px-5 py-4"
          hapticStyle="light"
          onPress={signOut}
        >
          <Text className="text-center font-inter-semibold text-white">Cerrar sesión</Text>
        </HapticPressable>
      ) : (
        <Link href="/login" asChild>
          <HapticPressable className="mt-8 rounded-full bg-nexus-blue px-5 py-4">
            <Text className="text-center font-inter-semibold text-white">Iniciar sesión</Text>
          </HapticPressable>
        </Link>
      )}
    </View>
  );
}
