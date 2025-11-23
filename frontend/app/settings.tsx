import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Linking, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useFontSize } from '../contexts/FontSizeContext';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function Settings() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const { language, t } = useLanguage();
  const { fontSize, setFontSize } = useFontSize();
  const [userInfo, setUserInfo] = useState({
    name: 'User',
    email: 'user@example.com',
    phone: '+91 XXXXXXXXXX'
  });

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserInfo({
          name: parsed.name || 'User',
          email: parsed.email || 'user@example.com',
          phone: parsed.phone || '+91 XXXXXXXXXX'
        });
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:9363611181');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:talktoteammomentum@gmail.com');
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    Alert.alert('Location Permission', status === 'granted' ? 'Granted' : 'Denied');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              router.replace('/auth/login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }
        }
      ]
    );
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
    accountSection: {
      marginTop: 0,
      backgroundColor: colors.card,
      paddingVertical: 24,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    accountDetail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    editProfileButton: {
      marginTop: 12,
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    editProfileText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textSecondary,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingContent: {
      flex: 1,
      marginLeft: 12,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    fontSizeButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    fontSizeButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    fontSizeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    fontSizeButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },
    fontSizeButtonTextActive: {
      color: '#FFFFFF',
    },
    contactCard: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    contactText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginLeft: 12,
    },
    logoutButton: {
      marginHorizontal: 20,
      marginTop: 24,
      marginBottom: 32,
      backgroundColor: '#FF3B30',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      marginLeft: 8,
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Account Section */}
        <View style={styles.accountSection}>
          <View style={styles.accountHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(userInfo.name)}</Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{userInfo.name}</Text>
              <Text style={styles.accountDetail}>{userInfo.email}</Text>
              <Text style={styles.accountDetail}>{userInfo.phone}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton} onPress={() => router.push('/edit-profile')}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons
                name={theme === 'dark' ? 'moon-waning-crescent' : 'white-balance-sunny'}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('darkMode')}</Text>
              <Text style={styles.settingSubtitle}>Use dark theme</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="format-size" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('fontSize')}</Text>
              <View style={styles.fontSizeButtons}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.fontSizeButton,
                      fontSize === size && styles.fontSizeButtonActive,
                    ]}
                    onPress={() => setFontSize(size)}
                  >
                    <Text
                      style={[
                        styles.fontSizeButtonText,
                        fontSize === size && styles.fontSizeButtonTextActive,
                      ]}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/language')}
          >
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="translate" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('language')}</Text>
              <Text style={styles.settingSubtitle}>Change app language</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('permissions')}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={requestLocationPermission}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="map-marker" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Location Access</Text>
              <Text style={styles.settingSubtitle}>For accurate data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="camera" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Camera Access</Text>
              <Text style={styles.settingSubtitle}>For site photos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="bell" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>Rain alerts & reminders</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('helpSupport')}</Text>
          
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
              <MaterialCommunityIcons name="phone" size={20} color={colors.primary} />
              <Text style={styles.contactText}>+91 9363611181</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.contactRow, { marginBottom: 0 }]} onPress={handleEmail}>
              <MaterialCommunityIcons name="email" size={20} color={colors.primary} />
              <Text style={styles.contactText}>talktoteammomentum@gmail.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={24} color="#FFFFFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
