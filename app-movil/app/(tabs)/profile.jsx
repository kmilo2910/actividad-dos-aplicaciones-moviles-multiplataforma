import { Link } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { useAuth } from '../../src/context/AuthContext';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function ProfileScreen() {
  const { isAuthenticated, signOut, user } = useAuth();
  const displayName = user?.name || user?.nickname || 'Usuario Nexus';
  const email = user?.email || 'Cuenta Nexus';

  return (
    <SafeAreaView className="flex-1 bg-nexus-cream" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" contentContainerClassName="px-6 pb-10 pt-7">
        <Text className="font-inter-semibold text-xs uppercase tracking-[3px] text-nexus-green">
          Nexus University
        </Text>
        <Text className="mt-4 font-space-semibold text-4xl text-nexus-ink">Tu perfil</Text>
        <Text className="mt-3 font-inter-regular text-base leading-6 text-slate-600">
          Gestiona tu cuenta y mantén tu experiencia Nexus siempre contigo.
        </Text>

        {isAuthenticated ? (
          <>
            <View
              className="mt-8 overflow-hidden rounded-[30px] bg-nexus-blue p-6"
              style={{
                shadowColor: '#17202A',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.14,
                shadowRadius: 16,
                elevation: 4,
              }}
            >
              <View className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-white/10" />
              <View className="flex-row items-center">
                <View className="relative h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-[#DDEBED]">
                  {user?.picture ? (
                    <Image className="h-full w-full" resizeMode="cover" source={{ uri: user.picture }} />
                  ) : (
                    <Text className="font-space-semibold text-2xl text-nexus-blue">
                      {getInitials(displayName)}
                    </Text>
                  )}
                  <View className="absolute bottom-0 right-1 h-4 w-4 rounded-full border-2 border-nexus-blue bg-[#8FD19E]" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="font-inter-semibold text-xs uppercase tracking-[2px] text-[#B9D8C5]">
                    Cuenta activa
                  </Text>
                  <Text className="mt-1 font-space-semibold text-2xl text-white" numberOfLines={2}>
                    {displayName}
                  </Text>
                  <Text className="mt-1 font-inter-regular text-sm text-[#DDEBED]" numberOfLines={1}>
                    {email}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-6 rounded-3xl border border-[#E7E2D9] bg-[#FCFBF8] p-5">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#E9F0F2]">
                  <Ionicons name="shield-checkmark-outline" size={23} color="#245B73" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="font-inter-semibold text-base text-nexus-ink">Sesión segura</Text>
                  <Text className="mt-1 font-inter-regular text-sm leading-5 text-slate-500">
                    Tu cuenta está protegida mediante autenticación de Google.
                  </Text>
                </View>
              </View>
            </View>

            <HapticPressable
              className="mt-8 min-h-[56px] flex-row items-center justify-center rounded-full border border-[#B8C9CE] px-5"
              hapticStyle="light"
              onPress={signOut}
            >
              <Ionicons name="log-out-outline" size={20} color="#245B73" />
              <Text className="ml-3 font-inter-semibold text-base text-nexus-blue">Cerrar sesión</Text>
            </HapticPressable>
          </>
        ) : (
          <View className="mt-8 rounded-[30px] border border-[#E7E2D9] bg-[#FCFBF8] p-6">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#E9F0F2]">
              <Ionicons name="person-outline" size={32} color="#245B73" />
            </View>
            <Text className="mt-5 font-space-semibold text-2xl text-nexus-ink">Entra a tu cuenta</Text>
            <Text className="mt-2 font-inter-regular text-base leading-6 text-slate-600">
              Inicia sesión para consultar tus adquisiciones y gestionar tus reservas.
            </Text>
            <Link href="/login" asChild>
              <HapticPressable className="mt-6 min-h-[56px] items-center justify-center rounded-full bg-nexus-blue px-5">
                <Text className="font-inter-semibold text-white">Iniciar sesión</Text>
              </HapticPressable>
            </Link>
          </View>
        )}

        <Text className="mt-10 text-center font-inter-regular text-xs text-slate-400">
          Nexus Campus Digital · Versión 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
