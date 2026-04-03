import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { AuthContext, API_URL } from '../../context/AuthContext';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/DesignSystem';

export default function VerifyScreen() {
  const router = useRouter();
  const { email, userId } = useLocalSearchParams();
  const { login } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        userId: Number(userId),
        otp,
      });

      const { token, user } = response.data;
      Alert.alert("Success", "Email verified successfully!");
      await login(token, user);
    } catch (error: any) {
      const message = error.response?.data?.error || "Verification failed. Please check the code and try again.";
      Alert.alert("Verification Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={Typography.h1}>Verify Email</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: Spacing.sm }]}>
            Enter the 6-digit code sent to {email}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.otpInput}
              placeholder="000 000"
              placeholderTextColor={Colors.textTertiary}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, (loading || otp.length < 6) && styles.buttonDisabled]} 
            onPress={handleVerify}
            disabled={loading || otp.length < 6}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[Typography.button, styles.buttonText]}>Verify Code</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendButton} onPress={() => Alert.alert("Sent", "A new code has been sent to your email.")}>
            <Text style={[Typography.caption, styles.link]}>Resend Verification Code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  otpInput: {
    backgroundColor: '#fff',
    width: '100%',
    padding: Spacing.lg,
    borderRadius: Radius.md,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: Colors.brandPrimary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadows.soft,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
  },
  resendButton: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  link: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
});
