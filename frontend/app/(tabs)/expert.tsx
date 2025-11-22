import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';

const experts = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    specialization: 'Rainwater Harvesting Expert',
    experience: '15+ years',
    rating: 4.8,
    reviews: 124,
    availability: 'Available',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    specialization: 'Civil Engineer',
    experience: '10+ years',
    rating: 4.9,
    reviews: 89,
    availability: 'Available',
  },
  {
    id: 3,
    name: 'Arun Menon',
    specialization: 'Groundwater Specialist',
    experience: '12+ years',
    rating: 4.7,
    reviews: 156,
    availability: 'Busy',
  },
];

export default function Expert() {
  const [selectedTab, setSelectedTab] = useState<'book' | 'appointments'>('book');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expert Consultation</Text>
        <Text style={styles.headerSubtitle}>Book certified water experts</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'book' && styles.activeTab]}
          onPress={() => setSelectedTab('book')}
        >
          <Text style={[styles.tabText, selectedTab === 'book' && styles.activeTabText]}>
            Book Expert
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'appointments' && styles.activeTab]}
          onPress={() => setSelectedTab('appointments')}
        >
          <Text
            style={[styles.tabText, selectedTab === 'appointments' && styles.activeTabText]}
          >
            My Appointments
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'book' ? (
          <>
            {/* Free Support Banner */}
            <View style={styles.banner}>
              <MaterialCommunityIcons name="gift" size={32} color="#4CAF50" />
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Free Consultation!</Text>
                <Text style={styles.bannerText}>First 3 visits are completely free</Text>
              </View>
            </View>

            {/* Experts List */}
            {experts.map((expert) => (
              <View key={expert.id} style={styles.expertCard}>
                <View style={styles.expertHeader}>
                  <View style={styles.avatar}>
                    <FontAwesome5 name="user-tie" size={24} color="#2196F3" />
                  </View>
                  <View style={styles.expertInfo}>
                    <Text style={styles.expertName}>{expert.name}</Text>
                    <Text style={styles.expertSpec}>{expert.specialization}</Text>
                    <View style={styles.expertMeta}>
                      <MaterialCommunityIcons name="briefcase" size={14} color="#757575" />
                      <Text style={styles.expertMetaText}>{expert.experience}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.availabilityBadge,
                      expert.availability === 'Available'
                        ? styles.availableBadge
                        : styles.busyBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.availabilityText,
                        expert.availability === 'Available'
                          ? styles.availableText
                          : styles.busyText,
                      ]}
                    >
                      {expert.availability}
                    </Text>
                  </View>
                </View>

                <View style={styles.expertFooter}>
                  <View style={styles.rating}>
                    <MaterialCommunityIcons name="star" size={16} color="#FF9800" />
                    <Text style={styles.ratingText}>{expert.rating}</Text>
                    <Text style={styles.reviewsText}>({expert.reviews} reviews)</Text>
                  </View>
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Features */}
            <View style={styles.features}>
              <Text style={styles.featuresTitle}>What You Get:</Text>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>On-site assessment & measurements</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Custom system design</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Cost estimation & ROI analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Installation guidance</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="calendar-blank" size={64} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No Appointments Yet</Text>
            <Text style={styles.emptyText}>Book your first expert consultation</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setSelectedTab('book')}
            >
              <Text style={styles.primaryButtonText}>Book Expert</Text>
            </TouchableOpacity>
          </View>
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
  banner: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bannerContent: {
    marginLeft: 12,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  expertCard: {
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
  expertHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertInfo: {
    flex: 1,
    marginLeft: 12,
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  expertSpec: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  expertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expertMetaText: {
    fontSize: 12,
    color: '#757575',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    height: 24,
  },
  availableBadge: {
    backgroundColor: '#E8F5E9',
  },
  busyBadge: {
    backgroundColor: '#FFEBEE',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#4CAF50',
  },
  busyText: {
    color: '#F44336',
  },
  expertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
  },
  reviewsText: {
    fontSize: 12,
    color: '#757575',
  },
  bookButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  features: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#424242',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
