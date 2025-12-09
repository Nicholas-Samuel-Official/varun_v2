import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function EditProfile() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const name = await AsyncStorage.getItem('userName') || '';
      const email = await AsyncStorage.getItem('userEmail') || '';
      const phone = await AsyncStorage.getItem('userPhone') || '';
      setFormData({ name, email, phone });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('userName', formData.name);
      await AsyncStorage.setItem('userEmail', formData.email);
      await AsyncStorage.setItem('userPhone', formData.phone);
      
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
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
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginLeft: 8,
    },
    saveButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    avatarSection: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    changePhotoButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    changePhotoText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    form: {
      paddingTop: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      marginTop: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.card,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('editProfile')}</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : t('save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={48} color={colors.primary} />
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Phone</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone"
              placeholderTextColor={colors.textSecondary}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
