import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function FeasibilityCheck() {
  const router = useRouter();
  const { colors } = useTheme();

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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.content}>
          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              Fill in the details below to check the feasibility of rainwater harvesting for your property.
            </Text>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Latitude</Text>
                <TextInput
                  style={styles.input}
                  value={formData.latitude}
                  onChangeText={(text) => setFormData({...formData, latitude: text})}
                  keyboardType="decimal-pad"
                  placeholder="12.34"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Longitude</Text>
                <TextInput
                  style={styles.input}
                  value={formData.longitude}
                  onChangeText={(text) => setFormData({...formData, longitude: text})}
                  keyboardType="decimal-pad"
                  placeholder="77.56"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>

          {/* Property Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Roof Area (m²) <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.roof_area}
                onChangeText={(text) => setFormData({...formData, roof_area: text})}
                keyboardType="number-pad"
                placeholder="120"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Open Space (m²)</Text>
              <TextInput
                style={styles.input}
                value={formData.open_space}
                onChangeText={(text) => setFormData({...formData, open_space: text})}
                keyboardType="number-pad"
                placeholder="80"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Roof Type</Text>
              <Picker
                selectedValue={formData.roof_type}
                onValueChange={(value) => setFormData({...formData, roof_type: value})}
                style={styles.picker}
              >
                <Picker.Item label="Concrete" value="concrete" />
                <Picker.Item label="Tile" value="tile" />
                <Picker.Item label="Sheet" value="sheet" />
              </Picker>
            </View>
          </View>

          {/* Rainfall Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rainfall Data</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Annual Rainfall (mm) <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.annual_rainfall}
                onChangeText={(text) => setFormData({...formData, annual_rainfall: text})}
                keyboardType="number-pad"
                placeholder="800"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Max Daily Rainfall (mm)</Text>
              <TextInput
                style={styles.input}
                value={formData.max_daily_rainfall}
                onChangeText={(text) => setFormData({...formData, max_daily_rainfall: text})}
                keyboardType="number-pad"
                placeholder="100"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {/* Soil Composition */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soil Composition (%)</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Clay</Text>
                <TextInput
                  style={styles.input}
                  value={formData.clay}
                  onChangeText={(text) => setFormData({...formData, clay: text})}
                  keyboardType="number-pad"
                  placeholder="30"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Sand</Text>
                <TextInput
                  style={styles.input}
                  value={formData.sand}
                  onChangeText={(text) => setFormData({...formData, sand: text})}
                  keyboardType="number-pad"
                  placeholder="50"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Silt</Text>
              <TextInput
                style={styles.input}
                value={formData.silt}
                onChangeText={(text) => setFormData({...formData, silt: text})}
                keyboardType="number-pad"
                placeholder="20"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {/* Additional Parameters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Parameters</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Elevation (m)</Text>
              <TextInput
                style={styles.input}
                value={formData.elevation}
                onChangeText={(text) => setFormData({...formData, elevation: text})}
                keyboardType="number-pad"
                placeholder="500"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Evaporation</Text>
              <TextInput
                style={styles.input}
                value={formData.evaporation}
                onChangeText={(text) => setFormData({...formData, evaporation: text})}
                keyboardType="number-pad"
                placeholder="5"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Calculate Feasibility</Text>
            )}
          </TouchableOpacity>

          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Feasibility Results</Text>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Annual Runoff</Text>
                <Text style={styles.resultValue}>{result.annual_runoff.toLocaleString()} L</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Infiltration</Text>
                <Text style={styles.resultValue}>{result.infiltration.toLocaleString()} L</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Recommended Structure</Text>
                <Text style={styles.resultValue}>{result.recommended_structure}</Text>
              </View>

              <View style={[styles.feasibilityBadge, { backgroundColor: getFeasibilityColor(result.feasibility) }]}>
                <Text style={styles.feasibilityText}>Feasibility: {result.feasibility}</Text>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
