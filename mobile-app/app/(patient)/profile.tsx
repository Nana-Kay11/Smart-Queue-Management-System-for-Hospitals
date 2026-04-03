import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: logout, style: "destructive" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={Typography.h1}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
          </View>
          <View style={styles.info}>
            <Text style={Typography.h2}>{user?.name}</Text>
            <Text style={[Typography.body, { color: Colors.textSecondary }]}>{user?.email}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{user?.role?.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[Typography.caption, styles.sectionTitle]}>ACCOUNT SETTINGS</Text>
          <TouchableOpacity style={styles.item}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.itemText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.borderLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.itemText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.borderLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[Typography.caption, styles.sectionTitle]}>SUPPORT</Text>
          <TouchableOpacity style={styles.item}>
            <Ionicons name="help-circle-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.itemText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.borderLight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: {
    ...Typography.h1,
    color: '#fff',
  },
  info: {
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(122, 139, 153, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    ...Shadows.soft,
  },
  itemText: {
    ...Typography.body,
    flex: 1,
    marginLeft: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.md,
  },
  logoutText: {
    ...Typography.body,
    color: '#e74c3c',
    fontWeight: '700',
    marginLeft: 8,
  }
});
