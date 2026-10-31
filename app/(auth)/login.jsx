import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { isAuth0Ready, signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState('');

  async function handleSignIn() {
    setError('');
    setIsSigningIn(true);

    try {
      await signIn();
      router.replace('/(tabs)');
    } catch (nextError) {
      setError(nextError.message || 'No se pudo iniciar sesión.');
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-nexus-cream px-6">
      <Text className="font-space-semibold text-4xl text-nexus-ink">Iniciar sesión</Text>
      <Text className="mt-4 font-inter-regular text-base leading-6 text-slate-600">
        Accede a tu biblioteca y gestiona tus reservas con tu cuenta de Nexus.
      </Text>

      <HapticPressable
        className="mt-8 rounded-full bg-nexus-blue px-5 py-4 disabled:opacity-60"
        disabled={!isAuth0Ready || isSigningIn}
        hapticStyle="light"
        onPress={handleSignIn}
      >
        {isSigningIn ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-center font-inter-semibold text-white">
            {isAuth0Ready ? 'Continuar con Google' : 'Conectando con Auth0...'}
          </Text>
        )}
      </HapticPressable>

      {error ? <Text className="mt-4 text-center font-inter-regular text-red-700">{error}</Text> : null}

      <Link href="/(tabs)" replace className="mt-8">
        <Text className="text-center font-inter-semibold text-nexus-blue">Volver al inicio</Text>
      </Link>
    </View>
  );
}
