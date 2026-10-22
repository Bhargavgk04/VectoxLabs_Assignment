import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
  Pressable,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface SwipeToConfirmProps {
  onConfirm: () => void;
  label?: string;
  confirmedLabel?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const BUTTON_WIDTH = 50;

export function SwipeToConfirm({
  onConfirm,
  label = 'Slide to Confirm & Sign',
  confirmedLabel = 'Prescription Signed & Transmitted',
  disabled = false,
  style,
}: SwipeToConfirmProps): React.JSX.Element {
  const [containerWidth, setContainerWidth] = useState(300);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const panX = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const maxSwipe = Math.max(containerWidth - BUTTON_WIDTH - 8, 40);
  const maxSwipeRef = useRef(maxSwipe);
  useEffect(() => {
    maxSwipeRef.current = maxSwipe;
  }, [maxSwipe]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !isConfirmed,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          !disabled &&
          !isConfirmed &&
          (Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.vx) > 0.1)
        );
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return (
          !disabled &&
          !isConfirmed &&
          Math.abs(gestureState.dx) > 6 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        panX.stopAnimation();
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          damping: 20,
          stiffness: 300,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        const currentMax = maxSwipeRef.current;
        const clamped = Math.max(0, Math.min(gestureState.dx, currentMax));
        panX.setValue(clamped);
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 20,
          stiffness: 300,
          useNativeDriver: true,
        }).start();

        const currentMax = maxSwipeRef.current;
        // Trigger if passed 58% or high velocity swipe
        if (gestureState.dx > currentMax * 0.58 || gestureState.vx > 0.5) {
          Animated.spring(panX, {
            toValue: currentMax,
            damping: 24,
            stiffness: 280,
            mass: 0.8,
            useNativeDriver: true,
          }).start(() => {
            setIsConfirmed(true);
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch {}
            onConfirm();
          });
        } else {
          // Snap back smoothly with Apple spring physics
          Animated.spring(panX, {
            toValue: 0,
            damping: 24,
            stiffness: 320,
            mass: 0.8,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 20,
          stiffness: 300,
          useNativeDriver: true,
        }).start();
        Animated.spring(panX, {
          toValue: 0,
          damping: 24,
          stiffness: 320,
          mass: 0.8,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  // GPU-accelerated progress fill translation
  const fillTranslateX = panX.interpolate({
    inputRange: [0, Math.max(maxSwipe, 1)],
    outputRange: [-containerWidth, 0],
    extrapolate: 'clamp',
  });

  // Track text fades out as thumb slides across
  const textOpacity = panX.interpolate({
    inputRange: [0, Math.max(maxSwipe * 0.4, 1), Math.max(maxSwipe * 0.75, 2)],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[
        styles.trough,
        isConfirmed && styles.troughConfirmed,
        disabled && styles.troughDisabled,
        style,
      ]}
      onLayout={handleLayout}
      accessibilityRole="button"
      accessibilityLabel={isConfirmed ? confirmedLabel : label}
    >
      {/* GPU Native Animated Active Progress Fill */}
      {!isConfirmed && (
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: containerWidth,
              transform: [{ translateX: fillTranslateX }],
            },
          ]}
        />
      )}

      {/* Background Track Text with Animated Opacity */}
      <Animated.Text
        style={[
          styles.label,
          isConfirmed && styles.labelConfirmed,
          !isConfirmed && { opacity: textOpacity },
        ]}
      >
        {isConfirmed ? confirmedLabel : label}
      </Animated.Text>

      {/* Swipeable Thumb Pill with PanResponder handlers */}
      {!isConfirmed && (
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: panX }, { scale: scaleAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <ChevronRight size={22} color="#FFFFFF" strokeWidth={2.5} />
        </Animated.View>
      )}

      {/* Confirmed Icon */}
      {isConfirmed && (
        <View style={styles.confirmedIcon}>
          <Check size={22} color={colors.status.stable} strokeWidth={2.5} />
        </View>
      )}

      {/* Fallback Tap to Sign for Desktop Web or Mouse Users */}
      {Platform.OS === 'web' && !isConfirmed && (
        <Pressable
          style={styles.webFallbackOverlay}
          onPress={() => {
            Animated.spring(panX, {
              toValue: maxSwipeRef.current,
              damping: 24,
              stiffness: 280,
              useNativeDriver: true,
            }).start(() => {
              setIsConfirmed(true);
              onConfirm();
            });
          }}
          accessibilityLabel="Click to confirm on web"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trough: {
    height: 56,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: radius.full,
    padding: 4,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  troughConfirmed: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  troughDisabled: {
    opacity: 0.5,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.accent.muted,
  },
  label: {
    ...typography.labelBold,
    color: '#475569',
    textAlign: 'center',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  labelConfirmed: {
    color: '#059669',
    fontWeight: '700',
  },
  thumb: {
    position: 'absolute',
    left: 4,
    width: BUTTON_WIDTH,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 5,
  },
  confirmedIcon: {
    position: 'absolute',
    right: spacing.md,
  },
  webFallbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});
