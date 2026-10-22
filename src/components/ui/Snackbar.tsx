import { useEffect, useRef } from 'react';
import { Text, StyleSheet, Pressable, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface SnackbarProps {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

export function Snackbar({
  visible,
  message,
  actionLabel = 'Undo',
  onAction,
  onDismiss,
  durationMs = 5000,
}: SnackbarProps): React.JSX.Element | null {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();

      timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, durationMs);
    } else {
      slideAnim.setValue(100);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, durationMs, onDismiss, slideAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      {onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.accent.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  message: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.accent.muted,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xs,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionText: {
    ...typography.labelBold,
    color: colors.accent.primary,
    fontSize: 13,
  },
});
