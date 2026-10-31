import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebViewContainer from './src/components/WebViewContainer';
import { APP_CONFIG } from './src/config/environment';

export default function App() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <WebViewContainer uri={APP_CONFIG.webAppUrl} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F9FB',
    flex: 1,
  },
});
