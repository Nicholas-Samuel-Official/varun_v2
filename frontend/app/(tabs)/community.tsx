import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const leaderboardData = [
  { rank: 1, name: 'Rajesh Kumar', liters: 5240, badges: 12, avatar: '👨' },
  { rank: 2, name: 'Priya Sharma', liters: 4890, badges: 10, avatar: '👩' },
  { rank: 3, name: 'You', liters: 3650, badges: 8, avatar: '🌟', isCurrentUser: true },
  { rank: 4, name: 'Arun Menon', liters: 3200, badges: 7, avatar: '👨' },
  { rank: 5, name: 'Lakshmi Iyer', liters: 2980, badges: 6, avatar: '👩' },
];

const badges = [
  { id: 1, name: 'Water Warrior', icon: 'water', color: '#2196F3', earned: true },
  { id: 2, name: 'First Drop', icon: 'water-check', color: '#4CAF50', earned: true },
  { id: 3, name: 'Week Streak', icon: 'fire', color: '#FF9800', earned: true },
  { id: 4, name: '1000L Saved', icon: 'trophy', color: '#FFC107', earned: true },
  { id: 5, name: 'Community Hero', icon: 'account-group', color: '#9C27B0', earned: false },
  { id: 6, name: 'Green Champion', icon: 'leaf', color: '#4CAF50', earned: false },
];

export default function Community() {
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'badges'>('leaderboard');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Compete, save, and celebrate together</Text>
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
            My Badges
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
                  <MaterialCommunityIcons name="trophy" size={32} color="#FF9800" />
                  <Text style={styles.statValue}>#3</Text>
                  <Text style={styles.statLabel}>Rank</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="water" size={32} color="#2196F3" />
                  <Text style={styles.statValue}>3,650L</Text>
                  <Text style={styles.statLabel}>Saved</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="medal" size={32} color="#FFC107" />
                  <Text style={styles.statValue}>8</Text>
                  <Text style={styles.statLabel}>Badges</Text>
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
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.avatar}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.userStats}>
                      <MaterialCommunityIcons name="water" size={14} color="#2196F3" />
                      <Text style={styles.userLiters}>{user.liters.toLocaleString()}L</Text>
                      <MaterialCommunityIcons name="medal" size={14} color="#FFC107" style={{ marginLeft: 12 }} />
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

            {/* Community Impact */}
            <View style={styles.impactCard}>
              <MaterialCommunityIcons name="earth" size={48} color="#4CAF50" />
              <Text style={styles.impactTitle}>Community Impact</Text>
              <Text style={styles.impactValue}>25,460 Liters</Text>
              <Text style={styles.impactText}>Saved this month by your community</Text>
              <Text style={styles.impactSubtext}>≈ 42 tanker lorries avoided</Text>
            </View>
          </>
        ) : (
          <>
            {/* Achievements Summary */}
            <View style={styles.achievementSummary}>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementValue}>8/12</Text>
                <Text style={styles.achievementLabel}>Badges Earned</Text>
              </View>
              <View style={styles.achievementDivider} />
              <View style={styles.achievementItem}>
                <Text style={styles.achievementValue}>450</Text>
                <Text style={styles.achievementLabel}>Total Points</Text>
              </View>
            </View>

            {/* Badges Grid */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Badges</Text>
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
                        { backgroundColor: badge.earned ? badge.color + '20' : '#F5F5F5' },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={badge.icon as any}
                        size={32}
                        color={badge.earned ? badge.color : '#BDBDBD'}
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
                    {badge.earned && (
                      <View style={styles.earnedBadge}>
                        <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Next Milestone */}
            <View style={styles.milestoneCard}>
              <MaterialCommunityIcons name="target" size={32} color="#FF9800" />
              <Text style={styles.milestoneTitle}>Next Milestone</Text>
              <Text style={styles.milestoneText}>Save 350 more liters to unlock</Text>
              <Text style={styles.milestoneBadge}>"Community Hero" badge</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressText}>65% Complete</Text>
            </View>
          </>
        )}

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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  activeTabText: {
    color: '#2196F3',
  },
  content: {
    flex: 1,
  },
  statsCard: {
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
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  rankBadge: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#757575',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLiters: {
    fontSize: 14,
    color: '#2196F3',
    marginLeft: 4,
  },
  userBadges: {
    fontSize: 14,
    color: '#FFC107',
    marginLeft: 4,
  },
  youBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  youBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  impactCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 12,
  },
  impactValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
  impactText: {
    fontSize: 14,
    color: '#424242',
    marginTop: 8,
  },
  impactSubtext: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  achievementSummary: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementItem: {
    flex: 1,
    alignItems: 'center',
  },
  achievementValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  achievementLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  achievementDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#9E9E9E',
  },
  earnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  milestoneCard: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginTop: 12,
  },
  milestoneText: {
    fontSize: 14,
    color: '#424242',
    marginTop: 8,
  },
  milestoneBadge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#FFE0B2',
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9800',
  },
  progressText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
  },
});
