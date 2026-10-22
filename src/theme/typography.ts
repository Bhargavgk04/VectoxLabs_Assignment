/**
 * Vectox Hospital Clinical Design Tokens: Typography
 * High-legibility scale adhering to medical telemetry precision.
 */

import { TextStyle } from 'react-native';

export const typography = {
  // Display & Key Metrics
  metricXl: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.8,
  },
  metricLg: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
  },

  // Headlines
  h1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
  },

  // Body text
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  bodySm: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
  },

  // Labels & Chips
  labelBold: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
  },
  labelCaps: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.6,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
  },
  // Aliases for convenience
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
  },
  bodyBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
} as const;

export type Typography = typeof typography;

