import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', icon: 'globe' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', icon: 'language-hindi' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', icon: 'abjad-hebrew' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', icon: 'abjad-arabic' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', icon: 'abjad-arabic' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', icon: 'abjad-arabic' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', icon: 'abjad-arabic' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', icon: 'abjad-arabic' },
];

export default function LanguageSelection() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('language', selectedLanguage);
      router.push('/onboarding/login');
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.subtitle}>Select your preferred language to continue</Text>
      </View>

      <ScrollView style={styles.languageList}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageCard,
              selectedLanguage === lang.code && styles.selectedCard,
            ]}
            onPress={() => setSelectedLanguage(lang.code)}
          >
            <MaterialCommunityIcons
              name={lang.icon as any}
              size={28}
              color={selectedLanguage === lang.code ? '#2196F3' : '#757575'}
            />
            <View style={styles.languageInfo}>
              <Text
                style={[
                  styles.languageName,
                  selectedLanguage === lang.code && styles.selectedText,
                ]}
              >
                {lang.nativeName}
              </Text>
              <Text style={styles.languageSubtext}>{lang.name}</Text>
            </View>
            {selectedLanguage === lang.code && (
              <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  languageList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  languageInfo: {
    flex: 1,
    marginLeft: 16,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  selectedText: {
    color: '#2196F3',
  },
  languageSubtext: {
    fontSize: 14,
    color: '#757575',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
