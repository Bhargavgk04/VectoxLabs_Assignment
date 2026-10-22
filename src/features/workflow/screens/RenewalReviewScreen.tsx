import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AlertTriangle,
  ArrowRight,
  Zap,
  Pill,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { useWorkflow } from '../../../store/WorkflowContext';
import { VitalsTrendChart } from '../components/VitalsTrendChart';
import { DosageStepper } from '../components/DosageStepper';
import { Button } from '../../../components/ui/Button';
import { Badge, BadgeVariant } from '../../../components/ui/Badge';
import { WorkflowStackParamList } from '../../../navigation/types';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';
import { AppDialog } from '../../../components/ui/AppDialog';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<WorkflowStackParamList, 'RenewalReview'>;

export const RenewalReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const { queue, saveDraft } = useWorkflow();

  const item = queue.find((i) => i.id === itemId);

  const existingDraft = item?.draftRenewal;

  const [durationDays, setDurationDays] = useState<number>(
    existingDraft?.durationDays || item?.lastPrescription.durationDays || 30
  );
  const [refills, setRefills] = useState<number>(
    item?.lastPrescription.refillsRemaining ?? 1
  );
  const [dosage, setDosage] = useState<string>(
    existingDraft?.dosage || item?.lastPrescription.dosage || '10mg Once Daily'
  );
  const [allergyAcknowledged, setAllergyAcknowledged] = useState<boolean>(false);
  const [allergyDialogVisible, setAllergyDialogVisible] = useState<boolean>(false);
  const { containerMaxWidth, horizontalPadding } = useResponsive();

  const isFirstMount = useRef(true);

  // Automatically save draft whenever parameters change after initial mount
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    saveDraft(itemId, {
      dosage,
      durationDays,
    });
  }, [dosage, durationDays, itemId, saveDraft]);

  if (!item) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.canvas,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text style={[typography.bodyLg, { color: colors.text.primary }]}>
          Prescription item not found.
        </Text>
        <Button
          label="Return to Queue"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  const hasAllergyWarning = item.allergies && item.allergies.length > 0;

  const handleRenewAsIs = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
    setDosage(item.lastPrescription.dosage);
    setDurationDays(item.lastPrescription.durationDays);
    setRefills(item.lastPrescription.refillsRemaining);
    // Tap 2 shortcut: navigate immediately to completion screen!
    navigation.navigate('RenewalCompletion', {
      itemId: item.id,
      prescribedDosage: item.lastPrescription.dosage,
      prescribedDuration: item.lastPrescription.durationDays,
      prescribedRefills: item.lastPrescription.refillsRemaining,
    });
  };

  const handleProceed = () => {
    if (hasAllergyWarning && !allergyAcknowledged) {
      setAllergyDialogVisible(true);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    // Tap 2: Move to confirmation screen
    navigation.navigate('RenewalCompletion', {
      itemId: item.id,
      prescribedDosage: dosage,
      prescribedDuration: durationDays,
      prescribedRefills: refills,
    });
  };

  const getUrgencyBadgeVariant = (): BadgeVariant => {
    if (item.urgency === 'Urgent') return 'critical';
    if (item.urgency === 'Stable') return 'stable';
    return 'warning';
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.canvas, paddingTop: topPadding },
      ]}
      testID="renewal-review-screen"
    >
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: colors.surface1,
            borderBottomColor: colors.borderSubtle,
            paddingHorizontal: horizontalPadding,
            paddingVertical: spacing.sm,
          },
        ]}
      >
        <View style={[styles.topBarInner, { maxWidth: containerMaxWidth }]}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            testID="back-to-queue-button"
            hitSlop={10}
          >
            <ChevronLeft size={22} color={colors.text.primary} />
            <Text style={[typography.body, { color: colors.text.primary, marginLeft: 4, fontWeight: '600' }]}>
              Queue
            </Text>
          </Pressable>
          <View style={styles.stepIndicatorPill}>
            <Text style={styles.stepIndicatorText}>
              Step 2 of 3 • Review
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { padding: spacing.md, paddingBottom: insets.bottom + 100, alignItems: 'center' },
        ]}
      >
        <View style={{ maxWidth: containerMaxWidth, width: '100%', alignSelf: 'center' }}>
          {/* Patient Summary Header Card */}
        <View
          style={[
            styles.patientCard,
            {
              backgroundColor: colors.surface1,
              borderColor: colors.borderSubtle,
              borderRadius: radius.xl,
              padding: spacing.md,
            },
          ]}
        >
          <View style={styles.patientRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameBadgeRow}>
                <Text
                  style={[
                    typography.h2,
                    {
                      color: colors.text.primary,
                      fontWeight: '700',
                      fontSize: 18,
                      flex: 1,
                      marginRight: 8,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.patientName}
                </Text>
                <Badge
                  label={item.urgency.toUpperCase()}
                  variant={getUrgencyBadgeVariant()}
                />
              </View>
              <Text
                style={[
                  typography.bodySm,
                  { color: colors.text.secondary, marginTop: 3 },
                ]}
                numberOfLines={1}
              >
                {item.patientAge} yrs, {item.patientGender} • {item.diagnoses.join(', ')}
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: colors.text.muted, marginTop: 3 },
                ]}
              >
                Last Visit: {item.lastVisitDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Allergy Contraindication Alert Banner */}
        {hasAllergyWarning && (
          <Pressable
            style={({ pressed }) => [
              styles.warningBanner,
              {
                backgroundColor: '#FEF2F2',
                borderColor: '#FECACA',
                borderRadius: radius.lg,
                paddingVertical: 10,
                paddingHorizontal: 12,
                marginTop: spacing.sm,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={() => setAllergyDialogVisible(true)}
            testID="allergy-warning-banner"
            accessibilityRole="button"
            accessibilityLabel="View clinical allergy details"
          >
            <View style={styles.warningHeader}>
              <AlertTriangle size={15} color={colors.status.critical} />
              <Text style={[styles.warningTitle, { flex: 1 }]} numberOfLines={1}>
                Allergy Alert: <Text style={{ fontWeight: '700', color: colors.status.critical }}>{item.allergies.join(', ')}</Text>
              </Text>
              <ChevronRight size={15} color={colors.status.critical} />
            </View>
            <Text style={styles.warningSub} numberOfLines={1}>
              Tap to view details & confirm clinical compatibility
            </Text>
          </Pressable>
        )}

        {/* Vitals Trend Section */}
        <View style={{ marginTop: spacing.md }}>
          <VitalsTrendChart vitalsTrend={item.vitalsTrend} />
        </View>

        {/* Fast Action 1-Tap 'Renew As-Is' button */}
        <Pressable
          style={({ pressed }) => [
            styles.fastRenewCard,
            {
              backgroundColor: colors.accent.muted,
              borderColor: colors.accent.primary,
              borderRadius: radius.xl,
              padding: spacing.md,
              marginTop: spacing.md,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
          onPress={handleRenewAsIs}
          testID="fast-renew-as-is-btn"
        >
          <View style={styles.fastRenewLeft}>
            <View
              style={[
                styles.zapIconWrap,
                { backgroundColor: colors.accent.primary },
              ]}
            >
              <Zap size={16} color="#FFFFFF" />
            </View>
            <View style={styles.fastRenewTextWrap}>
              <Text
                style={[
                  typography.bodyLg,
                  { color: colors.accent.primary, fontWeight: '700', fontSize: 15 },
                ]}
              >
                1-Tap: Renew As-Is
              </Text>
              <Text style={[typography.caption, { color: colors.text.secondary }]} numberOfLines={1}>
                Keep {item.lastPrescription.dosage} • {item.lastPrescription.durationDays}d ({item.lastPrescription.refillsRemaining} refills)
              </Text>
            </View>
          </View>
          <ArrowRight size={18} color={colors.accent.primary} />
        </Pressable>

        {/* Dosage & Duration Stepper Adjustment */}
        <View
          style={[
            styles.adjustmentCard,
            {
              backgroundColor: colors.surface1,
              borderColor: colors.borderSubtle,
              borderRadius: radius.xl,
              padding: spacing.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <View style={styles.sectionTitleRow}>
            <Pill size={18} color={colors.accent.primary} />
            <Text
              style={[
                typography.h3,
                { color: colors.text.primary, marginLeft: spacing.xs },
              ]}
            >
              Adjust Dosage & Duration
            </Text>
          </View>

          <DosageStepper
            durationDays={durationDays}
            refills={refills}
            dosage={dosage}
            dosageOptions={[
              item.lastPrescription.dosage,
              '5mg Once Daily',
              '10mg Once Daily',
              '20mg Twice Daily',
            ]}
            onDurationChange={setDurationDays}
            onRefillsChange={setRefills}
            onDosageChange={setDosage}
          />
        </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar: Tap 2 Proceed */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface1,
            borderTopColor: colors.borderSubtle,
            paddingHorizontal: horizontalPadding,
            paddingVertical: spacing.md,
            paddingBottom: insets.bottom + spacing.sm,
          },
        ]}
      >
        <View style={{ maxWidth: containerMaxWidth, width: '100%', alignSelf: 'center' }}>
          <Button
            label="Proceed to Sign-Off"
            variant="primary"
            onPress={handleProceed}
            testID="proceed-to-sign-button"
          />
        </View>
      </View>

      {/* In-App Custom Allergy Warning Dialog (replaces native Alert.alert) */}
      <AppDialog
        visible={allergyDialogVisible}
        title="Clinical Allergy Warning"
        description={`Patient has documented allergies to: ${item.allergies.join(', ')}. Please confirm contraindications are verified prior to signing.`}
        type="warning"
        confirmLabel="Acknowledge & Sign Rx"
        cancelLabel="Review Regimen"
        confirmVariant="critical"
        details={[
          { label: 'Patient Name', value: item.patientName },
          { label: 'Known Allergies', value: item.allergies.join(', '), isHighlight: true },
          { label: 'Prescribed Regimen', value: `${item.lastPrescription.medication} (${dosage})` },
        ]}
        onConfirm={() => {
          setAllergyDialogVisible(false);
          setAllergyAcknowledged(true);
          navigation.navigate('RenewalCompletion', {
            itemId: item.id,
            prescribedDosage: dosage,
            prescribedDuration: durationDays,
            prescribedRefills: refills,
          });
        }}
        onCancel={() => setAllergyDialogVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    borderBottomWidth: 1,
    ...elevation.level1,
  },
  topBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicatorPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.accent.muted,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  stepIndicatorText: {
    fontSize: 11,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  scrollContent: {},
  patientCard: {
    borderWidth: 1,
  },
  patientRow: {
    flexDirection: 'row',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningBanner: {
    borderWidth: 1,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningTitle: {
    ...typography.caption,
    color: colors.status.critical,
    fontWeight: '600',
    fontSize: 12,
  },
  warningSub: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 11,
    marginTop: 2,
    marginLeft: 21,
  },
  fastRenewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  fastRenewLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 8,
  },
  fastRenewTextWrap: {
    flex: 1,
  },
  zapIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustmentCard: {
    borderWidth: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
});
