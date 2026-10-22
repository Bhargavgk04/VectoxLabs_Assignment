import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  CheckCircle2,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { useWorkflow } from '../../../store/WorkflowContext';
import { SwipeToConfirm } from '../../../components/feedback/SwipeToConfirm';
import { Button } from '../../../components/ui/Button';
import { Snackbar } from '../../../components/ui/Snackbar';
import { WorkflowStackParamList } from '../../../navigation/types';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';
import { useToast } from '../../../context/ToastContext';
import { useRole } from '../../../store/RoleContext';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<WorkflowStackParamList, 'RenewalCompletion'>;

export const RenewalCompletionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { itemId, prescribedDosage, prescribedDuration, prescribedRefills } =
    route.params;
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const { queue, renewPrescription, executeUndo, clearUndo } = useWorkflow();
  const { currentRole } = useRole();
  const { horizontalPadding } = useResponsive();
  const { showToast } = useToast();

  const item = queue.find((i) => i.id === itemId);

  const [isSigned, setIsSigned] = useState(false);
  const [showUndoSnackbar, setShowUndoSnackbar] = useState(false);
  const [rxNumber, setRxNumber] = useState('');
  const [signTimestamp, setSignTimestamp] = useState('');

  // Auto-calculated next follow-up date (today + duration in days)
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + prescribedDuration);
  const nextDateFormatted = nextDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSwipeConfirm = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // ignore
    }
    const generatedRx = `RX-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setRxNumber(generatedRx);
    setSignTimestamp(new Date().toLocaleTimeString());
    setIsSigned(true);
    await renewPrescription(itemId, prescribedDosage, prescribedDuration);
    setShowUndoSnackbar(true);

    showToast({
      message: `Prescription #${generatedRx} signed & transmitted to pharmacy.`,
      type: 'success',
      actionLabel: 'Undo (5s)',
      durationMs: 5000,
      onAction: handleUndo,
    });
  };

  const handleUndo = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
    await executeUndo();
    setIsSigned(false);
    setShowUndoSnackbar(false);
  };

  const handleNextPatient = useCallback(() => {
    // Reset doctor stack to TodayTab (Rx queue) so the completed patient cannot be backtracked
    if (currentRole === 'doctor') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'DoctorTabs', params: { screen: 'TodayTab' } } as any],
      });
    } else if (currentRole === 'staff') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'StaffTabs', params: { screen: 'PatientsTab' } } as any],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'PatientTabs', params: { screen: 'HomeTab' } } as any],
      });
    }
  }, [navigation, currentRole]);

  // Intercept Android hardware back button: prevent returning to review form once signed
  useEffect(() => {
    if (!isSigned) return;

    const onBackPress = () => {
      handleNextPatient();
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [isSigned, handleNextPatient]);

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
          Prescription details not found.
        </Text>
        <Button
          label="Return to Queue"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              (navigation as any).navigate('DoctorTabs', { screen: 'TodayTab' });
            }
          }}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.canvas, paddingTop: topPadding },
      ]}
      testID="renewal-completion-screen"
    >
      {/* Top Header */}
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
        <View style={styles.topBarInner}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            disabled={isSigned}
            testID="completion-back-btn"
            hitSlop={10}
          >
            {!isSigned && (
              <>
                <ChevronLeft size={22} color={colors.text.primary} />
                <Text
                  style={[
                    typography.body,
                    { color: colors.text.primary, marginLeft: 4, fontWeight: '600' },
                  ]}
                >
                  Back to Review
                </Text>
              </>
            )}
          </Pressable>
          <View style={styles.stepIndicatorPill}>
            <Text style={styles.stepIndicatorText}>
              {isSigned ? 'Signed & Transmitted' : 'Step 3 of 3 • Sign-Off'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { padding: spacing.md, paddingBottom: insets.bottom + 120, alignItems: 'center' },
        ]}
      >
        <View style={{ maxWidth: 680, width: '100%', alignSelf: 'center' }}>
          {!isSigned ? (
            /* Step 3 Confirmation Summary Card */
            <View>
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.surface1,
                  borderColor: colors.borderSubtle,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <FileCheck size={28} color={colors.accent.primary} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text
                    style={[
                      typography.h3,
                      { color: colors.text.primary, fontWeight: '700' },
                    ]}
                  >
                    Prescription Sign-Off
                  </Text>
                  <Text
                    style={[typography.caption, { color: colors.text.secondary }]}
                  >
                    Verify finalized regimen details before executing swipe
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.borderSubtle, marginVertical: spacing.md },
                ]}
              />

              {/* Patient and Med Details Table */}
              <View style={styles.detailRows}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Patient Name</Text>
                  <Text style={[styles.detailValue, { fontWeight: '600' }]}>
                    {item.patientName} (Age {item.patientAge})
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Indication / Diagnosis</Text>
                  <Text style={styles.detailValue}>
                    {item.diagnoses.join(', ')}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Prescribed Regimen</Text>
                  <Text style={[styles.detailValue, { color: colors.accent.primary, fontWeight: '700' }]}>
                    {item.lastPrescription.medication} — {prescribedDosage}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration & Refills</Text>
                  <Text style={[styles.detailValue, { fontWeight: '600' }]}>
                    {prescribedDuration} Days ({prescribedRefills} refill
                    {prescribedRefills === 1 ? '' : 's'})
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Next Auto-Suggested Visit</Text>
                  <Text style={[styles.detailValue, { color: colors.status.stable, fontWeight: '600' }]}>
                    {nextDateFormatted}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.telemetryTag,
                  {
                    backgroundColor: colors.surface2,
                    borderRadius: radius.full,
                    paddingVertical: 7,
                    paddingHorizontal: 14,
                    marginTop: spacing.md,
                  },
                ]}
              >
                <ShieldCheck size={16} color={colors.accent.primary} />
                <Text
                  style={[
                    typography.caption,
                    { color: colors.text.secondary, marginLeft: 6 },
                  ]}
                >
                  Secured with Clinician Telemetry Digital Signature (256-bit ECDSA)
                </Text>
              </View>
            </View>

            {/* Swipe to Confirm Element */}
            <View style={{ marginTop: spacing.xl }}>
              <SwipeToConfirm
                onConfirm={handleSwipeConfirm}
                label="Swipe to Confirm & Sign"
                confirmedLabel="Prescription Signed!"
              />
            </View>
          </View>
        ) : (
          /* Post-Confirmation Success View */
          <View style={styles.successContainer} testID="success-signed-view">
            <View
              style={[
                styles.successBadge,
                { backgroundColor: colors.status.stableBg },
              ]}
            >
              <CheckCircle2 size={56} color={colors.status.stable} />
            </View>

            <Text
              style={[
                typography.h1,
                {
                  color: colors.text.primary,
                  marginTop: spacing.md,
                  textAlign: 'center',
                },
              ]}
            >
              Prescription Signed!
            </Text>

            <Text
              style={[
                typography.body,
                {
                  color: colors.text.secondary,
                  marginTop: 6,
                  textAlign: 'center',
                },
              ]}
            >
              Order transmitted to central hospital pharmacy system.
            </Text>

            {/* Electronic Rx Receipt Card */}
            <View
              style={[
                styles.receiptCard,
                {
                  backgroundColor: colors.surface1,
                  borderColor: colors.borderSubtle,
                  borderRadius: radius.xl,
                  padding: spacing.md,
                  marginTop: spacing.lg,
                },
              ]}
            >
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>
                  Electronic Rx #
                </Text>
                <Text
                  style={styles.receiptMonoValue}
                  testID="rx-number-display"
                >
                  {rxNumber}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>
                  Patient
                </Text>
                <Text style={styles.receiptValue}>
                  {item.patientName}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>
                  Prescription
                </Text>
                <Text style={styles.receiptValue}>
                  {item.lastPrescription.medication} ({prescribedDosage})
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>
                  Duration / Refills
                </Text>
                <Text style={styles.receiptValue}>
                  {prescribedDuration} days • {prescribedRefills} refills
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>
                  Next Follow-Up
                </Text>
                <Text
                  style={[
                    styles.receiptValue,
                    { color: colors.status.stable, fontWeight: '600' },
                  ]}
                >
                  {nextDateFormatted}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>
                  Signature Timestamp
                </Text>
                <Text
                  style={[styles.receiptValue, { color: colors.text.muted, fontSize: 12 }]}
                >
                  {signTimestamp}
                </Text>
              </View>
            </View>

            {/* Next Patient CTA */}
            <View style={{ marginTop: spacing.xl, width: '100%' }}>
              <Button
                label="Next Patient in Queue"
                variant="primary"
                icon={<ArrowRight size={18} color={colors.canvas} />}
                onPress={handleNextPatient}
                testID="next-patient-button"
              />
            </View>
          </View>
        )}
        </View>
      </ScrollView>

      {/* 5-Second Undo Floating Snackbar */}
      <Snackbar
        visible={showUndoSnackbar}
        message="Prescription signed and transmitted."
        actionLabel="UNDO"
        onAction={handleUndo}
        onDismiss={() => {
          setShowUndoSnackbar(false);
          clearUndo();
        }}
        durationMs={5000}
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
  },
  topBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
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
  summaryCard: {
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  detailRows: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailLabel: {
    width: 130,
    flexShrink: 0,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: colors.text.primary,
    textAlign: 'right',
    lineHeight: 18,
    fontWeight: '500',
  },
  telemetryTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptCard: {
    width: '100%',
    borderWidth: 1,
    gap: 10,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  receiptLabel: {
    width: 125,
    flexShrink: 0,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  receiptValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    color: colors.text.primary,
    lineHeight: 18,
    fontWeight: '500',
  },
  receiptMonoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    color: colors.accent.primary,
    fontWeight: '700',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
