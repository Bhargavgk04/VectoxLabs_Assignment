import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableStateCallbackType,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export type ButtonVariant = 'primary' | 'secondary' | 'critical' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  accessibilityLabel?: string;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  labelStyle,
  accessibilityLabel,
  testID,
}: ButtonProps): React.JSX.Element {
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics not supported on web/simulator
    }
    onPress();
  };

  const getContainerStyle = ({ pressed }: PressableStateCallbackType): (ViewStyle | undefined)[] => {
    const base: ViewStyle = {
      ...styles.base,
      ...styles[`size_${size}`],
      ...styles[`variant_${variant}`],
    };

    const stateStyle: ViewStyle = disabled
      ? { opacity: 0.5 }
      : pressed
      ? { opacity: 0.85, transform: [{ scale: 0.98 }] }
      : {};

    return [base, stateStyle, style];
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...typography.labelBold,
      ...styles[`text_${variant}`],
      ...labelStyle,
    };
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={getContainerStyle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.canvas : colors.accent.primary}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' ? <>{icon}</> : null}
          <Text
            style={[
              getTextStyle(),
              icon && iconPosition === 'left' ? styles.iconLeftText : undefined,
              icon && iconPosition === 'right' ? styles.iconRightText : undefined,
            ]}
          >
            {label}
          </Text>
          {icon && iconPosition === 'right' ? <>{icon}</> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },

  // Sizes (adhering to minimum 44pt touch targets)
  size_sm: {
    height: 36,
    paddingHorizontal: spacing.md,
  },
  size_md: {
    height: 44,
    paddingHorizontal: spacing.lg,
  },
  size_lg: {
    height: 52,
    paddingHorizontal: spacing.xl,
  },

  // Variants
  variant_primary: {
    backgroundColor: colors.accent.primary,
  },
  variant_secondary: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  variant_critical: {
    backgroundColor: colors.status.critical,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },

  // Text Colors
  text_primary: {
    color: colors.canvas,
    fontWeight: '700',
  },
  text_secondary: {
    color: colors.text.primary,
  },
  text_critical: {
    color: '#ffffff',
    fontWeight: '700',
  },
  text_ghost: {
    color: colors.accent.primary,
  },
  text_outline: {
    color: colors.accent.primary,
    fontWeight: '600',
  },

  iconLeftText: {
    marginLeft: spacing.sm,
  },
  iconRightText: {
    marginRight: spacing.sm,
  },
});
