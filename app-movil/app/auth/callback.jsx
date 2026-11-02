import { Redirect } from 'expo-router';
import LoadingScreen from '../../src/components/LoadingScreen';
import { useAuth } from '../../src/context/AuthContext';

export default function AuthCallbackScreen() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <LoadingScreen subtitle="Completando tu inicio de sesión..." />;
}
