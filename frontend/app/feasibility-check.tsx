import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import * as Location from 'expo-location';

interface FeasibilityResult {
  feasibility_score?: number;
  feasibility_status?: string;
  predicted_runoff?: number;
  recommended_capacity?: number;
  output?: string;
  [key: string]: any;
}

interface AquiferResult {
  nearestLocation: string;
  aquiferDepth: number;
  distance: number;
  isFeasible: boolean;
}

export default function FeasibilityCheck() {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [aquiferLoading, setAquiferLoading] = useState(false);
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  const [aquiferResult, setAquiferResult] = useState<AquiferResult | null>(null);
  const [showAquiferCheck, setShowAquiferCheck] = useState(false);
  
  const [formData, setFormData] = useState({
    rainfall: '',
    roofArea: '',
    openSpace: '',
  });

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleAquiferCheck = async () => {
    setAquiferLoading(true);
    try {
      // Get user's location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for aquifer validation.');
        setAquiferLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userLat = location.coords.latitude;
      const userLon = location.coords.longitude;

      // Load and parse CSV data
      const csvUrl = 'https://customer-assets.emergentagent.com/job_varun-dashboard/artifacts/5u9g2wqe_clean_aquifer_dataset%20%281%29.csv';
      const csvResponse = await fetch(csvUrl);
      const csvText = await csvResponse.text();
      
      const lines = csvText.split('\n').slice(1); // Skip header
      let nearestLocation = null;
      let minDistance = Infinity;

      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(',');
        if (parts.length < 9) continue;

        const lat = parseFloat(parts[5]);
        const lon = parseFloat(parts[6]);
        const aquiferDepth = parseFloat(parts[8]);

        if (isNaN(lat) || isNaN(lon) || isNaN(aquiferDepth)) continue;

        const distance = calculateDistance(userLat, userLon, lat, lon);

        if (distance < minDistance) {
          minDistance = distance;
          nearestLocation = {
            village: parts[4],
            aquiferDepth,
            distance,
            latitude: lat,
            longitude: lon,
          };
        }
      }

      if (nearestLocation) {
        const isFeasible = nearestLocation.aquiferDepth < 3;
        setAquiferResult({
          nearestLocation: nearestLocation.village,
          aquiferDepth: nearestLocation.aquiferDepth,
          distance: nearestLocation.distance,
          isFeasible,
        });
      } else {
        Alert.alert('Error', 'Could not find nearby aquifer data.');
      }
    } catch (error) {
      console.error('Aquifer Check Error:', error);
      Alert.alert('Error', 'Failed to validate aquifer. Please try again.');
    } finally {
      setAquiferLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!formData.rainfall || !formData.roofArea || !formData.openSpace) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    setResult(null);
    setAquiferResult(null);
    setShowAquiferCheck(false);
    
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
      
      // Check if output is "no"
      if (data.output && data.output.toLowerCase() === 'no') {
        Alert.alert(
          'Not Eligible',
          'Your building is not eligible for the feasibility check',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
        return;
      }
      
      setResult(data);
      
      // If output is "yes", show aquifer check button
      if (data.output && data.output.toLowerCase() === 'yes') {
        setShowAquiferCheck(true);
      }
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.content}>
          <View style={styles.formSection}>
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
              <Text style={styles.infoText}>
                Enter your property details to check rainwater harvesting feasibility
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Annual Rainfall (mm) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.rainfall}
                onChangeText={(text) => setFormData({ ...formData, rainfall: text })}
                keyboardType="number-pad"
                placeholder="e.g., 800"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.inputHint}>Average annual rainfall in your area</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Roof Area (m²) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.roofArea}
                onChangeText={(text) => setFormData({ ...formData, roofArea: text })}
                keyboardType="number-pad"
                placeholder="e.g., 120"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.inputHint}>Total roof catchment area</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Open Space (m²) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.openSpace}
                onChangeText={(text) => setFormData({ ...formData, openSpace: text })}
                keyboardType="number-pad"
                placeholder="e.g., 80"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.inputHint}>Available open space for recharge</Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Check Feasibility</Text>
              )}
            </TouchableOpacity>
          </View>

          {result && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <View style={styles.resultIcon}>
                  <MaterialCommunityIcons 
                    name="check-circle" 
                    size={32} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.resultTitle}>Feasibility Results</Text>
              </View>

              {Object.entries(result).map(([key, value], index) => {
                if (key === 'feasibility_status' || key === 'output') {
                  return null; // We'll show these separately
                }
                
                const formattedKey = key
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                const formattedValue = typeof value === 'number' 
                  ? value.toLocaleString()
                  : String(value);

                return (
                  <View key={key} style={styles.resultItem}>
                    <Text style={styles.resultLabel}>{formattedKey}</Text>
                    <Text style={styles.resultValue}>{formattedValue}</Text>
                  </View>
                );
              })}

              {result.feasibility_status && (
                <View 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: getFeasibilityColor(result.feasibility_status) }
                  ]}
                >
                  <Text style={styles.statusText}>
                    Status: {result.feasibility_status}
                  </Text>
                </View>
              )}

              {showAquiferCheck && !aquiferResult && (
                <TouchableOpacity
                  style={[styles.submitButton, { marginTop: 20, marginHorizontal: 0 }]}
                  onPress={handleAquiferCheck}
                  disabled={aquiferLoading}
                >
                  {aquiferLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Continue Aquifer Validating</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {aquiferResult && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <View style={[
                  styles.resultIcon,
                  { backgroundColor: aquiferResult.isFeasible ? '#28a74520' : '#dc354520' }
                ]}>
                  <MaterialCommunityIcons 
                    name={aquiferResult.isFeasible ? 'check-circle' : 'close-circle'} 
                    size={32} 
                    color={aquiferResult.isFeasible ? '#28a745' : '#dc3545'} 
                  />
                </View>
                <Text style={styles.resultTitle}>Aquifer Validation Results</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Nearest Location</Text>
                <Text style={styles.resultValue}>{aquiferResult.nearestLocation}</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Distance</Text>
                <Text style={styles.resultValue}>{aquiferResult.distance.toFixed(2)} km</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Aquifer Depth</Text>
                <Text style={styles.resultValue}>{aquiferResult.aquiferDepth} m</Text>
              </View>

              <View 
                style={[
                  styles.statusBadge, 
                  { backgroundColor: aquiferResult.isFeasible ? '#28a745' : '#dc3545' }
                ]}
              >
                <Text style={styles.statusText}>
                  {aquiferResult.isFeasible 
                    ? 'Feasible: Aquifer depth < 3m' 
                    : 'Not Feasible: Aquifer depth ≥ 3m'}
                </Text>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
