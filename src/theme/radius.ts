/**
 * Vectox Hospital Clinical Design Tokens: Radius
 * Controlled geometric curvature tailored for precision clinical UI.
 */

export const radius = {
  none: 0,
  xs: 4,    // Micro badges, status pills
  sm: 6,    // Input fields, small buttons
  md: 8,    // Primary action buttons, standard cards
  lg: 12,   // Prominent hero cards, dialogs
  xl: 16,   // Modal sheets
  xxl: 24,  // Bottom sheets, large dialogs
  full: 9999, // Circular avatars, indicator pills
} as const;

export type Radius = typeof radius;

