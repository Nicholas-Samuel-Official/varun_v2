import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useRef } from 'react';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'quick-actions', title: 'Quick Actions', icon: 'flash', route: '/quick-actions' },
  { id: 'book-appointment', title: 'Book Appointment', icon: 'calendar-clock', route: '/book-appointment' },
  { id: 'iot-sensor', title: 'IoT Sensors', icon: 'radar', route: '/iot-sensor' },
  { id: 'chatbot', title: 'Chat with Varun AI', icon: 'robot', route: null },
  { id: 'profile', title: 'Profile', icon: 'account', route: '/edit-profile' },
  { id: 'settings', title: 'Settings', icon: 'cog', route: '/settings' },
  { id: 'about', title: 'About Us', icon: 'information', route: '/about-us' },
];

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleMenuPress = (route: string | null, id: string) => {
    onClose();
    if (route) {
      setTimeout(() => router.push(route as any), 300);
    } else if (id === 'chatbot') {
      // Chatbot will be triggered via global floating button
      console.log('Open chatbot');
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menu: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 280,
      backgroundColor: colors.background,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    header: {
      backgroundColor: colors.primary,
      padding: 24,
      paddingTop: 60,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    menuList: {
      flex: 1,
      paddingTop: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    menuText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>VARUN</Text>
            <Text style={styles.headerSubtitle}>Water Management</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.route, item.id)}
              >
                <View style={styles.menuIcon}>
                  <MaterialCommunityIcons name={item.icon as any} size={22} color={colors.primary} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
