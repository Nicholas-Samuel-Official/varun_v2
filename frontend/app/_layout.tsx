import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { FontSizeProvider } from '../contexts/FontSizeContext';
import { AIChatbot } from '../components/AIChatbot';

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <FontSizeProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="welcome" />
                <Stack.Screen name="terms" />
                <Stack.Screen name="language" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="auth/signup" />
                <Stack.Screen name="auth/forgot-password" />
                <Stack.Screen name="dashboard" />
                <Stack.Screen name="quick-actions" />
                <Stack.Screen name="feasibility-check" />
                <Stack.Screen name="book-appointment" />
                <Stack.Screen name="iot-sensor" />
                <Stack.Screen name="about-us" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="edit-profile" />
              </Stack>
              {/* AI Chatbot - works on all platforms */}
              <AIChatbot />
            </FontSizeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
