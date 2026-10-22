import { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { FollowUpQueueItem } from '../../../types';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { Pill, Activity, AlertCircle, ChevronRight, Clock } from 'lucide-react-native';

export interface FollowUpCardProps {
  item: FollowUpQueueItem;
  onPress: (item: FollowUpQueueItem) => void;
  onLongPress: (item: FollowUpQueueItem) => void;
}

export const FollowUpCard = memo(function FollowUpCard({
  item,
  onPress,
  onLongPress,
}: FollowUpCardProps): React.JSX.Element {
  const isUrgent = item.urgency === 'Urgent';
  const isStable = item.urgency === 'Stable';
  const hasAllergies = item.allergies.length > 0;
  const isDone = item.status === 'renewed';

  const handleLongPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
    onLongPress(item);
  };

  const getUrgencyBadge = () => {
    if (isDone) {
      return (
        <View style={[styles.badge, styles.badgeRenewed]}>
          <View style={[styles.badgeDot, { backgroundColor: '#16A34A' }]} />
          <Text style={[styles.badgeText, { color: '#15803D' }]}>Renewed</Text>
        </View>
      );
    }
    if (isUrgent) {
      return (
        <View style={[styles.badge, styles.badgeUrgent]}>
          <View style={[styles.badgeDot, { backgroundColor: '#DC2626' }]} />
          <Text style={[styles.badgeText, { color: '#B45309' }]}>Urgent</Text>
        </View>
      );
    }
    if (isStable) {
      return (
        <View style={[styles.badge, styles.badgeStable]}>
          <View style={[styles.badgeDot, { backgroundColor: '#16A34A' }]} />
          <Text style={[styles.badgeText, { color: '#15803D' }]}>Stable</Text>
        </View>
      );
    }
    return (
      <View style={[styles.badge, styles.badgeRoutine]}>
        <Text style={[styles.badgeText, { color: '#475569' }]}>Routine</Text>
      </View>
    );
  };

  const latestVitals =
    item.vitalsTrend.length > 0
      ? item.vitalsTrend[item.vitalsTrend.length - 1]
      : undefined;

  return (
    <View
      style={[
        styles.card,
        elevation.level1,
        isDone ? styles.cardDone : null,
      ]}
    >
      <Pressable
        onPress={() => onPress(item)}
        onLongPress={handleLongPress}
        delayLongPress={350}
        style={({ pressed }) => [
          styles.pressable,
          {
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Follow-up for ${item.patientName}, urgency ${item.urgency}.`}
      >
        <View style={styles.content}>
          {/* Top Row: Patient Name & Urgency Badge */}
          <View style={styles.topRow}>
            <View style={styles.patientCol}>
              <Text style={styles.patientName} numberOfLines={1}>
                {item.patientName}
                <Text style={styles.meta}> ({item.patientAge}y, {item.patientGender})</Text>
              </Text>
              <Text style={styles.diagnosis} numberOfLines={1}>
                {item.diagnoses.join(' • ')}
              </Text>
            </View>

            <View style={styles.badgesCol}>{getUrgencyBadge()}</View>
          </View>

          {/* Clean Rx Info Row */}
          <View style={styles.rxRow}>
            <View style={styles.rxIconWrap}>
              <Pill size={13} color={colors.accent.primary} />
            </View>
            <View style={styles.rxTextCol}>
              <Text style={styles.medicationName} numberOfLines={1}>
                {item.lastPrescription.medication}
              </Text>
              <Text style={styles.dosageText} numberOfLines={1}>
                {item.draftRenewal
                  ? `${item.draftRenewal.dosage} • ${item.draftRenewal.durationDays}d Draft`
                  : `${item.lastPrescription.dosage} • ${item.lastPrescription.durationDays}d`}
              </Text>
            </View>
          </View>

          {/* Bottom Telemetry Vitals & Last Visit */}
          <View style={styles.footerRow}>
            {latestVitals ? (
              <View style={styles.vitalsPill}>
                <Activity size={11} color="#0284C7" />
                <Text style={styles.vitalsText}>
                  BP {latestVitals.bp} • HR {latestVitals.pulse} • SpO₂ {latestVitals.spo2}%
                </Text>
              </View>
            ) : null}

            {hasAllergies ? (
              <View style={styles.allergyTag}>
                <AlertCircle size={11} color="#DC2626" />
                <Text style={styles.allergyText} numberOfLines={1}>
                  {item.allergies.join(', ')}
                </Text>
              </View>
            ) : null}

            <View style={styles.lastVisitPill}>
              <Clock size={11} color="#64748B" />
              <Text style={styles.lastVisitText}>{item.lastVisitDate}</Text>
            </View>
          </View>
        </View>

        {/* Right Arrow circle */}
        <View style={styles.arrowCircle}>
          <ChevronRight size={16} color="#64748B" />
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: colors.surface1,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  cardDone: {
    opacity: 0.75,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  patientCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  meta: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.muted,
  },
  diagnosis: {
    fontSize: 12.5,
    fontWeight: '400',
    color: colors.text.secondary,
    lineHeight: 17,
    marginTop: 2,
  },
  badgesCol: {
    alignItems: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  badgeUrgent: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  badgeStable: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  badgeRoutine: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  badgeRenewed: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  rxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
    marginBottom: 6,
    gap: 10,
  },
  rxIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rxTextCol: {
    flex: 1,
  },
  medicationName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text.primary,
  },
  dosageText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 1,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  vitalsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#E0F2FE',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 5,
  },
  vitalsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0369A1',
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
    gap: 5,
  },
  allergyText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },
  lastVisitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 4,
    marginLeft: 'auto',
  },
  lastVisitText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
