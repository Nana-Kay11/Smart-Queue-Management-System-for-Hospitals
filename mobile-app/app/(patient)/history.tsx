import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const MOCK_HISTORY = [
  { id: '1', date: '2026-03-28', dept: 'OPD Consultation', ticket: 'OPD-042', status: 'Completed' },
  { id: '2', date: '2026-03-15', dept: 'Pharmacy', ticket: 'PHA-012', status: 'Completed' },
  { id: '3', date: '2026-02-10', dept: 'Radiology', ticket: 'RAD-005', status: 'Completed' },
];

export default function HistoryScreen() {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{item.date}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={[Typography.h3, { marginTop: Spacing.sm }]}>{item.dept}</Text>
      <View style={styles.ticketRow}>
        <Ionicons name="ticket-outline" size={16} color={Colors.brandPrimary} />
        <Text style={styles.ticketText}>{item.ticket}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={Typography.h1}>History</Text>
        <Text style={[Typography.body, { color: Colors.textSecondary }]}>Your past medical visits</Text>
      </View>

      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={Colors.borderLight} />
            <Text style={[Typography.body, { color: Colors.textTertiary, marginTop: Spacing.md }]}>No past visits found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#27ae60',
    textTransform: 'uppercase',
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  ticketText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.brandPrimary,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  }
});
