import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFontSize } from '../../contexts/FontSizeContext';

const leaderboardData = [
  { rank: 1, name: 'Rajesh Kumar', liters: 5240, badges: 12 },
  { rank: 2, name: 'Priya Sharma', liters: 4890, badges: 10 },
  { rank: 3, name: 'You', liters: 3650, badges: 8, isCurrentUser: true },
  { rank: 4, name: 'Arun Menon', liters: 3200, badges: 7 },
  { rank: 5, name: 'Lakshmi Iyer', liters: 2980, badges: 6 },
];

const badges = [
  { id: 1, name: 'Water Warrior', icon: 'water', color: '#0055FF', earned: true },
  { id: 2, name: 'First Drop', icon: 'water-check', color: '#00C853', earned: true },
  { id: 3, name: 'Week Streak', icon: 'fire', color: '#FF6D00', earned: true },
  { id: 4, name: '1000L Saved', icon: 'trophy', color: '#FFD600', earned: true },
  { id: 5, name: 'Community Hero', icon: 'account-group', color: '#9C27B0', earned: false },
  { id: 6, name: 'Green Champion', icon: 'leaf', color: '#00C853', earned: false },
];

export default function Community() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { fontScale } = useFontSize();
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'badges'>('leaderboard');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24 * fontScale,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 14,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 14 * fontScale,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    statsCard: {
      backgroundColor: colors.card,
      marginHorizontal: 20,
      marginTop: 20,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statsTitle: {
      fontSize: 16 * fontScale,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20 * fontScale,
      fontWeight: '700',
      color: colors.primary,
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      marginTop: 4,
      fontWeight: '600',
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18 * fontScale,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
    },
    leaderboardCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    currentUserCard: {
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    rankBadge: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rankText: {
      fontSize: 16 * fontScale,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    userInfo: {
      flex: 1,
      marginLeft: 12,
    },
    userName: {
      fontSize: 16 * fontScale,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    userStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userLiters: {
      fontSize: 14 * fontScale,
      color: colors.primary,
      marginLeft: 4,
    },
    userBadges: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    youBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    youBadgeText: {
      fontSize: 12 * fontScale,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    badgesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    badgeCard: {
      width: '48%',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    badgeCardLocked: {
      opacity: 0.5,
    },
    badgeIcon: {
      width: 64,
      height: 64,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    badgeName: {
      fontSize: 12 * fontScale,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    badgeNameLocked: {
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Compete and celebrate together</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setSelectedTab('leaderboard')}
        >
          <Text style={[styles.tabText, selectedTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'badges' && styles.activeTab]}
          onPress={() => setSelectedTab('badges')}
        >
          <Text style={[styles.tabText, selectedTab === 'badges' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'leaderboard' ? (
          <>
            {/* Your Stats */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Your Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="trophy" size={28} color={colors.primary} />
                  <Text style={styles.statValue}>#3</Text>
                  <Text style={styles.statLabel}>RANK</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="water" size={28} color={colors.primary} />
                  <Text style={styles.statValue}>3,650L</Text>
                  <Text style={styles.statLabel}>SAVED</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="medal" size={28} color={colors.primary} />
                  <Text style={styles.statValue}>8</Text>
                  <Text style={styles.statLabel}>BADGES</Text>
                </View>
              </View>
            </View>

            {/* Leaderboard */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Water Savers</Text>
              {leaderboardData.map((user) => (
                <View
                  key={user.rank}
                  style={[
                    styles.leaderboardCard,
                    user.isCurrentUser && styles.currentUserCard,
                  ]}
                >
                  <View style={styles.rankBadge}>
                    {user.rank <= 3 ? (
                      <MaterialCommunityIcons
                        name="trophy"
                        size={24}
                        color={user.rank === 1 ? '#FFD700' : user.rank === 2 ? '#C0C0C0' : '#CD7F32'}
                      />
                    ) : (
                      <Text style={styles.rankText}>#{user.rank}</Text>
                    )}
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.userStats}>
                      <MaterialCommunityIcons name="water" size={14} color={colors.primary} />
                      <Text style={styles.userLiters}>{user.liters.toLocaleString()}L</Text>
                      <MaterialCommunityIcons name="medal" size={14} color={colors.textSecondary} style={{ marginLeft: 12 }} />
                      <Text style={styles.userBadges}>{user.badges}</Text>
                    </View>
                  </View>
                  {user.isCurrentUser && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>You</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Badges */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Achievements</Text>
              <View style={styles.badgesGrid}>
                {badges.map((badge) => (
                  <View
                    key={badge.id}
                    style={[
                      styles.badgeCard,
                      !badge.earned && styles.badgeCardLocked,
                    ]}
                  >
                    <View
                      style={[
                        styles.badgeIcon,
                        { backgroundColor: badge.earned ? badge.color + '20' : colors.border },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={badge.icon as any}
                        size={32}
                        color={badge.earned ? badge.color : colors.textSecondary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.badgeName,
                        !badge.earned && styles.badgeNameLocked,
                      ]}
                    >
                      {badge.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
