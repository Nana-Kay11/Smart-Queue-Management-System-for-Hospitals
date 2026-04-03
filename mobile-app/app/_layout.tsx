import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { Colors, Typography } from '../constants/DesignSystem';

function RootLayoutNav() {
  const { authToken, user, isLoading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) return;

    const segmentsList = (segments || []) as string[];
    const inAuthGroup = segmentsList[0] === '(auth)';
    const isRoot = segmentsList.length === 0;
    const inUserGroup = segmentsList[0] === '(patient)' || segmentsList[0] === '(staff)';

    if (!authToken && !inAuthGroup && !isRoot) {
      // Not logged in, not on auth, and not on landing? Go to landing.
      router.replace('/');
    } else if (authToken && !inUserGroup) {
      // Logged in, but not in a role-specific folder? Redirect.
      const target = user?.role === 'staff' ? '/(staff)/' : '/(patient)/';
      // Use standard navigation to avoid TS issues with string templating
      router.replace(target as any);
    }
  }, [authToken, segments, isLoading, user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.canvas, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.brandPrimary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.canvas,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            ...Typography.h3,
          },
          contentStyle: {
            backgroundColor: Colors.canvas,
          },
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(patient)" options={{ headerShown: false }} />
        <Stack.Screen name="(staff)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="(auth)/verify" options={{ title: 'Verify', headerBackTitle: 'Back' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
