import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { HealthPackage } from '../../../types';
import * as Haptics from 'expo-haptics';

interface PromoHeroBannerProps {
  packageData?: HealthPackage;
  onPress: () => void;
}

export const PromoHeroBanner: React.FC<PromoHeroBannerProps> = ({
  packageData,
  onPress,
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onPress();
  };

  const title = packageData?.title || 'Executive Comprehensive Health Checkup';
  const badgeText = packageData?.badge || 'MOST POPULAR • 40% OFF';
  const subtitle =
    packageData?.subtitle ||
    'Complete whole-body screening including 3T MRI, full cardiac evaluation, and metabolic lab battery.';
  const testsCount = packageData?.includesTestsCount || 68;
  const originalPrice = packageData?.originalPrice || 850;
  const discountedPrice = packageData?.discountedPrice || 499;
  const discountPercent = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <View style={styles.outerContainer} testID="promo-hero-banner">
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          pressed ? styles.cardPressed : null,
        ]}
      >
        {/* Top Accent Stripe */}
        <View style={styles.accentStripe} />

        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Sparkles size={13} color={colors.accent.primary} />
            <Text style={styles.badgeText}>
              {badgeText}
            </Text>
          </View>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {discountPercent}% OFF
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>

        {/* Features row */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <ShieldCheck size={14} color={colors.accent.primary} />
            <Text style={styles.featurePrimaryText}>
              {testsCount}+ Clinical Tests
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureStableText}>
              ● NABL Accredited Lab
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureMutedText}>
              ● Priority Specialist Consult
            </Text>
          </View>
        </View>

        {/* Pricing and CTA */}
        <View style={styles.bottomRow}>
          <View style={styles.priceColumn}>
            <View style={styles.priceRow}>
              <Text style={styles.priceDiscounted}>
                ₹{discountedPrice}
              </Text>
              <Text style={styles.priceOriginal}>
                ₹{originalPrice}
              </Text>
            </View>
            <Text style={styles.perksText} numberOfLines={1}>
              *Gourmet breakfast & lounge included
            </Text>
          </View>

          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>
              Book Package
            </Text>
            <ArrowRight size={14} color={colors.text.inverse} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
  card: {
    backgroundColor: colors.surface1,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    position: 'relative',
    ...elevation.level2,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  accentStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.accent.primary,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.muted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '700',
    fontSize: 10,
    marginLeft: 4,
  },
  discountBadge: {
    backgroundColor: colors.status.stableBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.status.stableBorder,
  },
  discountText: {
    ...typography.caption,
    color: colors.status.stable,
    fontWeight: '700',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.sm,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 6,
    lineHeight: 20,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featurePrimaryText: {
    ...typography.caption,
    color: colors.text.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  featureStableText: {
    ...typography.caption,
    color: colors.status.stable,
    fontWeight: '600',
  },
  featureMutedText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  priceColumn: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceDiscounted: {
    ...typography.h2,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  priceOriginal: {
    ...typography.bodySmall,
    color: colors.text.muted,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  perksText: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 11,
    marginTop: 2,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    flexShrink: 0,
  },
  ctaButtonText: {
    ...typography.labelSmall,
    color: colors.text.inverse,
    fontWeight: '700',
    marginRight: 6,
  },
});
