import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export interface CardSkeletonProps {
  count?: number;
  type?: 'appointment' | 'doctor' | 'queue';
}

export function CardSkeleton({ count = 3, type = 'appointment' }: CardSkeletonProps): React.JSX.Element {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[styles.card, { opacity: pulseAnim }]}
        >
          {type === 'doctor' ? (
            <View style={styles.doctorRow}>
              <View style={styles.avatarPlaceholder} />
              <View style={styles.doctorContent}>
                <View style={styles.titleLine} />
                <View style={styles.subLine} />
                <View style={styles.badgeLine} />
              </View>
            </View>
          ) : (
            <View style={styles.contentCol}>
              <View style={styles.headerRow}>
                <View style={styles.titleLine} />
                <View style={styles.statusPillPlaceholder} />
              </View>
              <View style={styles.subLine} />
              <View style={styles.detailRowPlaceholder}>
                <View style={styles.detailChipPlaceholder} />
                <View style={styles.detailChipPlaceholder} />
              </View>
            </View>
          )}
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface1,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  contentCol: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleLine: {
    width: '52%',
    height: 16,
    borderRadius: radius.sm,
    backgroundColor: colors.borderSubtle,
  },
  statusPillPlaceholder: {
    width: 78,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.borderSubtle,
  },
  subLine: {
    width: '70%',
    height: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.surface2,
  },
  detailRowPlaceholder: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  detailChipPlaceholder: {
    width: '45%',
    height: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.surface2,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.borderSubtle,
  },
  doctorContent: {
    flex: 1,
    gap: 8,
  },
  badgeLine: {
    width: '35%',
    height: 14,
    borderRadius: radius.full,
    backgroundColor: colors.surface2,
  },
});
