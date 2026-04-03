import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext, API_URL } from '../../context/AuthContext';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function StaffDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [currentPatient, setCurrentPatient] = useState<{ ticket_number: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [servicePoints, setServicePoints] = useState<any[]>([]);
  const [selectedServicePoint, setSelectedServicePoint] = useState<any>(null);

  const fetchServicePoints = async () => {
    try {
      const response = await axios.get(`${API_URL}/queue/service-points`);
      setServicePoints(response.data.servicePoints);
      if (response.data.servicePoints.length > 0) {
        setSelectedServicePoint(response.data.servicePoints[0]);
      }
    } catch (error) {
      console.error('Fetch service points error:', error);
    }
  };

  useEffect(() => {
    fetchServicePoints();
  }, []);

  const handleCallNext = async () => {
    if (!selectedServicePoint) {
      Alert.alert("Selection Required", "Please select a service point first.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/queue/call-next`, {
        service_point_id: selectedServicePoint.id
      });

      if (response.data.ticket) {
        setCurrentPatient(response.data.ticket);
        Alert.alert("Success", `Calling ticket ${response.data.ticket.ticket_number}`);
      } else {
        setCurrentPatient(null);
        Alert.alert("Queue Empty", "There are no more patients waiting in this department.");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to call next patient.";
      Alert.alert("Process Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[Typography.body, { color: Colors.textSecondary }]}>Staff Console,</Text>
          <Text style={Typography.h2}>{user?.name?.split(' ')[0]}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.brandPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[Typography.caption, styles.sectionTitle]}>SERVICE POINT</Text>
        <View style={styles.pickerContainer}>
          {servicePoints.map((sp) => (
            <TouchableOpacity 
              key={sp.id} 
              style={[styles.pickerItem, selectedServicePoint?.id === sp.id && styles.pickerItemActive]}
              onPress={() => setSelectedServicePoint(sp)}
            >
              <Text style={[styles.pickerText, selectedServicePoint?.id === sp.id && styles.pickerTextActive]}>
                {sp.department_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.servingCard}>
          <Text style={[Typography.caption, { color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }]}>NOW SERVING</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={Colors.accentGold} size="large" />
            </View>
          ) : (
            <Text style={styles.servingNumber}>
              {currentPatient ? currentPatient.ticket_number : '----'}
            </Text>
          )}
          <View style={styles.deptBadge}>
            <Text style={styles.deptBadgeText}>{selectedServicePoint?.department_name || 'Select Dept'}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.callBtn, (!selectedServicePoint || loading) && styles.callBtnDisabled]} 
          onPress={handleCallNext}
          disabled={loading || !selectedServicePoint}
        >
          <Ionicons name="megaphone-outline" size={24} color="#fff" />
          <Text style={[Typography.button, styles.callBtnText]}>Call Next Patient</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color={Colors.brandPrimary} />
            <Text style={[Typography.body, { marginLeft: 12, fontWeight: '500' }]}>Queue Management</Text>
          </View>
          <Text style={[Typography.caption, { marginTop: 8, color: Colors.textSecondary }]}>
            Ensure the patient is present before marking them as served. The system logs every call for auditing.
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
    paddingBottom: Spacing.xl,
  },
  iconBtn: {
    backgroundColor: '#fff',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    ...Shadows.soft,
  },
  sectionTitle: {
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
    color: Colors.textTertiary,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.xl,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.round,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
    ...Shadows.soft,
  },
  pickerItemActive: {
    backgroundColor: Colors.brandPrimary,
  },
  pickerText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pickerTextActive: {
    color: '#fff',
  },
  servingCard: {
    backgroundColor: '#34495e',
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.medium,
  },
  servingNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.accentGold,
    letterSpacing: 4,
    marginVertical: Spacing.md,
  },
  loadingContainer: {
    height: 90,
    justifyContent: 'center',
  },
  deptBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  deptBadgeText: {
    ...Typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
  callBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.brandSecondary,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.soft,
  },
  callBtnDisabled: {
    opacity: 0.5,
  },
  callBtnText: {
    color: '#fff',
    marginLeft: 12,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: Radius.md,
    marginTop: Spacing.xxl,
    ...Shadows.soft,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
