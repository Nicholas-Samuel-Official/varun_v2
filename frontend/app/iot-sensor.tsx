import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface SensorData {
  name: string;
  value: string;
  unit: string;
  icon: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export default function IoTSensor() {
  const router = useRouter();
  const { colors } = useTheme();
  const { fontScale } = useFontSize();
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const [sensorData, setSensorData] = useState<SensorData[]>([
    {
      name: 'Rain Intensity',
      value: '5.2',
      unit: 'mm/h',
      icon: 'weather-rainy',
      status: 'good',
      trend: 'up',
    },
    {
      name: 'Tank Level',
      value: '78',
      unit: '%',
      icon: 'water',
      status: 'good',
      trend: 'stable',
    },
    {
      name: 'Infiltration Rate',
      value: '12.8',
      unit: 'L/min',
      icon: 'water-pump',
      status: 'good',
      trend: 'down',
    },
    {
      name: 'Water Quality (pH)',
      value: '7.2',
      unit: 'pH',
      icon: 'test-tube',
      status: 'good',
      trend: 'stable',
    },
    {
      name: 'Flow Rate',
      value: '24.5',
      unit: 'L/min',
      icon: 'water-outline',
      status: 'good',
      trend: 'up',
    },
    {
      name: 'System Pressure',
      value: '2.8',
      unit: 'bar',
      icon: 'gauge',
      status: 'warning',
      trend: 'down',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'critical':
        return '#F44336';
      default:
        return colors.textSecondary;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'stable':
        return 'minus';
      default:
        return 'minus';
    }
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
      fontSize: 20 * fontScale,
      fontWeight: '700',
      color: '#FFFFFF',
      flex: 1,
    },
    content: {
      flex: 1,
    },
    statusCard: {
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 16,
      padding: 20,
      overflow: 'hidden',
    },
    statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    statusTitle: {
      fontSize: 18 * fontScale,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    statusBadgeText: {
      fontSize: 13 * fontScale,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 6,
    },
    statusInfo: {
      fontSize: 14 * fontScale,
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: 20 * fontScale,
    },
    section: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 18 * fontScale,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    sensorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    sensorCard: {
      width: '48%',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sensorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sensorLabel: {
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      fontWeight: '600',
      marginLeft: 8,
      flex: 1,
    },
    sensorValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
    },
    sensorValue: {
      fontSize: 24 * fontScale,
      fontWeight: '700',
      color: colors.text,
    },
    sensorUnit: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    trendIcon: {
      marginLeft: 8,
    },
    alertsSection: {
      paddingHorizontal: 20,
      marginTop: 24,
      marginBottom: 24,
    },
    alertCard: {
      backgroundColor: '#FFF3CD',
      borderLeftWidth: 4,
      borderLeftColor: '#FF9800',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
    },
    alertTitle: {
      fontSize: 14 * fontScale,
      fontWeight: '700',
      color: '#856404',
      marginBottom: 4,
    },
    alertMessage: {
      fontSize: 13 * fontScale,
      color: '#856404',
      lineHeight: 18 * fontScale,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IoT Sensors</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <LinearGradient colors={[colors.primary, '#1976D2']} style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Sensor Status</Text>
            <View style={styles.statusBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color="#FFFFFF" />
              <Text style={styles.statusBadgeText}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
          </View>
          <Text style={styles.statusInfo}>
            All sensors are operational and transmitting data in real-time. Last updated:{' '}
            {new Date().toLocaleTimeString()}
          </Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Sensor Readings</Text>
          <View style={styles.sensorGrid}>
            {sensorData.map((sensor, index) => (
              <View key={index} style={styles.sensorCard}>
                <View style={styles.sensorHeader}>
                  <MaterialCommunityIcons
                    name={sensor.icon as any}
                    size={18}
                    color={getStatusColor(sensor.status)}
                  />
                  <Text style={styles.sensorLabel}>{sensor.name}</Text>
                </View>
                <View style={styles.sensorValueRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={styles.sensorValue}>{sensor.value}</Text>
                    <Text style={styles.sensorUnit}>{sensor.unit}</Text>
                  </View>
                  <Ionicons
                    name={getTrendIcon(sensor.trend) as any}
                    size={20}
                    color={colors.textSecondary}
                    style={styles.trendIcon}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>⚠️ Low Pressure Warning</Text>
            <Text style={styles.alertMessage}>
              System pressure has dropped below optimal levels. Check for possible leaks or
              blockages.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
