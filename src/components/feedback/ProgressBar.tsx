import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
  style?: ViewStyle;
}

export function ProgressBar({
  completed,
  total,
  label,
  style,
}: ProgressBarProps): React.JSX.Element {
  const percentage = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {label || 'Daily Progress'}
        </Text>
        <Text style={styles.stats}>
          <Text style={styles.statsHighlight}>{completed}</Text> of {total} completed ({percentage}%)
        </Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 16,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  label: {
    ...typography.labelBold,
    color: colors.text.secondary,
    fontSize: 12,
  },
  stats: {
    ...typography.caption,
    color: colors.text.muted,
  },
  statsHighlight: {
    color: colors.accent.primary,
    fontWeight: '700',
  },
  track: {
    height: 7,
    backgroundColor: colors.surface3,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: radius.full,
  },
});
