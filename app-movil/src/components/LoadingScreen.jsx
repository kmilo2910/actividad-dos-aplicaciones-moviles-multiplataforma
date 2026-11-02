import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen({ subtitle = 'Preparando tu experiencia', complete = false }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (complete) {
      pulse.setValue(1);
      glow.setValue(1);
      return undefined;
    }

    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [complete, glow, pulse]);

  const haloScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.28] });
  const haloOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0] });
  const logoScale = glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const logoOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });

  return (
    <View style={styles.container}>
      <View style={styles.brandArea}>
        <Animated.View
          style={[styles.halo, { opacity: haloOpacity, transform: [{ scale: haloScale }] }]}
        />
        <Animated.View style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Text style={styles.logoText}>N</Text>
        </Animated.View>
      </View>
      <Text style={styles.title}>NEXUS</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressBar, { opacity: logoOpacity, width: complete ? '100%' : '58%' }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F4F1EB',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  brandArea: {
    alignItems: 'center',
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  halo: {
    backgroundColor: '#B9D8C5',
    borderRadius: 56,
    height: 112,
    position: 'absolute',
    width: 112,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: '#1F4F66',
    borderRadius: 30,
    elevation: 8,
    height: 60,
    justifyContent: 'center',
    shadowColor: '#17202A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    width: 60,
  },
  logoText: {
    color: '#F4F1EB',
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 32,
  },
  title: {
    color: '#17202A',
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 30,
    marginTop: 26,
  },
  subtitle: {
    color: '#64707D',
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    marginTop: 8,
  },
  progressTrack: {
    backgroundColor: '#DDEBED',
    borderRadius: 4,
    height: 4,
    marginTop: 28,
    overflow: 'hidden',
    width: 120,
  },
  progressBar: {
    backgroundColor: '#2F6F4E',
    borderRadius: 4,
    height: '100%',
    width: '58%',
  },
});
