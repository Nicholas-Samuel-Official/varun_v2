import { useEffect } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const ChatbotButton = () => {
  const { colors } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Load Chatling.ai script
      const script = document.createElement('script');
      script.innerHTML = `
        window.chtlConfig = { chatbotId: "4797247687" };
      `;
      document.body.appendChild(script);

      const chatScript = document.createElement('script');
      chatScript.async = true;
      chatScript.setAttribute('data-id', '4797247687');
      chatScript.id = 'chtl-script';
      chatScript.src = 'https://chatling.ai/js/embed.js';
      document.body.appendChild(chatScript);

      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
        if (chatScript.parentNode) chatScript.parentNode.removeChild(chatScript);
      };
    }
  }, []);

  // For mobile, show a custom button with mascot
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
          <Image
            source={require('../assets/varun_mascot.png')}
            style={styles.mascotIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 1000,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
