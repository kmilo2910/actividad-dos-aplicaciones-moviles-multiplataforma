import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAccessToken } from './api';

const ACCESS_TOKEN_KEY = 'nexus.accessToken';

export async function restoreAccessToken() {
  const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  setAccessToken(token);
  return token;
}

export async function saveAccessToken(token) {
  if (!token) {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    setAccessToken(null);
    return;
  }

  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  setAccessToken(token);
}

export async function clearAccessToken() {
  await saveAccessToken(null);
}
