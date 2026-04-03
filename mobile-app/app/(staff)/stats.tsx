import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={Typography.h1}>Insights</Text>
        <Text style={[Typography.body, { color: Colors.textSecondary }]}>Daily performance metrics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(39, 174, 96, 0.1)' }]}>
              <Ionicons name="people" size={24} color="#27ae60" />
            </View>
            <Text style={styles.statValue}>124</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Served Today</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(52, 152, 219, 0.1)' }]}>
              <Ionicons name="timer" size={24} color="#3498db" />
            </View>
            <Text style={styles.statValue}>12m</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Avg. Wait Time</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[Typography.caption, styles.sectionTitle]}>PEAK HOURS TODAY</Text>
        </View>
        
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart-outline" size={48} color={Colors.borderLight} />
          <Text style={[Typography.body, { color: Colors.textTertiary, marginTop: Spacing.md }]}>Detailed analytics loading...</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={[Typography.body, { fontWeight: '600' }]}>Performance Note</Text>
          <Text style={[Typography.caption, { marginTop: 4, color: Colors.textSecondary }]}>
            Current throughput is 15% higher than yesterday. Ensure all service points are staffed during the 10AM - 12PM peak.
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
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: '48%',
    alignItems: 'center',
    ...Shadows.medium,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statValue: {
    ...Typography.h2,
    fontSize: 28,
    color: Colors.textPrimary,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textTertiary,
    letterSpacing: 1.5,
  },
  chartPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.soft,
  },
  infoBox: {
    backgroundColor: 'rgba(201, 185, 143, 0.1)',
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accentGold,
  }
});
