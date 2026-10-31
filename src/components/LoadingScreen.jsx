import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#173B57" />
      <Text style={styles.text}>Cargando Nexus...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F7F9FB',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#173B57',
    fontSize: 16,
    marginTop: 16,
  },
});
