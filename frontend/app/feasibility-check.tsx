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

  const handleSubmit = async () => {
    // Validate inputs
    if (!formData.rainfall || !formData.roofArea || !formData.openSpace) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { rainfall, roofArea, openSpace } = formData;
      const apiUrl = `https://server-jr.onrender.com/predict_feasibility_get?rainfall=${rainfall}&roof_area=${roofArea}&open_space=${openSpace}`;
      
      console.log('Calling API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      setResult(data);
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to calculate feasibility. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFeasibilityColor = (status: string) => {
    const lowerStatus = status?.toLowerCase() || '';
    if (lowerStatus.includes('high') || lowerStatus.includes('excellent') || lowerStatus.includes('good')) {
      return '#28a745';
    } else if (lowerStatus.includes('medium') || lowerStatus.includes('moderate')) {
      return '#ffc107';
    } else if (lowerStatus.includes('low') || lowerStatus.includes('poor')) {
      return '#dc3545';
    }
    return colors.textSecondary;
  };

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
    },
    formSection: {
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    infoBox: {
      backgroundColor: colors.primary + '15',
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      marginLeft: 12,
      lineHeight: 20,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    required: {
      color: '#dc3545',
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
    },
    inputHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 6,
      fontStyle: 'italic',
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    resultContainer: {
      marginHorizontal: 20,
      marginTop: 24,
      padding: 24,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    resultHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    resultIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    resultTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    resultItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + '50',
    },
    resultLabel: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    resultValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    statusBadge: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 24,
      alignSelf: 'center',
      marginTop: 20,
    },
    statusText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      textTransform: 'capitalize',
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
