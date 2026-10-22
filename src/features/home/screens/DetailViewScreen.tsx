import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  Calendar,
  X,
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { RemoteImage } from '../../../components/media/RemoteImage';
import { Button } from '../../../components/ui/Button';
import { RootStackParamList } from '../../../navigation/types';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';
import { useRole } from '../../../store/RoleContext';
import { useToast } from '../../../context/ToastContext';
import { updatePatientStatus } from '../../../services/patientService';
import { updateAppointmentStatus } from '../../../services/appointmentService';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'DetailView'>;

type ProcedureType = 'discharge' | 'transfer' | 'vitals';
type AppointmentActionType =
  | 'in-progress'
  | 'completed'
  | 'reschedule'
  | 'diagnostic'
  | 'noshow'
  | 'patient-reschedule'
  | 'patient-cancel';

export const DetailViewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, category, title, subtitle, imageUrl, description, metadata } =
    route.params;
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const { isDesktop } = useResponsive();
  const { currentRole } = useRole();
  const { showToast } = useToast();

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inpatient Procedure State
  const [selectedProcedure, setSelectedProcedure] =
    useState<ProcedureType>('discharge');
  const [targetWard, setTargetWard] = useState('Step-Down Unit 3B');

  // Appointment Procedure State
  const [selectedAppointmentAction, setSelectedAppointmentAction] =
    useState<AppointmentActionType>(
      currentRole === 'patient' ? 'patient-reschedule' : 'in-progress'
    );
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] =
    useState('Tomorrow 09:30 AM');
  const [selectedClinicalNote, setSelectedClinicalNote] =
    useState('Satisfactory Recovery • Meds Renewed');
  const [selectedLabOrder, setSelectedLabOrder] = useState('12-Lead ECG');
  const [selectedCancelReason, setSelectedCancelReason] =
    useState('Patient Late / Did Not Arrive');
  const [selectedPatientCancelReason, setSelectedPatientCancelReason] =
    useState('Schedule Conflict');

  // Diagnostic Procedure State
  const [selectedDiagnosticSlot, setSelectedDiagnosticSlot] =
    useState('Tomorrow 08:30 AM');
  const [collectionMode, setCollectionMode] = useState<
    'home' | 'hospital'
  >('home');

  const [confirmationData, setConfirmationData] = useState<{
    reference: string;
    title: string;
    message: string;
    timestamp: string;
    statusBadge: string;
    extraDetails?: Record<string, string>;
  } | null>(null);

  const isInpatient =
    category.toLowerCase().includes('inpatient') ||
    category.toLowerCase().includes('census');

  const isAppointment =
    category.toLowerCase().includes('appointment') ||
    category.toLowerCase().includes('consult');

  const isDiagnostic =
    category.toLowerCase().includes('diagnostic') ||
    category.toLowerCase().includes('checkup');

  const isDepartment = category.toLowerCase().includes('department');

  const handleOpenAction = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }

    if (isDepartment) {
      navigation.navigate('DoctorDirectory');
      return;
    }

    setIsConfirmed(false);
    setModalVisible(true);
  };

  const handleExecuteProcedure = async () => {
    setIsSubmitting(true);
    const refCode = `VX-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      if (isInpatient) {
        if (currentRole === 'patient') {
          setConfirmationData({
            reference: `VX-INP-${refCode.slice(-4)}`,
            title: 'Inpatient Care Details Acknowledged',
            message: `Care and ward details for ${title} reviewed. Nursing Station 3 notified.`,
            timestamp: `Today at ${nowStr}`,
            statusBadge: 'Inpatient Record Active',
            extraDetails: {
              'Care Station': subtitle || 'Inpatient Acute Care Wing',
              'Visiting Hours': '04:00 PM - 07:00 PM (1 Attendant Pass)',
            },
          });
        } else if (selectedProcedure === 'discharge') {
          await updatePatientStatus(id, 'Discharged');
          setConfirmationData({
            reference: `VX-DISC-${refCode.slice(-4)}`,
            title: 'Discharge Order Authorized',
            message: `Clinical discharge completed for ${title}. Summary transmitted to primary care physician and bed marked for sanitization.`,
            timestamp: `Today at ${nowStr}`,
            statusBadge: 'Discharged • Bed Vacated',
          });
        } else if (selectedProcedure === 'transfer') {
          await updatePatientStatus(id, 'Admitted', targetWard);
          setConfirmationData({
            reference: `VX-XFER-${refCode.slice(-4)}`,
            title: 'Ward Transfer Confirmed',
            message: `Patient transfer to ${targetWard} successfully processed. Telemetry monitoring handoff completed.`,
            timestamp: `Today at ${nowStr}`,
            statusBadge: `Transferred to ${targetWard}`,
          });
        } else {
          setConfirmationData({
            reference: `VX-STAT-${refCode.slice(-4)}`,
            title: 'Clinical Order Dispatched',
            message: `Stat laboratory and telemetry vitals order queued for ${title}. On-duty nursing alerted.`,
            timestamp: `Today at ${nowStr}`,
            statusBadge: 'Order Active • Telemetry Linked',
          });
        }
      } else if (isAppointment) {
        if (selectedAppointmentAction === 'in-progress') {
          await updateAppointmentStatus(id, 'In-Progress');
          setConfirmationData({
            reference: `VX-APT-${refCode.slice(-4)}`,
            title: 'Consultation In-Progress',
            message: `Patient checked in to ${subtitle || 'assigned clinic'}. Attending specialist notified that consultation has commenced.`,
            timestamp: `Today at ${nowStr}`,
            statusBadge: 'Status: In-Progress',
            extraDetails: {
              'Assigned Location': subtitle || 'Clinic Room 104',
              'Arrival Timestamp': `Today at ${nowStr}`,
            },
          });
        } else if (selectedAppointmentAction === 'completed') {
          await updateAppointmentStatus(id, 'Completed');
          setConfirmationData({
            reference: `VX-CMP-${refCode.slice(-4)}`,
            title: 'Consultation Signed Off',
            message: `Clinical encounter successfully finalized. Summary recorded: "${selectedClinicalNote}".`,
            timestamp: `Today at ${nowStr}`,
            statusBadge: 'Status: Completed',
            extraDetails: {
              'Clinical Outcome': selectedClinicalNote,
              'Signed By': 'Attending Physician',
            },
          });
        } else if (
          selectedAppointmentAction === 'reschedule' ||
          selectedAppointmentAction === 'patient-reschedule'
        ) {
          await updateAppointmentStatus(id, 'Scheduled');
          setConfirmationData({
            reference: `VX-RES-${refCode.slice(-4)}`,
            title: 'Consultation Rescheduled',
            message: `Appointment successfully transferred to ${selectedRescheduleSlot}. Patient and clinic calendar updated.`,
            timestamp: `Today at ${nowStr}`,
            statusBadge: 'Status: Rescheduled',
            extraDetails: {
              'New Slot': selectedRescheduleSlot,
              'Specialist Clinic': subtitle || 'OPD Suite',
            },
          });
        } else if (selectedAppointmentAction === 'diagnostic') {
          setConfirmationData({
            reference: `VX-LAB-${refCode.slice(-4)}`,
            title: 'STAT Diagnostic Order Dispatched',
            message: `Investigation panel (${selectedLabOrder}) ordered for ${title}. Sent to Central Diagnostics Laboratory.`,
            timestamp: `Today at ${nowStr}`,
            statusBadge: 'Investigation Active',
            extraDetails: {
              'Ordered Panel': selectedLabOrder,
              'Dispatch Priority': 'STAT Clinical Order',
            },
          });
        } else if (
          selectedAppointmentAction === 'noshow' ||
          selectedAppointmentAction === 'patient-cancel'
        ) {
          await updateAppointmentStatus(id, 'Cancelled');
          setConfirmationData({
            reference: `VX-CAN-${refCode.slice(-4)}`,
            title:
              currentRole === 'patient'
                ? 'Appointment Cancelled'
                : 'Marked No-Show / Cancelled',
            message: `Consultation marked cancelled (${
              currentRole === 'patient'
                ? selectedPatientCancelReason
                : selectedCancelReason
            }). Slot released back to hospital schedule.`,
            timestamp: `Today at ${nowStr}`,
            statusBadge: 'Status: Cancelled',
            extraDetails: {
              'Cancellation Reason':
                currentRole === 'patient'
                  ? selectedPatientCancelReason
                  : selectedCancelReason,
            },
          });
        }
      } else if (isDiagnostic) {
        setConfirmationData({
          reference: `VX-DIAG-${refCode.slice(-4)}`,
          title: 'Diagnostic Test Reserved',
          message: `Booking for ${title} reserved for ${selectedDiagnosticSlot} (${collectionMode === 'home' ? 'Home Sample Collection' : 'Hospital Central Lab'}).`,
          timestamp: `Today at ${nowStr}`,
          statusBadge: 'Slot Reserved • Phlebotomist Assigned',
        });
      } else {
        setConfirmationData({
          reference: `VX-SRV-${refCode.slice(-4)}`,
          title: 'Clinical Request Processed',
          message: `Request for ${title} logged with Vectox Clinical Operations.`,
          timestamp: `Today at ${nowStr}`,
          statusBadge: 'Active Request',
        });
      }

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // ignore
      }

      setIsConfirmed(true);
      showToast({
        message: `EMR Updated: ${title} procedure confirmed.`,
        type: 'success',
        durationMs: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonLabel = () => {
    if (isDepartment) return 'View Specialists';
    if (isDiagnostic) return 'Schedule Diagnostic Test';
    if (isInpatient) {
      return currentRole === 'patient' ? 'Inpatient Care Info' : 'Clinical Care Procedure';
    }
    if (isAppointment) {
      return currentRole === 'patient' ? 'Manage Appointment' : 'Update Consultation';
    }
    return 'Clinical Action Request';
  };

  const formatCategoryLabel = (rawCategory: string) => {
    return rawCategory
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.canvas, paddingTop: topPadding },
      ]}
      testID="detail-view-screen"
    >
      {/* Top Header with Generous Breathing Room */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Pressable
            style={({ pressed }) => [
              styles.circleBackBtn,
              { opacity: pressed ? 0.75 : 1 },
            ]}
            onPress={() => navigation.goBack()}
            testID="detail-back-btn"
            hitSlop={12}
          >
            <ChevronLeft size={20} color={colors.text.primary} />
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>

          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>
              {formatCategoryLabel(category)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Entity Hero Image with Rounded Margin Card */}
          {imageUrl ? (
            <View style={[styles.imageContainer, elevation.level1]}>
              <RemoteImage
                uri={imageUrl}
                style={styles.heroImage}
                fallbackText={title}
                borderRadius={radius.lg}
              />
            </View>
          ) : null}

          <View style={styles.mainBody}>
            {/* Header Titles with Generous Vertical Spacing */}
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>{title}</Text>
              {subtitle ? (
                <View style={styles.subtitleRow}>
                  <Calendar size={14} color={colors.accent.primary} />
                  <Text style={styles.subtitleText}>{subtitle}</Text>
                </View>
              ) : null}
            </View>

            {/* Description & Clinical Guidelines */}
            {description ? (
              <View style={[styles.descriptionCard, elevation.level1]}>
                <Text style={styles.sectionHeading}>
                  Overview & Clinical Guidelines
                </Text>
                <Text style={styles.bodyDescription}>{description}</Text>
              </View>
            ) : null}

            {/* Service Telemetry & Metadata Table */}
            {metadata && Object.keys(metadata).length > 0 ? (
              <View style={[styles.metadataCard, elevation.level1]}>
                <Text style={styles.sectionHeading}>
                  Service Parameters & Telemetry
                </Text>

                <View style={styles.metadataRows}>
                  {Object.entries(metadata).map(([key, val], index, arr) => (
                    <View
                      key={key}
                      style={[
                        styles.metaRow,
                        index === arr.length - 1 ? { borderBottomWidth: 0 } : null,
                      ]}
                    >
                      <Text style={styles.metaKey}>{key}</Text>
                      <Text style={styles.metaVal}>{String(val)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) + 6 },
        ]}
      >
        <View style={styles.bottomBarInner}>
          <Button
            label={getButtonLabel()}
            variant="primary"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            onPress={handleOpenAction}
            testID="detail-action-button"
          />
        </View>
      </View>

      {/* Real Clinical Procedure & Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View
            style={[
              styles.modalBackdrop,
              isDesktop && { justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
            ]}
          >
          <View
            style={[
              styles.modalCard,
              { paddingBottom: Math.max(insets.bottom, 20) + 12 },
              isDesktop && {
                maxWidth: 580,
                borderRadius: radius.xxl,
                borderBottomLeftRadius: radius.xxl,
                borderBottomRightRadius: radius.xxl,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.modalTitle}>
                  {isConfirmed
                    ? 'Procedure Completed'
                    : isInpatient
                    ? 'Inpatient Care Procedure'
                    : isAppointment
                    ? 'Consultation Actions'
                    : 'Schedule Procedure'}
                </Text>
                <Text style={styles.modalSubtitle} numberOfLines={1}>
                  {title}
                </Text>
              </View>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
                hitSlop={10}
              >
                <X size={20} color={colors.text.secondary} />
              </Pressable>
            </View>

            {/* Modal Content - Confirmation State */}
            {isConfirmed && confirmationData ? (
              <View style={styles.confirmationBody}>
                <View style={styles.successIconBadge}>
                  <CheckCircle2 size={44} color="#10B981" />
                </View>

                <Text style={styles.confirmedTitle}>
                  {confirmationData.title}
                </Text>

                <View style={styles.statusPill}>
                  <ShieldCheck size={14} color="#059669" />
                  <Text style={styles.statusPillText}>
                    {confirmationData.statusBadge}
                  </Text>
                </View>

                <Text style={styles.confirmedMessage}>
                  {confirmationData.message}
                </Text>

                <View style={styles.receiptBox}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptKey}>Order Reference</Text>
                    <Text style={styles.receiptVal}>
                      {confirmationData.reference}
                    </Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptKey}>Audit Timestamp</Text>
                    <Text style={styles.receiptVal}>
                      {confirmationData.timestamp}
                    </Text>
                  </View>
                  {confirmationData.extraDetails ? (
                    Object.entries(confirmationData.extraDetails).map(([k, v]) => (
                      <View style={styles.receiptRow} key={k}>
                        <Text style={styles.receiptKey}>{k}</Text>
                        <Text style={styles.receiptVal}>{v}</Text>
                      </View>
                    ))
                  ) : null}
                  <View style={[styles.receiptRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.receiptKey}>EMR Sync Status</Text>
                    <View style={styles.highlightPill}>
                      <Text style={styles.highlightPillText}>Verified & Synced</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalActionButtons}>
                  <Button
                    label={currentRole === 'patient' ? 'Done • Return to Campus' : 'Done & Return to Registry'}
                    variant="primary"
                    icon={<CheckCircle2 size={16} color="#FFFFFF" />}
                    onPress={() => {
                      setModalVisible(false);
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      } else {
                        if (currentRole === 'doctor') {
                          navigation.navigate('DoctorTabs' as any);
                        } else if (currentRole === 'staff') {
                          navigation.navigate('StaffTabs' as any);
                        } else {
                          navigation.navigate('PatientTabs' as any);
                        }
                      }
                    }}
                    style={styles.modalPrimaryBtn}
                  />
                  <Button
                    label="Stay on Detail View"
                    variant="secondary"
                    onPress={() => setModalVisible(false)}
                    style={styles.modalSecondaryBtn}
                  />
                </View>
              </View>
            ) : (
              /* Modal Content - Execution Step */
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.modalFormScroll}
                keyboardShouldPersistTaps="handled"
              >
                {/* INPATIENT PROCEDURES */}
                {isInpatient ? (
                  currentRole === 'patient' ? (
                    <View style={styles.procedureOptionsGroup}>
                      <Text style={styles.optionsLabel}>
                        Inpatient Ward & Care Guidelines:
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: radius.lg,
                          padding: spacing.md,
                          borderWidth: 1,
                          borderColor: colors.borderSubtle,
                          marginTop: 6,
                          gap: 8,
                        }}
                      >
                        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text.primary }}>
                          Attending Clinical & Nursing Station
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.text.secondary, lineHeight: 18 }}>
                          Assigned to Inpatient Ward 4B. Attending clinicians perform rounds twice daily at 10:00 AM and 05:30 PM. Nursing calls can be initiated via room intercom.
                        </Text>
                        <View style={{ height: 1, backgroundColor: colors.borderSubtle, marginVertical: 4 }} />
                        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.accent.primary }}>
                          Visiting Hours: 04:00 PM – 07:00 PM Daily (1 Attendant Pass Allowed)
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.text.muted }}>
                          Dietary and medication schedules are coordinated directly with Central Hospital Pharmacy.
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.procedureOptionsGroup}>
                      <Text style={styles.optionsLabel}>
                        Select Clinical Procedure Protocol:
                      </Text>

                    {/* Option 1: Discharge Patient */}
                    <Pressable
                      style={[
                        styles.optionCard,
                        selectedProcedure === 'discharge' &&
                          styles.optionCardActive,
                      ]}
                      onPress={() => setSelectedProcedure('discharge')}
                    >
                      <View style={styles.optionHeader}>
                        <View style={styles.optionRadio}>
                          {selectedProcedure === 'discharge' ? (
                            <View style={styles.radioInner} />
                          ) : null}
                        </View>
                        <View style={styles.optionTitleCol}>
                          <Text style={styles.optionTitle}>
                            Discharge Clearance & Vacate Bed
                          </Text>
                          <Text style={styles.optionDesc}>
                            Authorize patient discharge, vacate bed in census,
                            and transmit e-prescriptions.
                          </Text>
                        </View>
                      </View>

                      {selectedProcedure === 'discharge' ? (
                        <View style={styles.checklistContainer}>
                          <View style={styles.checkItem}>
                            <FileCheck2 size={13} color="#059669" />
                            <Text style={styles.checkItemText}>
                              Attending physician clinical discharge signed
                            </Text>
                          </View>
                          <View style={styles.checkItem}>
                            <FileCheck2 size={13} color="#059669" />
                            <Text style={styles.checkItemText}>
                              Pharmacy reconciliation and meds dispensed
                            </Text>
                          </View>
                          <View style={styles.checkItem}>
                            <FileCheck2 size={13} color="#059669" />
                            <Text style={styles.checkItemText}>
                              Post-discharge vitals reviewed
                            </Text>
                          </View>
                        </View>
                      ) : null}
                    </Pressable>

                    {/* Option 2: Transfer Ward */}
                    <Pressable
                      style={[
                        styles.optionCard,
                        selectedProcedure === 'transfer' &&
                          styles.optionCardActive,
                      ]}
                      onPress={() => setSelectedProcedure('transfer')}
                    >
                      <View style={styles.optionHeader}>
                        <View style={styles.optionRadio}>
                          {selectedProcedure === 'transfer' ? (
                            <View style={styles.radioInner} />
                          ) : null}
                        </View>
                        <View style={styles.optionTitleCol}>
                          <Text style={styles.optionTitle}>
                            Transfer Ward / Bed Reassignment
                          </Text>
                          <Text style={styles.optionDesc}>
                            Move patient to Step-Down or Telemetry bed.
                          </Text>
                        </View>
                      </View>

                      {selectedProcedure === 'transfer' ? (
                        <View style={styles.wardSelectContainer}>
                          <Text style={styles.wardSelectLabel}>
                            Destination Ward:
                          </Text>
                          <View style={styles.wardChipsRow}>
                            {[
                              'Step-Down Unit 3B',
                              'Telemetry Bed 102',
                              'Ward 4C',
                            ].map((w) => (
                              <Pressable
                                key={w}
                                style={[
                                  styles.wardChip,
                                  targetWard === w && styles.wardChipActive,
                                ]}
                                onPress={() => setTargetWard(w)}
                              >
                                <Text
                                  style={[
                                    styles.wardChipText,
                                    targetWard === w &&
                                      styles.wardChipTextActive,
                                  ]}
                                >
                                  {w}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        </View>
                      ) : null}
                    </Pressable>

                    {/* Option 3: Stat Orders */}
                    <Pressable
                      style={[
                        styles.optionCard,
                        selectedProcedure === 'vitals' &&
                          styles.optionCardActive,
                      ]}
                      onPress={() => setSelectedProcedure('vitals')}
                    >
                      <View style={styles.optionHeader}>
                        <View style={styles.optionRadio}>
                          {selectedProcedure === 'vitals' ? (
                            <View style={styles.radioInner} />
                          ) : null}
                        </View>
                        <View style={styles.optionTitleCol}>
                          <Text style={styles.optionTitle}>
                            Order STAT Telemetry & Lab Panel
                          </Text>
                          <Text style={styles.optionDesc}>
                            Dispatch urgent blood review and nursing rounds.
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                  )
                ) : isAppointment ? (
                  /* APPOINTMENT ACTIONS */
                  <View style={styles.procedureOptionsGroup}>
                    <Text style={styles.optionsLabel}>
                      {currentRole === 'patient'
                        ? 'Patient Appointment Actions:'
                        : 'Clinical Consultation Protocols:'}
                    </Text>

                    {currentRole === 'patient' ? (
                      /* PATIENT ROLE CHOICES */
                      <>
                        {/* Option 1: Reschedule */}
                        <Pressable
                          style={[
                            styles.optionCard,
                            selectedAppointmentAction === 'patient-reschedule' &&
                              styles.optionCardActive,
                          ]}
                          onPress={() =>
                            setSelectedAppointmentAction('patient-reschedule')
                          }
                        >
                          <View style={styles.optionHeader}>
                            <View style={styles.optionRadio}>
                              {selectedAppointmentAction ===
                              'patient-reschedule' ? (
                                <View style={styles.radioInner} />
                              ) : null}
                            </View>
                            <View style={styles.optionTitleCol}>
                              <Text style={styles.optionTitle}>
                                Reschedule Consultation Slot
                              </Text>
                              <Text style={styles.optionDesc}>
                                Choose a new convenient consultation date & time.
                              </Text>
                            </View>
                          </View>

                          {selectedAppointmentAction ===
                          'patient-reschedule' ? (
                            <View style={styles.interactivePillGroup}>
                              <Text style={styles.interactiveGroupLabel}>
                                Available OPD Slots:
                              </Text>
                              <View style={styles.interactiveChipsRow}>
                                {[
                                  'Tomorrow 09:30 AM',
                                  'Tomorrow 02:00 PM',
                                  'Oct 24, 11:00 AM',
                                  'Oct 27, 04:30 PM',
                                ].map((slot) => (
                                  <Pressable
                                    key={slot}
                                    style={[
                                      styles.interactiveChip,
                                      selectedRescheduleSlot === slot &&
                                        styles.interactiveChipActive,
                                    ]}
                                    onPress={() =>
                                      setSelectedRescheduleSlot(slot)
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.interactiveChipText,
                                        selectedRescheduleSlot === slot &&
                                          styles.interactiveChipTextActive,
                                      ]}
                                    >
                                      {slot}
                                    </Text>
                                  </Pressable>
                                ))}
                              </View>
                            </View>
                          ) : null}
                        </Pressable>

                        {/* Option 2: Cancel */}
                        <Pressable
                          style={[
                            styles.optionCard,
                            selectedAppointmentAction === 'patient-cancel' &&
                              styles.optionCardActive,
                          ]}
                          onPress={() =>
                            setSelectedAppointmentAction('patient-cancel')
                          }
                        >
                          <View style={styles.optionHeader}>
                            <View style={styles.optionRadio}>
                              {selectedAppointmentAction ===
                              'patient-cancel' ? (
                                <View style={styles.radioInner} />
                              ) : null}
                            </View>
                            <View style={styles.optionTitleCol}>
                              <Text style={styles.optionTitle}>
                                Cancel Consultation Request
                              </Text>
                              <Text style={styles.optionDesc}>
                                Release your appointment booking back to clinic.
                              </Text>
                            </View>
                          </View>

                          {selectedAppointmentAction ===
                          'patient-cancel' ? (
                            <View style={styles.interactivePillGroup}>
                              <Text style={styles.interactiveGroupLabel}>
                                Reason for Cancellation:
                              </Text>
                              <View style={styles.interactiveChipsRow}>
                                {[
                                  'Schedule Conflict',
                                  'Feeling Better / Resolved',
                                  'Doctor Unreachable',
                                  'Transportation Issue',
                                ].map((reason) => (
                                  <Pressable
                                    key={reason}
                                    style={[
                                      styles.interactiveChip,
                                      selectedPatientCancelReason ===
                                        reason && styles.interactiveChipActive,
                                    ]}
                                    onPress={() =>
                                      setSelectedPatientCancelReason(reason)
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.interactiveChipText,
                                        selectedPatientCancelReason ===
                                          reason &&
                                          styles.interactiveChipTextActive,
                                      ]}
                                    >
                                      {reason}
                                    </Text>
                                  </Pressable>
                                ))}
                              </View>
                            </View>
                          ) : null}
                        </Pressable>
                      </>
                    ) : (
                      /* CLINICIAN / STAFF ROLE CHOICES */
                      <>
                        {/* Action 1: In Progress */}
                        <Pressable
                          style={[
                            styles.optionCard,
                            selectedAppointmentAction === 'in-progress' &&
                              styles.optionCardActive,
                          ]}
                          onPress={() =>
                            setSelectedAppointmentAction('in-progress')
                          }
                        >
                          <View style={styles.optionHeader}>
                            <View style={styles.optionRadio}>
                              {selectedAppointmentAction === 'in-progress' ? (
                                <View style={styles.radioInner} />
                              ) : null}
                            </View>
                            <View style={styles.optionTitleCol}>
                              <Text style={styles.optionTitle}>
                                Start Consultation & Room Patient
                              </Text>
                              <Text style={styles.optionDesc}>
                                Check patient into clinic room and notify
                                attending specialist.
                              </Text>
                            </View>
                          </View>
                        </Pressable>

                        {/* Action 2: Completed */}
                        <Pressable
                          style={[
                            styles.optionCard,
                            selectedAppointmentAction === 'completed' &&
                              styles.optionCardActive,
                          ]}
                          onPress={() =>
                            setSelectedAppointmentAction('completed')
                          }
                        >
                          <View style={styles.optionHeader}>
                            <View style={styles.optionRadio}>
                              {selectedAppointmentAction === 'completed' ? (
                                <View style={styles.radioInner} />
                              ) : null}
                            </View>
                            <View style={styles.optionTitleCol}>
                              <Text style={styles.optionTitle}>
                                Complete Encounter & Sign Notes
                              </Text>
                              <Text style={styles.optionDesc}>
                                Mark consultation completed and archive clinical
                                notes.
                              </Text>
                            </View>
                          </View>

                          {selectedAppointmentAction === 'completed' ? (
                            <View style={styles.interactivePillGroup}>
                              <Text style={styles.interactiveGroupLabel}>
                                Encounter Disposition:
                              </Text>
                              <View style={styles.interactiveChipsRow}>
                                {[
                                  'Satisfactory Recovery • Meds Renewed',
                                  'Adjusted Dosage • Follow-up 4 Wks',
                                  'Referred to Cardiology Specialist',
                                  'Discharged from Care',
                                ].map((note) => (
                                  <Pressable
                                    key={note}
                                    style={[
                                      styles.interactiveChip,
                                      selectedClinicalNote === note &&
                                        styles.interactiveChipActive,
                                    ]}
                                    onPress={() =>
                                      setSelectedClinicalNote(note)
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.interactiveChipText,
                                        selectedClinicalNote === note &&
                                          styles.interactiveChipTextActive,
                                      ]}
                                    >
                                      {note}
                                    </Text>
                                  </Pressable>
                                ))}
                              </View>
                            </View>
                          ) : null}
                        </Pressable>

                        {/* Action 3: Reschedule */}
                        <Pressable
                          style={[
                            styles.optionCard,
                            selectedAppointmentAction === 'reschedule' &&
                              styles.optionCardActive,
                          ]}
                          onPress={() =>
                            setSelectedAppointmentAction('reschedule')
                          }
                        >
                          <View style={styles.optionHeader}>
                            <View style={styles.optionRadio}>
                              {selectedAppointmentAction === 'reschedule' ? (
                                <View style={styles.radioInner} />
                              ) : null}
                            </View>
                            <View style={styles.optionTitleCol}>
                              <Text style={styles.optionTitle}>
                                Reschedule Consultation Slot
                              </Text>
                              <Text style={styles.optionDesc}>
                                Transfer visit to next available OPD specialist
                                slot.
                              </Text>
                            </View>
                          </View>

                          {selectedAppointmentAction === 'reschedule' ? (
                            <View style={styles.interactivePillGroup}>
                              <Text style={styles.interactiveGroupLabel}>
                                Target Slot:
                              </Text>
                              <View style={styles.interactiveChipsRow}>
                                {[
                                  'Tomorrow 09:30 AM',
                                  'Tomorrow 02:00 PM',
                                  'Oct 24, 11:00 AM',
                                  'Oct 27, 04:30 PM',
                                ].map((slot) => (
                                  <Pressable
                                    key={slot}
                                    style={[
                                      styles.interactiveChip,
                                      selectedRescheduleSlot === slot &&
                                        styles.interactiveChipActive,
                                    ]}
                                    onPress={() =>
                                      setSelectedRescheduleSlot(slot)
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.interactiveChipText,
                                        selectedRescheduleSlot === slot &&
                                          styles.interactiveChipTextActive,
                                      ]}
                                    >
                                      {slot}
                                    </Text>
                                  </Pressable>
                                ))}
                              </View>
                            </View>
                          ) : null}
                        </Pressable>

                        {/* Action 4: Order STAT Diagnostic */}
                        <Pressable
                          style={[
                            styles.optionCard,
                            selectedAppointmentAction === 'diagnostic' &&
                              styles.optionCardActive,
                          ]}
                          onPress={() =>
                            setSelectedAppointmentAction('diagnostic')
                          }
                        >
                          <View style={styles.optionHeader}>
                            <View style={styles.optionRadio}>
                              {selectedAppointmentAction === 'diagnostic' ? (
                                <View style={styles.radioInner} />
                              ) : null}
                            </View>
                            <View style={styles.optionTitleCol}>
                              <Text style={styles.optionTitle}>
                                Order STAT Diagnostic Panel
                              </Text>
                              <Text style={styles.optionDesc}>
                                Dispatch immediate cardiac lab or diagnostic
                                imaging order.
                              </Text>
                            </View>
                          </View>

                          {selectedAppointmentAction === 'diagnostic' ? (
                            <View style={styles.interactivePillGroup}>
                              <Text style={styles.interactiveGroupLabel}>
                                Investigation Panel:
                              </Text>
                              <View style={styles.interactiveChipsRow}>
                                {[
                                  '12-Lead ECG',
                                  'Troponin-I Panel',
                                  'Echocardiogram',
                                  'CBC & Chem-7',
                                ].map((panel) => (
                                  <Pressable
                                    key={panel}
                                    style={[
                                      styles.interactiveChip,
                                      selectedLabOrder === panel &&
                                        styles.interactiveChipActive,
                                    ]}
                                    onPress={() => setSelectedLabOrder(panel)}
                                  >
                                    <Text
                                      style={[
                                        styles.interactiveChipText,
                                        selectedLabOrder === panel &&
                                          styles.interactiveChipTextActive,
                                      ]}
                                    >
                                      {panel}
                                    </Text>
                                  </Pressable>
                                ))}
                              </View>
                            </View>
                          ) : null}
                        </Pressable>

                        {/* Action 5: Mark No-Show */}
                        <Pressable
                          style={[
                            styles.optionCard,
                            selectedAppointmentAction === 'noshow' &&
                              styles.optionCardActive,
                          ]}
                          onPress={() =>
                            setSelectedAppointmentAction('noshow')
                          }
                        >
                          <View style={styles.optionHeader}>
                            <View style={styles.optionRadio}>
                              {selectedAppointmentAction === 'noshow' ? (
                                <View style={styles.radioInner} />
                              ) : null}
                            </View>
                            <View style={styles.optionTitleCol}>
                              <Text style={styles.optionTitle}>
                                Mark No-Show / Cancelled Visit
                              </Text>
                              <Text style={styles.optionDesc}>
                                Document non-attendance and free up OPD
                                physician room.
                              </Text>
                            </View>
                          </View>

                          {selectedAppointmentAction === 'noshow' ? (
                            <View style={styles.interactivePillGroup}>
                              <Text style={styles.interactiveGroupLabel}>
                                Disposition Reason:
                              </Text>
                              <View style={styles.interactiveChipsRow}>
                                {[
                                  'Patient Late / Did Not Arrive',
                                  'Patient Cancelled by Phone',
                                  'Physician Emergency Reschedule',
                                ].map((reason) => (
                                  <Pressable
                                    key={reason}
                                    style={[
                                      styles.interactiveChip,
                                      selectedCancelReason === reason &&
                                        styles.interactiveChipActive,
                                    ]}
                                    onPress={() =>
                                      setSelectedCancelReason(reason)
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.interactiveChipText,
                                        selectedCancelReason === reason &&
                                          styles.interactiveChipTextActive,
                                      ]}
                                    >
                                      {reason}
                                    </Text>
                                  </Pressable>
                                ))}
                              </View>
                            </View>
                          ) : null}
                        </Pressable>
                      </>
                    )}
                  </View>
                ) : (
                  /* DIAGNOSTIC BOOKING */
                  <View style={styles.procedureOptionsGroup}>
                    <Text style={styles.optionsLabel}>
                      Select Sample Collection Mode:
                    </Text>

                    <View style={styles.diagnosticModeRow}>
                      <Pressable
                        style={[
                          styles.modeBtn,
                          collectionMode === 'home' && styles.modeBtnActive,
                        ]}
                        onPress={() => setCollectionMode('home')}
                      >
                        <Text
                          style={[
                            styles.modeBtnText,
                            collectionMode === 'home' &&
                              styles.modeBtnTextActive,
                          ]}
                        >
                          Home Collection
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[
                          styles.modeBtn,
                          collectionMode === 'hospital' &&
                            styles.modeBtnActive,
                        ]}
                        onPress={() => setCollectionMode('hospital')}
                      >
                        <Text
                          style={[
                            styles.modeBtnText,
                            collectionMode === 'hospital' &&
                              styles.modeBtnTextActive,
                          ]}
                        >
                          Hospital Central Lab
                        </Text>
                      </Pressable>
                    </View>

                    <Text
                      style={[styles.optionsLabel, { marginTop: spacing.md }]}
                    >
                      Preferred Slot:
                    </Text>
                    <View style={styles.wardChipsRow}>
                      {[
                        'Tomorrow 08:30 AM',
                        'Tomorrow 11:00 AM',
                        'Tomorrow 02:30 PM',
                      ].map((slot) => (
                        <Pressable
                          key={slot}
                          style={[
                            styles.wardChip,
                            selectedDiagnosticSlot === slot &&
                              styles.wardChipActive,
                          ]}
                          onPress={() => setSelectedDiagnosticSlot(slot)}
                        >
                          <Text
                            style={[
                              styles.wardChipText,
                              selectedDiagnosticSlot === slot &&
                                styles.wardChipTextActive,
                            ]}
                          >
                            {slot}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                {/* Confirm Action Button */}
                <View style={styles.modalActionButtons}>
                  <Button
                    label={
                      isSubmitting
                        ? 'Executing Procedure...'
                        : isInpatient
                        ? currentRole === 'patient'
                          ? 'Acknowledge Care Details'
                          : selectedProcedure === 'discharge'
                          ? 'Confirm & Authorize Discharge'
                          : 'Execute Patient Transfer'
                        : isAppointment
                        ? 'Confirm Status Update'
                        : 'Confirm Diagnostic Slot'
                    }
                    variant="primary"
                    disabled={isSubmitting}
                    onPress={handleExecuteProcedure}
                    style={styles.modalPrimaryBtn}
                  />
                  <Button
                    label="Cancel"
                    variant="secondary"
                    onPress={() => setModalVisible(false)}
                    style={styles.modalSecondaryBtn}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md + 4,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface1,
    ...elevation.level1,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  circleBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    gap: 6,
  },
  backLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  categoryPill: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingTop: spacing.md,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  imageContainer: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    height: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  mainBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md + 2,
  },
  titleSection: {
    marginBottom: spacing.md + 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  descriptionCard: {
    backgroundColor: colors.surface1,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md + 4,
    marginBottom: spacing.md,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bodyDescription: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 22,
  },
  metadataCard: {
    backgroundColor: colors.surface1,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md + 4,
    marginBottom: spacing.md,
  },
  metadataRows: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  metaKey: {
    fontSize: 13,
    color: colors.text.secondary,
    flex: 1,
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1.2,
    textAlign: 'right',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface1,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    ...elevation.level2,
  },
  bottomBarInner: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    maxHeight: '88%',
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  modalHeaderLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface2,
  },
  modalFormScroll: {
    marginTop: spacing.md,
  },
  procedureOptionsGroup: {
    marginBottom: spacing.lg,
  },
  optionsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  optionCard: {
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: colors.accent.primary,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent.primary,
  },
  optionTitleCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  optionDesc: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 3,
    lineHeight: 17,
  },
  checklistContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkItemText: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '500',
  },
  wardSelectContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
  wardSelectLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 6,
  },
  wardChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  wardChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  wardChipActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  wardChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  wardChipTextActive: {
    color: '#FFFFFF',
  },
  diagnosticModeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeBtn: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: colors.accent.primary,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  modeBtnTextActive: {
    color: colors.accent.primary,
    fontWeight: '700',
  },
  modalActionButtons: {
    width: '100%',
    gap: 10,
    marginTop: spacing.sm,
  },
  modalPrimaryBtn: {
    width: '100%',
    borderRadius: radius.md,
  },
  modalSecondaryBtn: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
  },
  confirmationBody: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  successIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  confirmedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 8,
    marginBottom: spacing.sm,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  confirmedMessage: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  receiptKey: {
    width: 125,
    flexShrink: 0,
    fontSize: 12,
    color: colors.text.secondary,
  },
  receiptVal: {
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  interactivePillGroup: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  interactiveGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  interactiveChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interactiveChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  interactiveChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: colors.accent.primary,
  },
  interactiveChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  interactiveChipTextActive: {
    color: colors.accent.primary,
    fontWeight: '700',
  },
  highlightPill: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  highlightPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
});
