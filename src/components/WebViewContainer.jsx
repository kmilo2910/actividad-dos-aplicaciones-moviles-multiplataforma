import { useEffect, useRef, useState } from 'react';
import { BackHandler, Linking, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';

export default function WebViewContainer({ uri }) {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);

  const openDownload = async (event) => {
    const downloadUrl = event.nativeEvent.downloadUrl || event.nativeEvent.url;

    if (!downloadUrl) return;

    try {
      await Linking.openURL(downloadUrl);
    } catch {
      // El WebView mantiene la navegación si el sistema no puede abrir la URL.
    }
  };

  const handleWebMessage = async (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.type !== 'DOWNLOAD_PDF' || !message.data) return;

      const safeFileName = String(message.fileName || 'nexus-documento.pdf')
        .replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileUri = `${FileSystem.cacheDirectory}${safeFileName}`;

      await FileSystem.writeAsStringAsync(fileUri, message.data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: message.mimeType || 'application/pdf',
          dialogTitle: 'Guardar o compartir documento',
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (error) {
      console.warn('No se pudo procesar el PDF recibido desde la web', error);
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      webViewRef.current?.goBack();
      return true;
    });

    return () => subscription.remove();
  }, [canGoBack]);

  if (hasError) {
    return <ErrorScreen onRetry={() => setHasError(false)} />;
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri }}
        startInLoadingState
        renderLoading={() => <LoadingScreen />}
        onError={() => setHasError(true)}
        onHttpError={(event) => {
          if (event.nativeEvent.statusCode >= 500) setHasError(true);
        }}
        onNavigationStateChange={(navigationState) => {
          setCanGoBack(navigationState.canGoBack);
        }}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        javaScriptEnabled
        domStorageEnabled
        onDownloadStart={openDownload}
        onFileDownload={openDownload}
        onMessage={handleWebMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
