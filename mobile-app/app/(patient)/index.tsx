import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { AuthContext, API_URL } from '../../context/AuthContext';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Department mapping for icons
const DEPT_ICONS: any = {
  'OPD Consultation': 'flashlight-outline',
  'Pharmacy': 'medical-outline',
  'Laboratory': 'flask-outline',
  'Emergency': 'alert-circle-outline',
  'Radiology': 'scan-outline'
};

export default function PatientDashboard() {
  const { authToken, user, logout } = useContext(AuthContext);
  const [activeTicket, setActiveTicket] = useState<{ department_name: string, ticket_number: string, id: number } | null>(null);
  const [peopleAhead, setPeopleAhead] = useState(0);
  const [loading, setLoading] = useState(true);
  const [servicePoints, setServicePoints] = useState<any[]>([]);
  const [showJoinList, setShowJoinList] = useState(false);

  const fetchStatus = async () => {
    if (!authToken) return;
    try {
      const response = await axios.get(`${API_URL}/queue/status`);
      if (response.data.activeTicket) {
        setActiveTicket(response.data.activeTicket);
        setPeopleAhead(response.data.peopleAhead);
        setShowJoinList(false);
      } else {
        setActiveTicket(null);
        fetchServicePoints();
      }
    } catch (error) {
      console.error('Fetch status error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicePoints = async () => {
    try {
      const response = await axios.get(`${API_URL}/queue/service-points`);
      setServicePoints(response.data.servicePoints);
    } catch (error) {
      console.error('Fetch service points error:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [authToken]);

  const handleJoinQueue = async (servicePointId: number) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/queue/join`, {
        service_point_id: servicePointId
      });
      Alert.alert("Queue Joined", "You have successfully joined the queue.");
      fetchStatus();
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to join queue.";
      Alert.alert("Queue Error", message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !activeTicket && servicePoints.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.brandPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[Typography.body, { color: Colors.textSecondary }]}>Welcome,</Text>
          <Text style={Typography.h2}>{user?.name?.split(' ')[0]}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.brandPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTicket ? (
          <View style={styles.ticketSection}>
            <Text style={[Typography.caption, styles.sectionTitle]}>ACTIVE TICKET</Text>
            <View style={styles.glassCard}>
              <View style={styles.glassHeader}>
                <Ionicons name={DEPT_ICONS[activeTicket.department_name] || 'medical'} size={24} color={Colors.brandPrimary} />
                <Text style={[Typography.body, { fontWeight: '600', marginLeft: Spacing.sm }]}>
                  {activeTicket.department_name}
                </Text>
              </View>
              
              <Text style={styles.ticketNumber}>{activeTicket.ticket_number}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statLine}>
                  <Text style={[Typography.caption, { color: Colors.textSecondary }]}>PEOPLE AHEAD</Text>
                  <Text style={Typography.h3}>{peopleAhead}</Text>
                </View>
                <View style={styles.statLine}>
                  <Text style={[Typography.caption, { color: Colors.textSecondary }]}>EST. WAIT TIME</Text>
                  <Text style={[Typography.h3, { color: Colors.brandPrimary }]}>{peopleAhead * 5} min</Text>
                </View>
              </View>

              <View style={styles.timeline}>
                <View style={[styles.timelineNode, styles.nodeComplete]} />
                <View style={[styles.timelineLine, styles.nodeComplete]} />
                <View style={[styles.timelineNode, styles.nodeActive]} />
                <View style={styles.timelineLine} />
                <View style={styles.timelineNode} />
              </View>
              <View style={styles.timelineLabels}>
                <Text style={Typography.caption}>Joined</Text>
                <Text style={[Typography.caption, { color: Colors.brandPrimary, fontWeight: '700' }]}>Waiting</Text>
                <Text style={Typography.caption}>Serving</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.refreshBtn} onPress={fetchStatus}>
              <Ionicons name="refresh" size={18} color={Colors.textSecondary} />
              <Text style={[Typography.caption, { marginLeft: 4, fontWeight: '600' }]}>REFRESH STATUS</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.joinSection}>
            <Text style={[Typography.caption, styles.sectionTitle]}>SELECT DEPARTMENT</Text>
            <View style={styles.grid}>
              {servicePoints.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.gridItem}
                  onPress={() => handleJoinQueue(item.id)}
                >
                  <View style={styles.gridIcon}>
                    <Ionicons name={DEPT_ICONS[item.department_name] || 'medical'} size={28} color={Colors.brandPrimary} />
                  </View>
                  <Text style={[Typography.caption, styles.gridText]} numberOfLines={1}>
                    {item.department_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.brandPrimary} />
          <Text style={[Typography.caption, { marginLeft: 8, flex: 1 }]}>
            Your position is updated in real-time. Please stay within range of the department.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  iconBtn: {
    backgroundColor: '#fff',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    ...Shadows.soft,
  },
  ticketSection: {
    flex: 1,
  },
  joinSection: {
    flex: 1,
  },
  sectionTitle: {
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
    color: Colors.textTertiary,
  },
  glassCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.medium,
    marginBottom: Spacing.md,
  },
  glassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  ticketNumber: {
    ...Typography.h1,
    fontSize: 56,
    textAlign: 'center',
    color: Colors.brandPrimary,
    letterSpacing: 2,
    marginVertical: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.xl,
  },
  statLine: {
    alignItems: 'center',
    flex: 1,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  timelineNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  nodeComplete: {
    backgroundColor: Colors.brandPrimary,
  },
  nodeActive: {
    backgroundColor: Colors.brandPrimary,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#fff',
    ...Shadows.soft,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#eee',
    marginHorizontal: -2,
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.soft,
  },
  gridIcon: {
    backgroundColor: Colors.canvas,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  gridText: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(122, 139, 153, 0.05)',
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
  }
});
