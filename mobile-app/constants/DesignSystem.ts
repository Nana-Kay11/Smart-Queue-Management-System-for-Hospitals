import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Colors = {
  // Primary Canvas
  canvas: '#FAF9F6', // Alabaster - Soft luxury off-white
  
  // Brand Accents (Modern Healthcare Blue/Slate)
  brandPrimary: '#7A8B99', // Slate Blue - Professional & Calm
  brandSecondary: '#8D9986', // Sage Green - Soft Medical
  
  // Luxury Touches
  accentGold: '#C9B98F', // Champagne Gold - High-value highlights
  
  // Typography
  textPrimary: '#333333', // Soft Charcoal
  textSecondary: '#666666', // Medium Gray
  textTertiary: '#999999', // Light Gray
  
  // Functional Colors
  error: '#E07A5F', // Muted Terracotta
  success: '#81B29A', // Muted Teal
  
  // Overlays & Borders
  borderLight: 'rgba(51, 51, 51, 0.05)',
  glassBackground: 'rgba(255, 255, 255, 0.7)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Typography = {
  h1: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
    letterSpacing: 0.37,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 34,
    letterSpacing: 0.36,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0.35,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
    color: Colors.textSecondary,
  },
  button: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.41,
  },
};

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
};

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  round: 999,
};

export const Gaps = {
  windowWidth: width,
  windowHeight: height,
};
