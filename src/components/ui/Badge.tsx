import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export type BadgeVariant = 'critical' | 'warning' | 'stable' | 'accent' | 'neutral';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = 'neutral',
  dot = false,
  style,
}: BadgeProps): React.JSX.Element {
  return (
    <View style={[styles.badge, styles[`variant_${variant}`], style]}>
      {dot && <View style={[styles.dot, styles[`dot_${variant}`]]} />}
      <Text style={[styles.label, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  label: {
    ...typography.labelCaps,
    fontSize: 10,
  },

  // Variants
  variant_critical: {
    backgroundColor: colors.status.criticalBg,
    borderColor: colors.status.criticalBorder,
  },
  variant_warning: {
    backgroundColor: colors.status.warningBg,
    borderColor: colors.status.warningBorder,
  },
  variant_stable: {
    backgroundColor: colors.status.stableBg,
    borderColor: colors.status.stableBorder,
  },
  variant_accent: {
    backgroundColor: colors.accent.muted,
    borderColor: colors.accent.primary,
  },
  variant_neutral: {
    backgroundColor: colors.surface2,
    borderColor: colors.borderSubtle,
  },

  // Dot Colors
  dot_critical: { backgroundColor: colors.status.critical },
  dot_warning: { backgroundColor: colors.status.warning },
  dot_stable: { backgroundColor: colors.status.stable },
  dot_accent: { backgroundColor: colors.accent.primary },
  dot_neutral: { backgroundColor: colors.text.muted },

  // Text Colors
  text_critical: { color: colors.status.critical },
  text_warning: { color: colors.status.warning },
  text_stable: { color: colors.status.stable },
  text_accent: { color: colors.accent.primary },
  text_neutral: { color: colors.text.secondary },
});
