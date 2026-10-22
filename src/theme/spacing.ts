/**
 * Vectox Hospital Clinical Design Tokens: Spacing
 * Built on a strict 8pt base grid with 4pt micro-steps.
 */

export const spacing = {
  xxs: 2,   // Micro alignment / border offsets
  xs: 4,    // Micro spacing (icon-to-text, badge internal)
  sm: 8,    // Tight component gaps
  md: 12,   // Internal compact card padding
  lg: 16,   // Standard mobile screen margin & card padding
  xl: 20,   // Section padding
  xxl: 24,  // Major section separation
  xxxl: 32, // Large vertical gaps
} as const;

export type Spacing = typeof spacing;
