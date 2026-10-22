import { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Doctor } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { RemoteImage } from '../../../components/media/RemoteImage';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Star, Clock, Award } from 'lucide-react-native';

export interface DoctorCardProps {
  doctor: Doctor;
  onPressProfile: (doctor: Doctor) => void;
  onPressBook: (doctor: Doctor) => void;
}

export const DoctorCard = memo(function DoctorCard({
  doctor,
  onPressProfile,
  onPressBook,
}: DoctorCardProps): React.JSX.Element {
  const isAvailableToday = doctor.availability === 'Available Today';
  const isOnLeave = doctor.availability === 'On Leave';

  const availabilityLabel =
    doctor.availability === 'Next Available: Tomorrow'
      ? 'Tomorrow'
      : isAvailableToday
      ? 'Available Today'
      : doctor.availability;

  const availabilityVariant = isAvailableToday
    ? 'stable'
    : isOnLeave
    ? 'critical'
    : 'warning';

  return (
    <Card variant="surface1" padding="none" style={styles.card}>
      {/* Doctor Info Pressable */}
      <Pressable
        onPress={() => onPressProfile(doctor)}
        accessibilityRole="button"
        accessibilityLabel={`View profile for ${doctor.name}, ${doctor.specialty}`}
        style={({ pressed }) => [
          styles.topRow,
          pressed ? { opacity: 0.92 } : null,
        ]}
      >
        {/* Doctor Remote Portrait with Loading Shimmer & Fallback */}
        <RemoteImage
          uri={doctor.imageUrl}
          fallbackText={doctor.name}
          width={92}
          height={102}
          borderRadius={12}
          accessibilityLabel={`Portrait of ${doctor.name}`}
        />

        {/* Doctor Metadata */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {doctor.name}
            </Text>
            <View style={styles.feeBadge}>
              <Text style={styles.feeAmount}>₹{doctor.consultationFee}</Text>
            </View>
          </View>

          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <Text style={styles.affiliation} numberOfLines={1}>
            {doctor.hospitalAffiliation}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.ratingBadge}>
              <Star size={12} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingText}>{doctor.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({doctor.reviewCount})</Text>
            </View>

            <View style={styles.expBadge}>
              <Award size={12} color={colors.accent.primary} />
              <Text style={styles.expText}>{doctor.experienceYears}y Exp</Text>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Availability Badge & Booking Action Footer (Isolated click target) */}
      <View style={styles.cardFooter}>
        <View style={styles.badgeWrapper}>
          <Badge label={availabilityLabel} variant={availabilityVariant} dot />
        </View>

        <Button
          label={isOnLeave ? 'Unavailable' : 'Book Consult'}
          onPress={() => onPressBook(doctor)}
          variant={isOnLeave ? 'secondary' : 'primary'}
          size="sm"
          disabled={isOnLeave}
          icon={!isOnLeave ? <Clock size={14} color={colors.canvas} /> : undefined}
          style={styles.bookButton}
        />
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    padding: 16,
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.h3,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  feeBadge: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  feeAmount: {
    ...typography.labelBold,
    color: colors.accent.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  specialty: {
    ...typography.labelBold,
    color: colors.accent.primary,
    fontSize: 13,
    marginTop: 2,
  },
  affiliation: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 11.5,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  ratingText: {
    ...typography.caption,
    color: '#B45309',
    fontWeight: '700',
    marginLeft: 3,
    fontSize: 11,
  },
  reviewCount: {
    ...typography.caption,
    color: '#B45309',
    fontSize: 10,
    marginLeft: 2,
  },
  expBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  expText: {
    ...typography.caption,
    color: '#0369A1',
    marginLeft: 3,
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  badgeWrapper: {
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  bookButton: {
    minWidth: 115,
  },
});
