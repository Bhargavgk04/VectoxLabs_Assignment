import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { SearchX, CalendarX2, ClipboardX, FolderX, RefreshCw } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export type EmptyStateType = 'search' | 'calendar' | 'queue' | 'generic';

export interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  type = 'search',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
}: EmptyStateProps): React.JSX.Element {
  const getDefaultIcon = () => {
    switch (type) {
      case 'calendar':
        return <CalendarX2 size={32} color={colors.accent.primary} strokeWidth={1.75} />;
      case 'queue':
        return <ClipboardX size={32} color={colors.accent.primary} strokeWidth={1.75} />;
      case 'generic':
        return <FolderX size={32} color={colors.accent.primary} strokeWidth={1.75} />;
      default:
        return <SearchX size={32} color={colors.accent.primary} strokeWidth={1.75} />;
    }
  };

  return (
    <View style={[styles.container, style]} testID="empty-state-view">
      <View style={styles.ambientGlowBadge}>
        {icon || getDefaultIcon()}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionLabel && onAction ? (
        <View style={styles.actionButtonsCol}>
          <Pressable
            onPress={onAction}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            accessibilityRole="button"
          >
            <RefreshCw size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryBtnText}>{actionLabel}</Text>
          </Pressable>

          {secondaryActionLabel && onSecondaryAction ? (
            <Pressable
              onPress={onSecondaryAction}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && { opacity: 0.7 },
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryBtnText}>{secondaryActionLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  ambientGlowBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 290,
    marginBottom: spacing.md,
  },
  actionButtonsCol: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radius.full,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent.primary,
  },
});
