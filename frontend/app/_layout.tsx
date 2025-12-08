import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { FontSizeProvider } from '../contexts/FontSizeContext';
import { AIChatbot } from '../components/AIChatbot';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    // Load Chatling.ai chatbot script for web only
    if (Platform.OS === 'web') {
      const script1 = document.createElement('script');
      script1.innerHTML = `window.chtlConfig = { chatbotId: "4797247687" };`;
      document.body.appendChild(script1);

      const script2 = document.createElement('script');
      script2.async = true;
      script2.setAttribute('data-id', '4797247687');
      script2.id = 'chtl-script';
      script2.src = 'https://chatling.ai/js/embed.js';
      document.body.appendChild(script2);

      return () => {
        if (script1.parentNode) script1.parentNode.removeChild(script1);
        if (script2.parentNode) script2.parentNode.removeChild(script2);
      };
    }
  }, []);

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
