import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

export default function QuickActions() {
  const router = useRouter();
  const { colors } = useTheme();
  const { fontScale } = useFontSize();

  const quickActions: QuickAction[] = [
    {
      id: 'feasibility',
      title: 'Feasibility Check',
      description: 'Assess if rainwater harvesting is viable for your rooftop',
      icon: 'check-decagram',
      color: '#4CAF50',
      route: '/feasibility-check',
    },
    {
      id: 'estimation',
      title: 'Rainwater Estimation',
      description: 'Calculate potential water harvesting based on rainfall and roof area',
      icon: 'water-percent',
      color: '#2196F3',
      route: '/rainwater-estimation',
    },
    {
      id: 'structure',
      title: 'Structure Recommendation',
      description: 'Get AI-powered recommendations for harvesting system design',
      icon: 'home-analytics',
      color: '#FF9800',
      route: '/structure-recommendation',
    },
    {
      id: 'cost',
      title: 'Cost Estimation',
      description: 'Estimate installation and maintenance costs for your setup',
      icon: 'currency-inr',
      color: '#9C27B0',
      route: '/cost-estimation',
    },
  ];

  const handleActionPress = (action: QuickAction) => {
    // TODO: Navigate to specific action page
    console.log('Action pressed:', action.id);
    alert(`${action.title} feature coming soon!`);
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
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    sectionTitle: {
      fontSize: 16 * fontScale,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      lineHeight: 20 * fontScale,
      marginBottom: 20,
    },
    actionCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 17 * fontScale,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
    },
    actionDescription: {
      fontSize: 13 * fontScale,
      color: colors.textSecondary,
      lineHeight: 18 * fontScale,
    },
    chevron: {
      marginLeft: 8,
    },
    infoBox: {
      backgroundColor: colors.primary + '15',
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoText: {
      flex: 1,
      fontSize: 13 * fontScale,
      color: colors.text,
      marginLeft: 12,
      lineHeight: 18 * fontScale,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Actions</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Select an action below to access AI-powered tools for rainwater harvesting planning and
            analysis.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ML-Powered Tools</Text>
          <Text style={styles.sectionDescription}>
            Our advanced machine learning models help you make data-driven decisions for your
            rainwater harvesting system.
          </Text>

          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleActionPress(action)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                <MaterialCommunityIcons
                  name={action.icon as any}
                  size={32}
                  color={action.color}
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={colors.textSecondary}
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
