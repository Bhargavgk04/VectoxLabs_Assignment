import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { elevation } from '../theme/elevation';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();
  const [currentToast, setCurrentToast] = useState<
    (ToastOptions & { id: number }) | null
  >(null);

  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 80,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentToast(null);
    });
  }, [opacity, translateY]);

  const showToast = useCallback(
    ({
      message,
      type = 'info',
      actionLabel,
      onAction,
      durationMs = 4500,
    }: ToastOptions) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      try {
        if (type === 'error' || type === 'warning') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {
        // ignore on unsupported devices
      }

      const id = Date.now();
      setCurrentToast({ id, message, type, actionLabel, onAction, durationMs });

      translateY.setValue(60);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 65,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        hideToast();
      }, durationMs);
    },
    [hideToast, opacity, translateY]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10B981" />;
      case 'warning':
        return <AlertTriangle size={18} color="#F59E0B" />;
      case 'error':
        return <AlertCircle size={18} color="#EF4444" />;
      default:
        return <Info size={18} color={colors.accent.primary} />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '#A7F3D0';
      case 'warning':
        return '#FDE68A';
      case 'error':
        return '#FECACA';
      default:
        return '#BAE6FD';
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '#F0FDF4';
      case 'warning':
        return '#FFFBEB';
      case 'error':
        return '#FEF2F2';
      default:
        return '#F0F9FF';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {currentToast ? (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              bottom: Math.max(insets.bottom + 24, 40),
              transform: [{ translateY }],
              opacity,
              borderColor: getBorderColor(currentToast.type || 'info'),
              backgroundColor: getBgColor(currentToast.type || 'info'),
            },
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.toastContent}>
            <View style={styles.iconWrap}>
              {getIcon(currentToast.type || 'info')}
            </View>
            <Text style={styles.messageText} numberOfLines={2}>
              {currentToast.message}
            </Text>
            {currentToast.actionLabel && currentToast.onAction ? (
              <Pressable
                style={({ pressed }) => [
                  styles.actionBtn,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => {
                  currentToast.onAction?.();
                  hideToast();
                }}
              >
                <Text style={styles.actionBtnText}>
                  {currentToast.actionLabel}
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={hideToast}
              style={styles.closeBtn}
              hitSlop={8}
            >
              <X size={15} color={colors.text.muted} />
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    maxWidth: 520,
    alignSelf: 'center',
    borderRadius: radius.xl,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    zIndex: 99999,
    ...elevation.level3,
    shadowColor: '#0F172A',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 18,
  },
  actionBtn: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    marginLeft: 4,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeBtn: {
    padding: 2,
    marginLeft: 4,
  },
});
