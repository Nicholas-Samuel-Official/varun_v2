import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, RefreshControl, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { SideMenu } from '../components/SideMenu';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

export default function Dashboard() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const { fontScale } = useFontSize();
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    rainfall: 0,
    weather: 'Loading...',
    temperature: 0,
    aqi: 0,
    aqi_category: 'Loading...',
    humidity: 0,
    wind_speed: 0,
    waterSaved: 1250,
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationAndFetchData();
  }, []);

  const requestLocationAndFetchData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch weather data.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      await fetchWeatherData(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
    }
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      const backendUrl = Constants.expoConfig?.extra?.backendUrl || process.env.EXPO_PUBLIC_BACKEND_URL;
      const response = await fetch(
        `${backendUrl}/api/weather/combined?latitude=${latitude}&longitude=${longitude}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      setDashboardData({
        rainfall: data.weather.rainfall_today || 0,
        weather: data.weather.weather_description || 'Unknown',
        temperature: data.weather.temperature || 0,
        aqi: data.aqi.aqi || 0,
        aqi_category: data.aqi.aqi_category || 'Unknown',
        humidity: data.weather.humidity || 0,
        wind_speed: data.weather.wind_speed || 0,
        waterSaved: 1250,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setDashboardData({
        rainfall: 0,
        weather: 'Data Unavailable',
        temperature: 28,
        aqi: 65,
        aqi_category: 'Moderate',
        humidity: 65,
        wind_speed: 10,
        waterSaved: 1250,
      });
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (location) {
      await fetchWeatherData(location.latitude, location.longitude);
    } else {
      await requestLocationAndFetchData();
    }
    setRefreshing(false);
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#28a745';
    if (aqi <= 100) return '#ffc107';
    if (aqi <= 150) return '#fd7e14';
    if (aqi <= 200) return '#dc3545';
    if (aqi <= 300) return '#6f42c1';
    return '#6c757d';
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
    weatherSection: {
      height: 320,
      overflow: 'hidden',
    },
    backgroundImage: {
      flex: 1,
    },
    weatherOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 24,
    },
    weatherTop: {
      marginBottom: 24,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    locationText: {
      fontSize: 16 * fontScale,
      color: '#FFFFFF',
      marginLeft: 8,
      fontWeight: '600',
    },
    mainTemp: {
      fontSize: 72 * fontScale,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    weatherDesc: {
      fontSize: 24 * fontScale,
      color: '#FFFFFF',
      fontWeight: '500',
      marginBottom: 16,
    },
    weatherDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    weatherDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      marginHorizontal: 6,
      marginBottom: 8,
    },
    weatherDetailText: {
      fontSize: 14 * fontScale,
      color: '#FFFFFF',
      marginLeft: 6,
      fontWeight: '600',
    },
    quickActionsSection: {
      paddingHorizontal: 20,
      marginTop: 24,
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
    waterSavedSection: {
      paddingHorizontal: 20,
      marginTop: 24,
      marginBottom: 24,
    },
    waterSavedCard: {
      backgroundColor: colors.primaryLight + '20',
      padding: 24,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.primary + '30',
      alignItems: 'center',
    },
    waterSavedTitle: {
      fontSize: 16 * fontScale,
      color: colors.textSecondary,
      fontWeight: '600',
      marginBottom: 12,
    },
    waterSavedValue: {
      fontSize: 48 * fontScale,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 8,
    },
    waterSavedUnit: {
      fontSize: 18 * fontScale,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    iotSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    iotCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iotHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    iotTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    iotTitle: {
      fontSize: 18 * fontScale,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    iotSubtitle: {
      fontSize: 13 * fontScale,
      color: colors.textSecondary,
    },
    iotStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    iotStat: {
      alignItems: 'center',
    },
    iotStatValue: {
      fontSize: 20 * fontScale,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 4,
    },
    iotStatLabel: {
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
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
            <Text style={styles.greeting}>Welcome back to</Text>
            <Text style={styles.appName}>VARUN</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/language')}>
            <Ionicons name="language" size={20} color={colors.primary} />
          </TouchableOpacity>
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
        {/* Weather Section with Background Image */}
        <View style={styles.weatherSection}>
          <ImageBackground
            source={require('../assets/background_weather.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.weatherOverlay}>
              <View style={styles.weatherTop}>
                <View style={styles.locationRow}>
                  <Ionicons name="partly-sunny" size={20} color="#FFFFFF" />
                  <Text style={styles.locationText}>Weather Now</Text>
                </View>
                <Text style={styles.mainTemp}>{Math.round(dashboardData.temperature)}°</Text>
                <Text style={styles.weatherDesc}>{dashboardData.weather}</Text>
              </View>

              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetail}>
                  <MaterialCommunityIcons name="water-percent" size={18} color="#FFFFFF" />
                  <Text style={styles.weatherDetailText}>Humidity: {dashboardData.humidity}%</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <MaterialCommunityIcons name="weather-rainy" size={18} color="#FFFFFF" />
                  <Text style={styles.weatherDetailText}>Rain: {dashboardData.rainfall}mm</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <MaterialCommunityIcons name="weather-windy" size={18} color="#FFFFFF" />
                  <Text style={styles.weatherDetailText}>Wind: {dashboardData.wind_speed} km/h</Text>
                </View>
                <View style={[styles.weatherDetail, { backgroundColor: getAQIColor(dashboardData.aqi) + '80' }]}>
                  <MaterialCommunityIcons name="air-filter" size={18} color="#FFFFFF" />
                  <Text style={styles.weatherDetailText}>AQI: {Math.round(dashboardData.aqi)}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Water Saved */}
        <View style={styles.waterSavedSection}>
          <View style={styles.waterSavedCard}>
            <Text style={styles.waterSavedTitle}>Total Water Saved</Text>
            <Text style={styles.waterSavedValue}>{dashboardData.waterSaved.toLocaleString()}</Text>
            <Text style={styles.waterSavedUnit}>Liters</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/feasibility-check')}>
              <MaterialCommunityIcons name="check-decagram" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Feasibility{'\n'}Check</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/book-appointment')}>
              <MaterialCommunityIcons name="calendar-clock" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Book{'\n'}Appointment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/iot-sensor')}>
              <MaterialCommunityIcons name="radar" size={32} color={colors.primary} />
              <Text style={styles.actionText}>IoT{'\n'}Sensors</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* IoT Sensors Box */}
        <View style={styles.iotSection}>
          <TouchableOpacity
            style={styles.iotCard}
            onPress={() => router.push('/iot-sensor')}
            activeOpacity={0.8}
          >
            <View style={styles.iotHeader}>
              <MaterialCommunityIcons name="radar" size={28} color={colors.primary} />
              <View style={styles.iotTextContainer}>
                <Text style={styles.iotTitle}>IoT Sensors</Text>
                <Text style={styles.iotSubtitle}>Real-time monitoring & data</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.iotStats}>
              <View style={styles.iotStat}>
                <Text style={styles.iotStatValue}>6</Text>
                <Text style={styles.iotStatLabel}>Active Sensors</Text>
              </View>
              <View style={styles.iotStat}>
                <Text style={styles.iotStatValue}>Live</Text>
                <Text style={styles.iotStatLabel}>Status</Text>
              </View>
              <View style={styles.iotStat}>
                <Text style={styles.iotStatValue}>24/7</Text>
                <Text style={styles.iotStatLabel}>Monitoring</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
