/**
 * Vectox Hospital Clinical Design Tokens: Elevation
 * Flat architectural layering with subtle border contrast and soft ambient shadows.
 */

import { ViewStyle } from 'react-native';

const level0: ViewStyle = {
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
};

const level1: ViewStyle = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 1,
};

const level2: ViewStyle = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};

const level3: ViewStyle = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 6,
};

export const elevation = {
  0: level0,
  1: level1,
  2: level2,
  3: level3,
  level0,
  level1,
  level2,
  level3,
} as const;

export type Elevation = typeof elevation;

