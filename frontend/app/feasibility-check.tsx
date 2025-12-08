import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface FeasibilityResult {
  feasibility_score?: number;
  feasibility_status?: string;
  predicted_runoff?: number;
  recommended_capacity?: number;
  [key: string]: any;
}

export default function FeasibilityCheck() {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  
  const [formData, setFormData] = useState({
    rainfall: '',
    roofArea: '',
    openSpace: '',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.primary,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    titleSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    icon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 8,
    },
    bulletPoint: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 24,
      paddingLeft: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feasibility Check</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          <View style={styles.icon}>
            <MaterialCommunityIcons name="water-check" size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Rainwater Harvesting Feasibility</Text>
          <Text style={styles.subtitle}>
            Understanding the viability of rainwater harvesting for your property
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            <MaterialCommunityIcons name="information-outline" size={20} color={colors.primary} /> {' '}
            What is Feasibility?
          </Text>
          <Text style={styles.cardText}>
            Feasibility determines whether rainwater harvesting is practical and beneficial for your specific location and property type. It considers factors like rainfall, roof area, soil type, and water requirements.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            <MaterialCommunityIcons name="chart-line" size={20} color={colors.primary} /> {' '}
            Key Factors
          </Text>
          <Text style={styles.bulletPoint}>• Annual rainfall in your region</Text>
          <Text style={styles.bulletPoint}>• Available roof catchment area</Text>
          <Text style={styles.bulletPoint}>• Soil infiltration capacity</Text>
          <Text style={styles.bulletPoint}>• Household water demand</Text>
          <Text style={styles.bulletPoint}>• Available space for storage</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            <MaterialCommunityIcons name="check-decagram" size={20} color={colors.primary} /> {' '}
            Benefits
          </Text>
          <Text style={styles.bulletPoint}>• Reduces water bills by 30-50%</Text>
          <Text style={styles.bulletPoint}>• Sustainable water source</Text>
          <Text style={styles.bulletPoint}>• Recharges groundwater table</Text>
          <Text style={styles.bulletPoint}>• Reduces flood risk during monsoons</Text>
          <Text style={styles.bulletPoint}>• Eco-friendly solution</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            <MaterialCommunityIcons name="hand-coin" size={20} color={colors.primary} /> {' '}
            Typical Costs
          </Text>
          <Text style={styles.bulletPoint}>• Small system (2000L): ₹30,000 - ₹50,000</Text>
          <Text style={styles.bulletPoint}>• Medium system (5000L): ₹80,000 - ₹1,20,000</Text>
          <Text style={styles.bulletPoint}>• Large system (10000L): ₹1,50,000 - ₹2,50,000</Text>
          <Text style={[styles.cardText, { marginTop: 12 }]}>
            ROI typically achieved in 3-5 years through water savings.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            <MaterialCommunityIcons name="chat-question" size={20} color={colors.primary} /> {' '}
            Need Help?
          </Text>
          <Text style={styles.cardText}>
            Use our AI chatbot or book an appointment with our experts for personalized feasibility assessment and implementation guidance.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
