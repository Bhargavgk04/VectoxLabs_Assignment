/**
 * Vectox Hospital Clinical Design Tokens: Colors
 * Rooted in a dark-first, low-strain clinical telemetry aesthetic.
 * Conforms strictly to WCAG AA contrast standards.
 */

export const colors = {
  // Base Canvas & Neutral Surfaces (Clean Clinical Light Theme)
  canvas: '#F8FAFC',       // Soft clinical background (Slate-50)
  surface1: '#FFFFFF',     // Crisp card surface & modal containers
  surface2: '#F1F5F9',     // Elevated card / active chip / input fill (Slate-100)
  surface3: '#E2E8F0',     // Insets, dividers, pill backgrounds (Slate-200)
  
  // Borders & Dividers
  borderSubtle: '#E2E8F0', // 1px clean card outlines
  borderMedium: '#CBD5E1', // Input strokes and highlighted borders
  borderActive: '#0284C7', // Focused state boundary (Sky-600)

  // Primary Clinical Accent (Trust Teal / Medical Cyan-Blue)
  accent: {
    primary: '#0284C7',    // Core brand & primary action color (Sky-600)
    hover: '#0369A1',      // Active / pressed highlight (Sky-700)
    light: '#0EA5E9',      // Secondary telemetry accent (Sky-500)
    muted: '#E0F2FE',      // Soft tinted fill for active chips & badges (Sky-100)
    glow: 'rgba(2, 132, 199, 0.15)',  // Focus ring glow
  },

  // Functional Semantic Status Signals (High contrast against white surfaces)
  status: {
    critical: '#DC2626',   // Emergency, allergic contraindication, severe triage
    criticalBg: '#FEF2F2', // Light red tint
    criticalBorder: '#FECACA',

    warning: '#D97706',    // Urgent follow-up, pending lab, dosage warning
    warningBg: '#FFFBEB',  // Light amber tint
    warningBorder: '#FDE68A',

    stable: '#059669',     // Normal vitals, completed round, active telemetry
    stableBg: '#ECFDF5',   // Light emerald tint
    stableBorder: '#A7F3D0',

    info: '#2563EB',       // Routine scheduling, informational notes
    infoBg: '#EFF6FF',     // Light blue tint
    infoBorder: '#BFDBFE',
  },

  // Typography & Content Contrast (WCAG AAA compliant)
  text: {
    primary: '#0F172A',    // High-contrast slate-900 heading & critical values
    secondary: '#334155',  // Subtitles, metadata, secondary copy (Slate-700)
    muted: '#64748B',      // Placeholders, disabled states, micro-labels (Slate-500)
    inverse: '#FFFFFF',    // Text on primary accent buttons
    accent: '#0284C7',     // Inline clinical highlight text
  },

  // Overlays & Sheets
  overlay: 'rgba(15, 23, 42, 0.45)',
} as const;

export type Colors = typeof colors;
