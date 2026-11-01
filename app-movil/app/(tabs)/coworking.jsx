import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { useAuth } from '../../src/context/AuthContext';
import { useCoworking } from '../../src/hooks/useCoworking';

const colors = ['bg-nexus-blue', 'bg-nexus-green', 'bg-[#A4511F]'];
const durations = [15, 30, 45, 60];

function weekdays() {
  return Array.from({ length: 21 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  }).filter((date) => ![0, 6].includes(date.getDay()));
}

function dateValue(date) {
  return date.toISOString().slice(0, 10);
}

function timeOptions(duration) {
  const maxStart = 20 * 60 - duration;
  return Array.from({ length: Math.floor((maxStart - 8 * 60) / 15) + 1 }, (_, index) => {
    const total = 8 * 60 + index * 15;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  });
}

export default function CoworkingScreen() {
  const { isAuthenticated } = useAuth();
  const { spaces, reservations, isLoading, error, reload, reserve, cancel } = useCoworking(isAuthenticated);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [date, setDate] = useState(dateValue(weekdays()[0]));
  const [time, setTime] = useState('08:00');
  const [duration, setDuration] = useState(60);
  const [isSaving, setIsSaving] = useState(false);
  const options = useMemo(() => timeOptions(duration), [duration]);
  const activeReservation = reservations.find((item) => item.status === 'active');

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  async function handleReserve() {
    if (!selectedSpace) return;
    setIsSaving(true);
    try {
      await reserve({
        spaceId: selectedSpace.id,
        reservationDate: date,
        reservationTime: time,
        durationMinutes: duration,
      });
      setSelectedSpace(null);
      Alert.alert('Reserva confirmada', 'Tu espacio quedó reservado correctamente.');
    } catch (nextError) {
      Alert.alert('No se pudo reservar', nextError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCancel() {
    if (!activeReservation) return;
    setIsSaving(true);
    try {
      await cancel(activeReservation.id);
      Alert.alert('Reserva cancelada', 'La reserva se canceló correctamente.');
    } catch (nextError) {
      Alert.alert('No se pudo cancelar', nextError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-nexus-cream" contentContainerClassName="p-6 pb-10">
      <Text className="mt-10 font-space-semibold text-xs uppercase tracking-[3px] text-nexus-green">Nexus Coworking</Text>
      <Text className="mt-4 font-space-semibold text-4xl leading-tight text-nexus-ink">Tu espacio para crear.</Text>
      <Text className="mt-5 font-inter-regular text-base leading-6 text-slate-600">Encuentra un lugar para estudiar, colaborar y hacer realidad tus próximos proyectos.</Text>

      {activeReservation && (
        <View className="mt-8 rounded-3xl bg-nexus-green p-6">
          <Text className="font-space-semibold text-xl text-white">Tienes una reserva activa</Text>
          <Text className="mt-2 font-inter-regular leading-6 text-white">{activeReservation.spaceName || activeReservation.spaceId}</Text>
          <HapticPressable className="mt-5 rounded-full bg-white px-5 py-4" onPress={handleCancel} disabled={isSaving} hapticStyle="light">
            <Text className="text-center font-inter-semibold text-nexus-green">{isSaving ? 'Procesando...' : 'Cancelar reserva'}</Text>
          </HapticPressable>
        </View>
      )}

      <View className="mt-8 rounded-3xl bg-white p-6">
        <Text className="font-space-semibold text-2xl text-nexus-ink">Espacios disponibles</Text>
        <Text className="mt-2 font-inter-regular leading-6 text-slate-600">Consulta los espacios del campus y reserva el que mejor se adapte a tu jornada.</Text>
      </View>

      {isLoading && <ActivityIndicator className="mt-8" color="#1F4F66" />}
      {error && !isLoading && (
        <View className="mt-6 rounded-3xl bg-white p-6">
          <Text className="font-inter-regular text-slate-600">{error.message}</Text>
          <HapticPressable className="mt-4 rounded-full bg-nexus-blue px-5 py-4" onPress={reload} hapticStyle="light">
            <Text className="text-center font-inter-semibold text-white">Reintentar</Text>
          </HapticPressable>
        </View>
      )}

      {spaces.map((space, index) => {
        const available = space.status === 'available';
        return (
          <View key={space.id} className="mt-5 overflow-hidden rounded-3xl bg-white">
            <View className={`h-3 ${colors[index % colors.length]}`} />
            <View className="p-6">
              <Text className="font-space-semibold text-2xl text-nexus-ink">{space.name}</Text>
              <Text className="mt-2 font-inter-semibold text-sm text-nexus-blue">{space.capacity} puestos · Planta {space.floor}</Text>
              <Text className="mt-4 font-inter-regular leading-6 text-slate-600">{space.shortDescription || space.longDescription}</Text>
              {isAuthenticated ? (
                <HapticPressable className={`mt-6 rounded-full px-5 py-4 ${available ? 'bg-nexus-blue' : 'bg-slate-300'}`} onPress={() => available && setSelectedSpace(space)} disabled={!available} hapticStyle="light">
                  <Text className="text-center font-inter-semibold text-white">{available ? 'Reservar espacio' : 'No disponible'}</Text>
                </HapticPressable>
              ) : (
                <Link href="/login" asChild>
                  <HapticPressable className="mt-6 rounded-full bg-nexus-blue px-5 py-4" hapticStyle="light">
                    <Text className="text-center font-inter-semibold text-white">Iniciar sesión para reservar</Text>
                  </HapticPressable>
                </Link>
              )}
            </View>
          </View>
        );
      })}

      {selectedSpace && (
        <View className="mt-6 rounded-3xl bg-nexus-blue p-6">
          <Text className="font-space-semibold text-2xl text-white">Reservar {selectedSpace.name}</Text>
          <Text className="mt-2 font-inter-regular leading-6 text-white">Selecciona fecha, hora y duración.</Text>
          <Text className="mt-5 font-inter-semibold text-white">Fecha</Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {weekdays().slice(0, 7).map((option) => (
              <HapticPressable key={dateValue(option)} className={`rounded-full px-3 py-2 ${date === dateValue(option) ? 'bg-white' : 'bg-white/20'}`} onPress={() => setDate(dateValue(option))} hapticStyle="light">
                <Text className={date === dateValue(option) ? 'font-inter-semibold text-nexus-blue' : 'font-inter-semibold text-white'}>{option.toLocaleDateString('es-CO', { weekday: 'short', day: '2-digit' })}</Text>
              </HapticPressable>
            ))}
          </View>
          <Text className="mt-5 font-inter-semibold text-white">Hora</Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {options.slice(0, 9).map((option) => (
              <HapticPressable key={option} className={`rounded-full px-3 py-2 ${time === option ? 'bg-white' : 'bg-white/20'}`} onPress={() => setTime(option)} hapticStyle="light">
                <Text className={time === option ? 'font-inter-semibold text-nexus-blue' : 'font-inter-semibold text-white'}>{option}</Text>
              </HapticPressable>
            ))}
          </View>
          <Text className="mt-5 font-inter-semibold text-white">Duración</Text>
          <View className="mt-2 flex-row gap-2">
            {durations.map((option) => (
              <HapticPressable key={option} className={`rounded-full px-3 py-2 ${duration === option ? 'bg-white' : 'bg-white/20'}`} onPress={() => { setDuration(option); setTime('08:00'); }} hapticStyle="light">
                <Text className={duration === option ? 'font-inter-semibold text-nexus-blue' : 'font-inter-semibold text-white'}>{option} min</Text>
              </HapticPressable>
            ))}
          </View>
          <HapticPressable className="mt-6 rounded-full bg-white px-5 py-4" onPress={handleReserve} disabled={isSaving} hapticStyle="light">
            <Text className="text-center font-inter-semibold text-nexus-blue">{isSaving ? 'Procesando...' : 'Confirmar reserva'}</Text>
          </HapticPressable>
          <HapticPressable className="mt-3 px-5 py-3" onPress={() => setSelectedSpace(null)} hapticStyle="light">
            <Text className="text-center font-inter-semibold text-white">Cerrar</Text>
          </HapticPressable>
        </View>
      )}
    </ScrollView>
  );
}
