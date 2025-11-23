import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { SideMenu } from '../components/SideMenu';

export default function Dashboard() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const { fontScale } = useFontSize();
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    rainfall: 24,
    weather: 'Partly Cloudy',
    temperature: 28,
    aqi: 67,
    waterSaved: 1250,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1500);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    mascot: {
      width: 50,
      height: 50,
      marginRight: 12,
    },
    headerTextContainer: {
      flex: 1,
    },
    greeting: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    appName: {
      fontSize: 24 * fontScale,
      fontWeight: '700',
      color: colors.text,
    },
    headerIcons: {
      flexDirection: 'row',
      gap: 12,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    heroSection: {
      height: 280,
      overflow: 'hidden',
    },
    backgroundImage: {
      flex: 1,
    },
    heroOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    heroBlur: {
      padding: 24,
      borderRadius: 16,
      overflow: 'hidden',
      alignItems: 'center',
    },
    heroTitle: {
      fontSize: 28 * fontScale,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    heroSubtitle: {
      fontSize: 16 * fontScale,
      color: '#FFFFFF',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    metricsSection: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    metricCard: {
      width: '48%',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    metricLabel: {
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      fontWeight: '600',
      marginLeft: 8,
      flex: 1,
    },
    metricValue: {
      fontSize: 24 * fontScale,
      fontWeight: '700',
      color: colors.text,
    },
    metricUnit: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    quickActionsSection: {
      paddingHorizontal: 20,
      marginTop: 32,
    },
    sectionTitle: {
      fontSize: 18 * fontScale,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    actionCard: {
      width: '48%',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionText: {
      marginTop: 12,
      fontSize: 14 * fontScale,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    iotSection: {
      paddingHorizontal: 20,
      marginTop: 32,
      marginBottom: 24,
    },
    iotCard: {
      backgroundColor: colors.primary + '15',
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    iotHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    iotTitle: {
      fontSize: 18 * fontScale,
      fontWeight: '700',
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    iotStatus: {
      fontSize: 14 * fontScale,
      color: colors.success,
      fontWeight: '600',
    },
    iotDataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iotDataLabel: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
    },
    iotDataValue: {
      fontSize: 14 * fontScale,
      fontWeight: '700',
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/varun_mascot.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.appName}>VARUN</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Hero Section with Background */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={require('../assets/rainwater_background.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.heroOverlay}>
              <BlurView intensity={theme === 'dark' ? 60 : 80} style={styles.heroBlur} tint={theme}>
                <Text style={styles.heroTitle}>VARUN</Text>
                <Text style={styles.heroSubtitle}>
                  Smart Water Recharge &{'\n'}Sustainability Companion
                </Text>
              </BlurView>
            </View>
          </ImageBackground>
        </View>

        {/* Metrics */}
        <View style={styles.metricsSection}>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <MaterialCommunityIcons name="weather-rainy" size={20} color={colors.primary} />
                <Text style={styles.metricLabel}>RAINFALL TODAY</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.metricValue}>{dashboardData.rainfall}</Text>
                <Text style={styles.metricUnit}>mm</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <MaterialCommunityIcons name="weather-partly-cloudy" size={20} color={colors.primary} />
                <Text style={styles.metricLabel}>WEATHER</Text>
              </View>
              <Text style={[styles.metricValue, { fontSize: 16 * fontScale }]}>{dashboardData.weather}</Text>
              <Text style={styles.metricUnit}>{dashboardData.temperature}°C</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <MaterialCommunityIcons name="air-filter" size={20} color={colors.primary} />
                <Text style={styles.metricLabel}>AQI</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.metricValue}>{dashboardData.aqi}</Text>
                <Text style={styles.metricUnit}>Good</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <MaterialCommunityIcons name="water" size={20} color={colors.primary} />
                <Text style={styles.metricLabel}>WATER SAVED</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.metricValue}>{dashboardData.waterSaved}</Text>
                <Text style={styles.metricUnit}>L</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions (4 ML Models) */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/quick-actions')}>
              <MaterialCommunityIcons name="check-decagram" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Feasibility{'\n'}Check</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/quick-actions')}>
              <MaterialCommunityIcons name="water-percent" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Rainwater{'\n'}Estimation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/quick-actions')}>
              <MaterialCommunityIcons name="home-analytics" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Structure{'\n'}Recommendation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/quick-actions')}>
              <MaterialCommunityIcons name="currency-inr" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Cost{'\n'}Estimation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* IoT Sensor Update */}
        <View style={styles.iotSection}>
          <View style={styles.iotCard}>
            <View style={styles.iotHeader}>
              <MaterialCommunityIcons name="radar" size={24} color={colors.primary} />
              <Text style={styles.iotTitle}>IoT Sensor Status</Text>
              <Text style={styles.iotStatus}>● Active</Text>
            </View>
            
            <View style={styles.iotDataRow}>
              <Text style={styles.iotDataLabel}>Rain Intensity</Text>
              <Text style={styles.iotDataValue}>5.2 mm/h</Text>
            </View>
            
            <View style={styles.iotDataRow}>
              <Text style={styles.iotDataLabel}>Tank Level</Text>
              <Text style={styles.iotDataValue}>78%</Text>
            </View>
            
            <View style={[styles.iotDataRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.iotDataLabel}>Infiltration Rate</Text>
              <Text style={styles.iotDataValue}>12.8 L/min</Text>
            </View>

            <TouchableOpacity
              style={{ marginTop: 16, alignItems: 'center' }}
              onPress={() => router.push('/iot-sensor')}
            >
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 * fontScale }}>
                View Details →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
