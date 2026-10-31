import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ErrorScreen({ onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No se pudo cargar Nexus</Text>
      <Text style={styles.message}>
        Comprueba tu conexión a Internet e inténtalo de nuevo.
      </Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F7F9FB',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: { color: '#173B57', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  message: { color: '#4B5563', fontSize: 15, marginTop: 12, textAlign: 'center' },
  button: {
    backgroundColor: '#173B57',
    borderRadius: 8,
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
