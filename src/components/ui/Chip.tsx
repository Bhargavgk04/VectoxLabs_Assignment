import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  count?: number;
  style?: ViewStyle;
}

export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  count,
  style,
}: ChipProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}${count !== undefined ? ` (${count})` : ''}`}
    >
      {icon ? <>{icon}</> : null}
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelUnselected,
          icon ? styles.textWithIcon : undefined,
        ]}
      >
        {label}
      </Text>
      {count !== undefined && (
        <Text style={[styles.count, selected ? styles.countSelected : styles.countUnselected]}>
          {count}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
    minHeight: 38,
  },
  chipUnselected: {
    backgroundColor: colors.surface1,
    borderColor: colors.borderSubtle,
  },
  chipSelected: {
    backgroundColor: colors.accent.muted,
    borderColor: colors.accent.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    ...typography.labelBold,
    fontSize: 12,
  },
  labelUnselected: {
    color: colors.text.secondary,
  },
  labelSelected: {
    color: colors.accent.primary,
  },
  textWithIcon: {
    marginLeft: spacing.xs,
  },
  count: {
    ...typography.caption,
    marginLeft: spacing.xs + 2,
    fontSize: 11,
    fontWeight: '600',
  },
  countUnselected: {
    color: colors.text.muted,
  },
  countSelected: {
    color: colors.accent.primary,
  },
});
