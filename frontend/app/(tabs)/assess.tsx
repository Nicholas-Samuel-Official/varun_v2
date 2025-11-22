import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function Assess() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roofArea: '',
    rainfall: '',
    groundwaterDepth: '',
    soilType: 'clay',
  });

  const soilTypes = [
    { value: 'clay', label: 'Clay Soil', icon: 'layers' },
    { value: 'sandy', label: 'Sandy Soil', icon: 'waves' },
    { value: 'loamy', label: 'Loamy Soil', icon: 'grain' },
    { value: 'rocky', label: 'Rocky Soil', icon: 'diamond-stone' },
  ];

  const handleSubmit = () => {
    if (!formData.roofArea || !formData.rainfall) {
      alert('Please fill all required fields');
      return;
    }
    // Navigate to results screen
    console.log('Assessment data:', formData);
    alert('Assessment submitted! Results will be displayed.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assess Your Potential</Text>
        <Text style={styles.headerSubtitle}>Get instant feasibility analysis</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <TouchableOpacity style={styles.locationButton}>
            <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#2196F3" />
            <Text style={styles.locationButtonText}>Auto-detect Location</Text>
          </TouchableOpacity>
          <Text style={styles.locationText}>Chennai, Tamil Nadu</Text>
        </View>

        {/* Roof Area */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="ruler-square" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Roof Area (sq ft) *</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter roof area"
            keyboardType="numeric"
            value={formData.roofArea}
            onChangeText={(text) => setFormData({ ...formData, roofArea: text })}
          />
          <TouchableOpacity style={styles.measureButton}>
            <MaterialCommunityIcons name="map" size={16} color="#2196F3" />
            <Text style={styles.measureButtonText}>Measure with Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Annual Rainfall */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="weather-rainy" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Annual Rainfall (mm) *</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Auto-filled from IMD data"
            keyboardType="numeric"
            value={formData.rainfall}
            onChangeText={(text) => setFormData({ ...formData, rainfall: text })}
          />
          <TouchableOpacity style={styles.autoFillButton}>
            <MaterialCommunityIcons name="cloud-download" size={16} color="#4CAF50" />
            <Text style={styles.autoFillButtonText}>Auto-fill IMD Data</Text>
          </TouchableOpacity>
        </View>

        {/* Groundwater Depth */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="water-well" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Groundwater Depth (m)</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter groundwater depth"
            keyboardType="numeric"
            value={formData.groundwaterDepth}
            onChangeText={(text) => setFormData({ ...formData, groundwaterDepth: text })}
          />
          <Text style={styles.helperText}>Optional - will auto-fetch if not provided</Text>
        </View>

        {/* Soil Type */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="terrain" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Soil Type</Text>
          </View>
          <View style={styles.soilGrid}>
            {soilTypes.map((soil) => (
              <TouchableOpacity
                key={soil.value}
                style={[
                  styles.soilCard,
                  formData.soilType === soil.value && styles.soilCardSelected,
                ]}
                onPress={() => setFormData({ ...formData, soilType: soil.value })}
              >
                <MaterialCommunityIcons
                  name={soil.icon as any}
                  size={28}
                  color={formData.soilType === soil.value ? '#2196F3' : '#757575'}
                />
                <Text
                  style={[
                    styles.soilLabel,
                    formData.soilType === soil.value && styles.soilLabelSelected,
                  ]}
                >
                  {soil.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Photo Upload */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="camera" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Upload Site Photos</Text>
          </View>
          <TouchableOpacity style={styles.uploadButton}>
            <MaterialCommunityIcons name="cloud-upload" size={32} color="#757575" />
            <Text style={styles.uploadText}>Tap to upload photos</Text>
            <Text style={styles.uploadSubtext}>Roof, drainage, surrounding area</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Calculate Feasibility</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  locationText: {
    fontSize: 14,
    color: '#424242',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#FAFAFA',
  },
  measureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  measureButtonText: {
    fontSize: 14,
    color: '#2196F3',
  },
  autoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  autoFillButtonText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  helperText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  soilGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  soilCard: {
    width: '48%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  soilCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  soilLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
  soilLabelSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
