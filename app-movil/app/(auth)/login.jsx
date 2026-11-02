import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { useAuth } from '../../src/context/AuthContext';

const APP_VERSION = '1.0.0';

export default function LoginScreen() {
  const router = useRouter();
  const { isAuth0Ready, signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState('');
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardOffset = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.timing(cardOffset, {
      toValue: 0,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [cardOffset, cardOpacity]);

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
    <ScrollView
      bounces={false}
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-nexus-cream"
    >
      <View className="flex-1 justify-between px-6 pb-7 pt-16">
        <View>
          <View className="flex-row items-center">
            <View className="h-14 w-14 items-center justify-center rounded-2xl border border-nexus-blue/10 bg-white shadow-sm">
              <Image
                accessibilityLabel="Logo de Nexus"
                className="h-10 w-10"
                resizeMode="contain"
                source={require('../../assets/nexus-icon.png')}
              />
            </View>
            <View className="ml-4">
              <Text className="font-inter-semibold text-xs uppercase tracking-[3px] text-nexus-green">
                NEXUS
              </Text>
              <Text className="mt-1 font-space-semibold text-xl text-nexus-ink">
                Campus Digital
              </Text>
            </View>
          </View>

          <View className="mt-20">
            <Text className="font-space-semibold text-4xl leading-[44px] text-nexus-ink">
              Tu campus,
              {'\n'}
              siempre contigo.
            </Text>
            <Text className="mt-5 font-inter-regular text-base leading-6 text-slate-600">
              Accede a Nexus para explorar la biblioteca, reservar espacios de coworking y
              continuar tu experiencia universitaria.
            </Text>
          </View>

          <Animated.View
            className="mt-16 rounded-[28px] border p-5"
            style={{
              opacity: cardOpacity,
              backgroundColor: '#F9F7F2',
              borderColor: '#E8E2D8',
              shadowColor: '#16324F',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 3,
              transform: [{ translateY: cardOffset }],
            }}
          >
            <Text className="font-inter-semibold text-lg text-nexus-ink">Inicia sesión</Text>
            <Text className="mt-2 font-inter-regular text-sm leading-5 text-slate-500">
              Usa tu cuenta de Google institucional para entrar de forma segura.
            </Text>

            <HapticPressable
              className="mt-6 min-h-[56px] flex-row items-center justify-center rounded-2xl bg-nexus-blue px-5 shadow-sm disabled:opacity-60"
              disabled={!isAuth0Ready || isSigningIn}
              hapticStyle="light"
              onPress={handleSignIn}
            >
              {isSigningIn ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={21} color="#FFFFFF" />
                  <Text className="ml-3 font-inter-semibold text-base text-white">
                    {isAuth0Ready ? 'Continuar con Google' : 'Conectando con Auth0...'}
                  </Text>
                </>
              )}
            </HapticPressable>
          </Animated.View>

          {error ? (
            <View className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <Text className="text-center font-inter-semibold text-sm leading-5 text-red-800">
                {error}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="mt-16 items-center">
          <Text className="font-inter-semibold text-xs uppercase tracking-[2px] text-nexus-green">
            Campus Digital · Nexus University
          </Text>
          <Text className="mt-2 text-center font-inter-regular text-xs leading-5 text-slate-500">
            Una experiencia digital para aprender, crear y compartir.
          </Text>
          <Text className="mt-4 font-inter-regular text-xs text-slate-400">
            Versión {APP_VERSION}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
