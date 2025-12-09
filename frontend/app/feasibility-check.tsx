import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import * as Location from 'expo-location';

interface FeasibilityResult {
  feasibility_prediction?: string;
  input?: {
    rainfall: number;
    roof_area: number;
    open_space: number;
  };
  [key: string]: any;
}

interface AquiferResult {
  nearestLocation: string;
  aquiferDepth: number;
  distance: number;
  isFeasible: boolean;
}

interface StructureResult {
  [key: string]: any;
}

interface RechargeResult {
  latitude: number;
  longitude: number;
  groundwater_level_m_bgl: number;
  aquifer: string;
  soil_permeability_class: string;
  recharge_potential: string;
  short_reason: string;
  details: string;
  distance_km: number;
}

export default function FeasibilityCheck() {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [aquiferLoading, setAquiferLoading] = useState(false);
  const [structureLoading, setStructureLoading] = useState(false);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [rainfallLoading, setRainfallLoading] = useState(false);
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  const [aquiferResult, setAquiferResult] = useState<AquiferResult | null>(null);
  const [structureResult, setStructureResult] = useState<StructureResult | null>(null);
  const [rechargeResult, setRechargeResult] = useState<RechargeResult | null>(null);
  const [showAquiferCheck, setShowAquiferCheck] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const [formData, setFormData] = useState({
    rainfall: '',
    roofArea: '',
    openSpace: '',
  });

  // Fetch user location and rainfall on component mount
  useEffect(() => {
    console.log('Feasibility Check: Component mounted, fetching rainfall...');
    fetchUserLocationAndRainfall();
  }, []);

  const fetchUserLocationAndRainfall = async () => {
    console.log('Starting rainfall fetch...');
    setRainfallLoading(true);
    try {
      // Get user's location
      console.log('Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);
      
      if (status !== 'granted') {
        console.log('Permission denied');
        setRainfallLoading(false);
        return;
      }

      console.log('Getting current position...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      console.log('Got location:', latitude, longitude);
      setUserLocation({ latitude, longitude });

      // Fetch annual rainfall from Open-Meteo Climate API
      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1; // Use last year's complete data
      const apiUrl = `https://climate-api.open-meteo.com/v1/climate?latitude=${latitude}&longitude=${longitude}&start_date=${lastYear}-01-01&end_date=${lastYear}-12-31&daily=precipitation_sum&timezone=auto`;
      
      console.log('Fetching rainfall from:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('Climate API response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch rainfall data');
      }

      const data = await response.json();
      console.log('Climate API Response received, has data:', !!data.daily);

      // Calculate total annual rainfall
      if (data.daily && data.daily.precipitation_sum) {
        const totalRainfall = data.daily.precipitation_sum.reduce(
          (sum: number, value: number | null) => sum + (value || 0), 
          0
        );
        const roundedRainfall = Math.round(totalRainfall);
        
        console.log('Calculated annual rainfall:', roundedRainfall, 'mm');
        
        // Auto-populate the rainfall field
        setFormData(prev => ({
          ...prev,
          rainfall: roundedRainfall.toString(),
        }));

        console.log('Rainfall field updated with:', roundedRainfall);
      }
    } catch (error) {
      console.error('Error fetching rainfall:', error);
    } finally {
      setRainfallLoading(false);
      console.log('Rainfall fetch complete');
    }
  };

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

  const handleRechargePotential = async () => {
    if (!userLocation) {
      Alert.alert('Error', 'Location not available. Please enable location services.');
      return;
    }

    setRechargeLoading(true);
    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || '';
      const apiUrl = `${backendUrl}/api/recharge?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`;
      
      console.log('Calling Recharge API:', apiUrl);
      
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const result = await response.json();
      console.log('Recharge API Response:', result);
      
      if (result.success && result.data) {
        setRechargeResult(result.data);
      } else {
        Alert.alert('Error', 'Failed to calculate recharge potential.');
      }
    } catch (error) {
      console.error('Recharge API Error:', error);
      Alert.alert('Error', 'Failed to calculate recharge potential. Please try again.');
    } finally {
      setRechargeLoading(false);
    }
  };

  const handleStructureRecommendation = async () => {
    if (!aquiferResult) {
      Alert.alert('Error', 'Aquifer validation required first.');
      return;
    }

    setStructureLoading(true);
    
    // Calculate structure based on aquifer depth
    const depth = aquiferResult.aquiferDepth;
    let structureType = '';
    let description = '';
    
    if (depth >= 3 && depth <= 10) {
      structureType = 'Recharge Pit';
      description = 'A recharge pit is suitable for shallow to moderate groundwater depths (3-10m). This structure allows surface runoff to percolate into the ground, replenishing the aquifer effectively.';
    } else if (depth > 10) {
      structureType = 'Recharge Shaft';
      description = 'A recharge shaft is recommended for deeper groundwater levels (>10m). This vertical structure penetrates deeper layers, directly recharging the aquifer with filtered rainwater.';
    } else {
      structureType = 'Not Recommended';
      description = 'For very shallow groundwater (<3m), artificial recharge structures are not recommended due to risk of waterlogging and contamination.';
    }

    const calculatedStructure = {
      structure_type: structureType,
      aquifer_depth: depth,
      description: description,
    };

    setStructureResult(calculatedStructure);
    
    // Also fetch recharge potential immediately after structure
    await handleRechargePotential();
    
    setStructureLoading(false);
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
        // Deeper aquifer is better for rainwater harvesting
        // depth >= 3m = feasible, depth < 3m = not feasible
        const isFeasible = nearestLocation.aquiferDepth >= 3;
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
      console.log('Feasibility prediction:', data.feasibility_prediction);
      
      // Check if feasibility_prediction is "No"
      if (data.feasibility_prediction && data.feasibility_prediction.toLowerCase() === 'no') {
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
      
      // If feasibility_prediction is "Yes", show aquifer check button
      if (data.feasibility_prediction && data.feasibility_prediction.toLowerCase() === 'yes') {
        console.log('Setting showAquiferCheck to true');
        setShowAquiferCheck(true);
      } else {
        console.log('Feasibility is not yes, received:', data.feasibility_prediction);
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.formSection}>
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
              <Text style={styles.infoText}>
                Enter your property details to check rainwater harvesting feasibility
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.label}>
                  Annual Rainfall (mm) <Text style={styles.required}>*</Text>
                </Text>
                {rainfallLoading && (
                  <ActivityIndicator size="small" color={colors.primary} />
                )}
              </View>
              <TextInput
                style={styles.input}
                value={formData.rainfall}
                onChangeText={(text) => setFormData({ ...formData, rainfall: text })}
                keyboardType="number-pad"
                placeholder={rainfallLoading ? "Fetching rainfall data..." : "e.g., 800"}
                placeholderTextColor={colors.textSecondary}
                editable={!rainfallLoading}
              />
              <Text style={styles.inputHint}>
                {rainfallLoading 
                  ? "Auto-fetching based on your location..." 
                  : "Automatically fetched from climate data"}
              </Text>
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

              {result.input && (
                <>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Rainfall</Text>
                    <Text style={styles.resultValue}>{result.input.rainfall} mm</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Roof Area</Text>
                    <Text style={styles.resultValue}>{result.input.roof_area} m²</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Open Space</Text>
                    <Text style={styles.resultValue}>{result.input.open_space} m²</Text>
                  </View>
                </>
              )}

              {result.feasibility_prediction && (
                <View 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: getFeasibilityColor(result.feasibility_prediction) }
                  ]}
                >
                  <Text style={styles.statusText}>
                    Prediction: {result.feasibility_prediction}
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
                    ? 'Feasible: Aquifer depth ≥ 3m' 
                    : 'Not Feasible: Aquifer depth < 3m'}
                </Text>
              </View>

              {aquiferResult.isFeasible && !structureResult && (
                <TouchableOpacity
                  style={[styles.submitButton, { marginTop: 20, marginHorizontal: 0 }]}
                  onPress={handleStructureRecommendation}
                  disabled={structureLoading}
                >
                  {structureLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Structure Recommendation</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {structureResult && rechargeResult && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <View style={styles.resultIcon}>
                  <MaterialCommunityIcons 
                    name="home-city" 
                    size={32} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.resultTitle}>Complete Analysis Report</Text>
              </View>

              {/* Structure Recommendation Section */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: colors.primary, marginBottom: 12 }}>
                  Recommended Structure
                </Text>
                
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Structure Type</Text>
                  <Text style={[styles.resultValue, { fontWeight: '700' }]}>
                    {structureResult.structure_type}
                  </Text>
                </View>

                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Based on Depth</Text>
                  <Text style={styles.resultValue}>{structureResult.aquifer_depth} m</Text>
                </View>

                <View style={{ marginTop: 12, padding: 12, backgroundColor: colors.primary + '10', borderRadius: 8 }}>
                  <Text style={{ fontSize: 13, color: colors.text, lineHeight: 20 }}>
                    {structureResult.description}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 20 }} />

              {/* Recharge Potential Section */}
              <View>
                <Text style={{ fontSize: 17, fontWeight: '700', color: colors.primary, marginBottom: 12 }}>
                  Recharge Potential Analysis
                </Text>

                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Groundwater Level</Text>
                  <Text style={styles.resultValue}>{rechargeResult.groundwater_level_m_bgl} m bgl</Text>
                </View>

                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Aquifer Type</Text>
                  <Text style={styles.resultValue}>{rechargeResult.aquifer}</Text>
                </View>

                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Soil Permeability</Text>
                  <Text style={styles.resultValue}>{rechargeResult.soil_permeability_class}</Text>
                </View>

                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Data Point Distance</Text>
                  <Text style={styles.resultValue}>{rechargeResult.distance_km} km</Text>
                </View>

                <View 
                  style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: rechargeResult.recharge_potential === 'Very High' || rechargeResult.recharge_potential === 'High' ? '#28a745' :
                                     rechargeResult.recharge_potential === 'Medium' ? '#ffc107' :
                                     '#dc3545',
                      marginTop: 15
                    }
                  ]}
                >
                  <Text style={styles.statusText}>
                    Recharge Potential: {rechargeResult.recharge_potential}
                  </Text>
                </View>

                <View style={{ marginTop: 15, padding: 15, backgroundColor: colors.card + '80', borderRadius: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                    {rechargeResult.short_reason}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
                    {rechargeResult.details}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
