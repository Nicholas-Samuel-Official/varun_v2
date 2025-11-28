import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import authService from '../services/authService';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      const termsAccepted = await AsyncStorage.getItem('termsAccepted');
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      setTimeout(() => {
        if (!hasLaunched) {
          router.replace('/welcome');
        } else if (!termsAccepted) {
          router.replace('/terms');
        } else if (isLoggedIn === 'true') {
          router.replace('/dashboard');
        } else {
          router.replace('/auth/login');
        }
      }, 1000);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      router.replace('/welcome');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
