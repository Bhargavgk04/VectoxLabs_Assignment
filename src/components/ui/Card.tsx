import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  PressableStateCallbackType,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { elevation } from '../../theme/elevation';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'surface1' | 'surface2' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export function Card({
  children,
  onPress,
  variant = 'surface1',
  padding = 'lg',
  style,
  testID,
  accessibilityLabel,
}: CardProps): React.JSX.Element {
  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: 10 };
      case 'md':
        return { padding: 14 };
      case 'lg':
      default:
        return { padding: 18 };
    }
  };

  const baseStyle: ViewStyle = {
    ...styles.base,
    ...styles[variant],
    ...getPaddingStyle(),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }: PressableStateCallbackType) => [
          baseStyle,
          pressed ? styles.pressed : null,
          style,
        ]}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[baseStyle, style]} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  surface1: {
    backgroundColor: colors.surface1,
    borderColor: colors.borderSubtle,
    ...elevation.level1,
  },
  surface2: {
    backgroundColor: colors.surface2,
    borderColor: colors.borderSubtle,
    ...elevation.level2,
  },
  elevated: {
    backgroundColor: colors.surface1,
    borderColor: colors.borderSubtle,
    ...elevation.level3,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.988 }],
    borderColor: colors.accent.primary,
  },
});
