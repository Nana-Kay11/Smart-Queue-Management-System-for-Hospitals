import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Soft Background Gradient */}
      <LinearGradient
        colors={[Colors.canvas, '#fff', Colors.canvas]}
        style={styles.background}
      />

      <View style={styles.content}>
        <View style={styles.heroContainer}>
          <View style={styles.iconWrapper}>
            <Ionicons name="medical" size={64} color={Colors.brandPrimary} />
            <View style={styles.iconAccent} />
          </View>
          
          <Text style={styles.brandTitle}>SmartQueue</Text>
          <Text style={styles.tagline}>Wait elegantly. Serve better.</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={[Typography.body, styles.descriptionText]}>
            The next generation of healthcare management. Experience seamless check-ins and real-time tracking for a stress-free visit.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={[Typography.button, { color: '#fff' }]}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={[Typography.button, { color: Colors.brandPrimary }]}>Sign In to Account</Text>
          </TouchableOpacity>

          <Text style={styles.copyright}>© 2026 SmartQueue Healthcare Systems</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingTop: height * 0.15,
    paddingBottom: Spacing.xl,
  },
  heroContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: Radius.round,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
    marginBottom: Spacing.xl,
  },
  iconAccent: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accentGold,
    borderWidth: 4,
    borderColor: '#fff',
  },
  brandTitle: {
    ...Typography.h1,
    fontSize: 42,
    color: Colors.brandPrimary,
    letterSpacing: -1,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  descriptionContainer: {
    paddingHorizontal: Spacing.lg,
  },
  descriptionText: {
    textAlign: 'center',
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: Colors.brandPrimary,
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    ...Shadows.soft,
    marginBottom: Spacing.md,
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.brandPrimary,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  copyright: {
    ...Typography.caption,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
  }
});
