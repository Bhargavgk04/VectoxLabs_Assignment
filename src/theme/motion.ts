/**
 * Vectox Hospital Clinical Design Tokens: Motion
 * Fast, purposeful transitions respecting clinical urgency and reduced-motion preferences.
 */

export const motion = {
  duration: {
    instant: 100, // Micro state shift
    quick: 200,   // Button tap scale, icon shift
    normal: 300,  // Card fade-in, drawer slide
    deliberate: 500, // Success completion, progress fill
  },
  easing: {
    standard: [0.4, 0.0, 0.2, 1] as const,
    decelerate: [0.0, 0.0, 0.2, 1] as const,
    accelerate: [0.4, 0.0, 1, 1] as const,
  },
  press: {
    activeScale: 0.97,
    activeOpacity: 0.85,
  },
} as const;

export type Motion = typeof motion;
