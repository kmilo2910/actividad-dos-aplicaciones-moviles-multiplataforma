import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import HapticPressable from '../../src/components/ui/HapticPressable';
import { APP_CONFIG } from '../../src/config/environment';
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

function resolveSpaceImage(imageUrl) {
  if (!imageUrl) return null;
  return imageUrl.startsWith('http') ? imageUrl : `${APP_CONFIG.apiBaseUrl}${imageUrl}`;
}

export default function CoworkingScreen() {
  const { isAuthenticated } = useAuth();
  const { spaces, reservations, isLoading, error, reload, reserve, cancel } = useCoworking(isAuthenticated);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [pendingCancellation, setPendingCancellation] = useState(null);
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

  function handleReserve() {
    if (!selectedSpace) return;
    setFeedback({
      type: 'confirm',
      action: 'reserve',
      title: 'Confirmar reserva',
      message: `¿Quieres reservar ${selectedSpace.name} para el ${date} a las ${time} durante ${duration} minutos?`,
    });
  }

  async function submitReservation() {
    if (!selectedSpace) return;
    setFeedback(null);
    setIsSaving(true);
    try {
      await reserve({
        spaceId: selectedSpace.id,
        reservationDate: date,
        reservationTime: time,
        durationMinutes: duration,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSelectedSpace(null);
      setFeedback({
        type: 'success',
        title: 'Reserva confirmada',
        message: 'Tu espacio quedó reservado correctamente.',
      });
    } catch (nextError) {
      setFeedback({
        type: 'error',
        title: 'No se pudo reservar',
        message: nextError.message || 'Inténtalo nuevamente en unos segundos.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel(reservation = activeReservation) {
    if (!reservation) return;
    setPendingCancellation(reservation);
    setFeedback({
      type: 'confirm',
      action: 'cancel',
      title: 'Cancelar reserva',
      message: '¿Estás seguro de que quieres cancelar tu reserva activa?',
    });
  }

  async function submitCancellation() {
    const reservation = pendingCancellation || activeReservation;
    if (!reservation) return;
    setFeedback(null);
    setIsSaving(true);
    try {
      await cancel(reservation.id);
      setPendingCancellation(null);
      setFeedback({
        type: 'success',
        title: 'Reserva cancelada',
        message: 'La reserva se canceló correctamente.',
      });
    } catch (nextError) {
      setFeedback({
        type: 'error',
        title: 'No se pudo cancelar',
        message: nextError.message || 'Inténtalo nuevamente en unos segundos.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-nexus-cream" contentContainerClassName="p-6 pb-10">
      <Text className="mt-10 font-space-semibold text-xs uppercase tracking-[3px] text-nexus-green">Nexus Coworking</Text>
      <Text className="mt-4 font-space-semibold text-4xl leading-tight text-nexus-ink">Tu espacio para crear.</Text>
      <Text className="mt-5 font-inter-regular text-base leading-6 text-slate-600">Encuentra un lugar para estudiar, colaborar y hacer realidad tus próximos proyectos.</Text>

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
        const reservationForSpace = reservations.find(
          (reservation) =>
            reservation.status === 'active' &&
            (reservation.spaceId === space.id || reservation.spaceName === space.name),
        );
        const reserved = Boolean(reservationForSpace);
        const imageSource = resolveSpaceImage(space.imageUrl);
        return (
          <View
            key={space.id}
            className="relative mt-5 overflow-hidden rounded-3xl border border-[#E7E2D9] bg-[#FCFBF8]"
            style={{
              shadowColor: '#17202A',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {imageSource ? (
              <Image
                className="absolute inset-0 h-full w-full"
                resizeMode="cover"
                source={{ uri: imageSource }}
                style={{ opacity: 0.13 }}
              />
            ) : null}
            <View className="absolute inset-0 bg-[#FCFBF8]/80" />
            <View className="relative px-6 pt-5">
              <View className="flex-row items-center">
                <View className={`h-1.5 w-14 rounded-full ${colors[index % colors.length]}`} />
                <View className="ml-2 h-px flex-1 bg-[#E7E2D9]" />
              </View>
            </View>
            <View className="relative px-6 pb-6 pt-4">
              <Text className="font-space-semibold text-2xl text-nexus-ink">{space.name}</Text>
              <Text className="mt-2 font-inter-semibold text-sm text-nexus-blue">{space.capacity} puestos · Planta {space.floor}</Text>
              {reserved ? (
                <View className="mt-3 self-start rounded-full bg-[#E7F4EC] px-3 py-1.5">
                  <Text className="font-inter-semibold text-xs uppercase tracking-[1px] text-nexus-green">Reservada</Text>
                </View>
              ) : null}
              <Text className="mt-4 font-inter-regular leading-6 text-slate-600">{space.shortDescription || space.longDescription}</Text>
              <HapticPressable
                className="mt-5 rounded-full border border-nexus-blue bg-white/80 px-5 py-3"
                onPress={() => setSelectedDetail(space)}
                hapticStyle="light"
              >
                <Text className="text-center font-inter-semibold text-nexus-blue">Ver detalle</Text>
              </HapticPressable>
              {reserved ? (
                <HapticPressable className="mt-6 rounded-full bg-[#E7EEF4] px-5 py-4" onPress={() => handleCancel(reservationForSpace)} disabled={isSaving} hapticStyle="light">
                  <Text className="text-center font-inter-semibold text-nexus-blue">{isSaving ? 'Procesando...' : 'Cancelar reserva'}</Text>
                </HapticPressable>
              ) : isAuthenticated ? (
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

      <Modal
        animationType="fade"
        transparent
        visible={Boolean(feedback)}
        onRequestClose={() => setFeedback(null)}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 31, 44, 0.52)',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 360,
              borderRadius: 28,
              backgroundColor: '#F5F1E9',
              paddingHorizontal: 24,
              paddingTop: 28,
              paddingBottom: 24,
            }}
          >
            <View
              className={`h-16 w-16 items-center justify-center self-center rounded-2xl ${
                feedback?.type === 'success'
                  ? 'bg-[#E7F4EC]'
                  : feedback?.type === 'confirm'
                    ? 'bg-[#E7EEF4]'
                    : 'bg-[#FCE9E7]'
              }`}
            >
              <Ionicons
                name={
                  feedback?.type === 'success'
                    ? 'checkmark-circle-outline'
                    : feedback?.type === 'confirm'
                      ? 'help-circle-outline'
                      : 'alert-circle-outline'
                }
                size={34}
                color={
                  feedback?.type === 'success'
                    ? '#237A43'
                    : feedback?.type === 'confirm'
                      ? '#245B73'
                      : '#B5443D'
                }
              />
            </View>
            <Text className="mt-5 text-center font-space-semibold text-2xl text-nexus-ink">
              {feedback?.title}
            </Text>
            <Text className="mt-3 text-center font-inter-regular text-base leading-6 text-slate-600">
              {feedback?.message}
            </Text>
            {feedback?.type === 'confirm' ? (
              <View className="mt-7 flex-row gap-3">
                <HapticPressable
                  className="min-h-[56px] flex-1 items-center justify-center rounded-full border border-[#B8C9CE] px-4"
                  onPress={() => setFeedback(null)}
                >
                  <Text className="font-inter-semibold text-base text-nexus-blue">Cancelar</Text>
                </HapticPressable>
                <HapticPressable
                  className="min-h-[56px] flex-1 items-center justify-center rounded-full bg-nexus-blue px-4"
                  onPress={() => (feedback.action === 'reserve' ? submitReservation() : submitCancellation())}
                >
                  <Text className="text-center font-inter-semibold text-base text-white">Confirmar</Text>
                </HapticPressable>
              </View>
            ) : (
              <HapticPressable
                className="mt-7 min-h-[60px] items-center justify-center rounded-full bg-nexus-blue px-5"
                onPress={() => setFeedback(null)}
              >
                <Text className="font-inter-semibold text-base text-white">Entendido</Text>
              </HapticPressable>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={Boolean(selectedDetail)}
        onRequestClose={() => setSelectedDetail(null)}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 31, 44, 0.5)',
            paddingHorizontal: 24,
          }}
        >
          <View className="w-full max-w-[380px] overflow-hidden rounded-[28px] bg-nexus-cream">
            {selectedDetail?.imageUrl ? (
              <Image
                className="h-40 w-full"
                resizeMode="cover"
                source={{ uri: resolveSpaceImage(selectedDetail.imageUrl) }}
              />
            ) : null}
            <View className="p-6">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-4">
                  <Text className="font-space-semibold text-2xl text-nexus-ink">{selectedDetail?.name}</Text>
                  <Text className="mt-2 font-inter-semibold text-sm text-nexus-blue">
                    {selectedDetail?.capacity} puestos · Planta {selectedDetail?.floor}
                  </Text>
                </View>
                <HapticPressable
                  accessibilityLabel="Cerrar detalle"
                  className="h-10 w-10 items-center justify-center rounded-full bg-[#E9F0F2]"
                  onPress={() => setSelectedDetail(null)}
                >
                  <Ionicons name="close" size={22} color="#245B73" />
                </HapticPressable>
              </View>
              <Text className="mt-5 font-inter-regular text-base leading-6 text-slate-600">
                {selectedDetail?.longDescription || selectedDetail?.shortDescription || 'Espacio disponible para estudiar, colaborar y desarrollar tus proyectos.'}
              </Text>
              <View className="mt-5 rounded-2xl bg-white/70 px-4 py-3">
                <Text className="font-inter-semibold text-sm text-nexus-ink">Estado</Text>
                <Text className={`mt-1 font-inter-regular ${selectedDetail?.status === 'available' ? 'text-nexus-green' : 'text-slate-500'}`}>
                  {selectedDetail?.status === 'available' ? 'Disponible para reservar' : 'No disponible en este momento'}
                </Text>
              </View>
              {selectedDetail?.status === 'available' && isAuthenticated ? (
                <HapticPressable
                  className="mt-5 min-h-[62px] items-center justify-center rounded-full bg-nexus-blue px-5 py-4"
                  style={{ minHeight: 62 }}
                  onPress={() => {
                    setSelectedSpace(selectedDetail);
                    setSelectedDetail(null);
                  }}
                  hapticStyle="light"
                >
                  <Text className="font-inter-semibold text-white">Reservar este espacio</Text>
                </HapticPressable>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={Boolean(selectedSpace)}
        onRequestClose={() => setSelectedSpace(null)}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 31, 44, 0.5)',
            paddingHorizontal: 24,
          }}
        >
          <ScrollView
            className="rounded-[28px] bg-nexus-blue"
            contentContainerClassName="p-6"
            style={{
              width: '92%',
              maxWidth: 360,
              maxHeight: '68%',
              borderRadius: 28,
              overflow: 'hidden',
            }}
          >
          <Text className="font-space-semibold text-2xl text-white">Reservar {selectedSpace?.name}</Text>
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
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}
