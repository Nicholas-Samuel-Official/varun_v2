import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Welcome() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    logoContainer: {
      marginBottom: 48,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    appName: {
      fontSize: 40,
      fontWeight: '700',
      color: colors.text,
      marginTop: 24,
      letterSpacing: -1,
    },
    tagline: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 24,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 48,
      borderRadius: 8,
      marginTop: 64,
      minWidth: 200,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <MaterialCommunityIcons name="water" size={64} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.appName}>VARUN</Text>
        <Text style={styles.tagline}>
          Intelligent Rainwater Harvesting{' \n'}&{' \n'}Recharge Planner
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/language')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
