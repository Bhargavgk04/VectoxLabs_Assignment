import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
  viewAllText?: string;
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  subtitle,
  onViewAll,
  viewAllText = 'View All',
  style,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleColumn}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {onViewAll ? (
        <Pressable
          onPress={onViewAll}
          style={({ pressed }) => [styles.viewAllButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${viewAllText} ${title}`}
          hitSlop={8}
        >
          <Text style={styles.viewAllText}>{viewAllText}</Text>
          <ChevronRight size={16} color={colors.accent.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleColumn: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingLeft: spacing.sm,
  },
  viewAllText: {
    ...typography.labelBold,
    color: colors.accent.primary,
    fontSize: 13,
    marginRight: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
