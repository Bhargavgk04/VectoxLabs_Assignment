import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../navigation/types';
import { Doctor } from '../../../types';
import { getDoctorById } from '../../../services/doctorService';
import { createBooking } from '../../../services/appointmentService';
import { SlotPicker } from '../components/SlotPicker';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { Stethoscope, User, Video, ShieldCheck, ChevronLeft } from 'lucide-react-native';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';
import { useRole } from '../../../store/RoleContext';

type RouteProps = RouteProp<RootStackParamList, 'BookingSlot'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export function BookingScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { isDesktop, horizontalPadding } = useResponsive();
  const { userProfile } = useRole();
  const [doctor, setDoctor] = useState<Doctor | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientName, setPatientName] = useState(userProfile?.name || 'Elena Rostova');
  const [consultType, setConsultType] = useState<'In-Person' | 'Telehealth'>('In-Person');

  useEffect(() => {
    getDoctorById(route.params.doctorId).then(d => {
      setDoctor(d);
      if (d && d.availableDates.length > 0) {
        setSelectedDate(d.availableDates[0].date);
        if (d.availableDates[0].slots.length > 0) {
          setSelectedSlot(d.availableDates[0].slots[0]);
        }
      }
      setLoading(false);
    });
  }, [route.params.doctorId]);

  const handleConfirmBooking = async () => {
    if (!doctor || !selectedDate || !selectedSlot) return;

    setSubmitting(true);
    try {
      const appointment = await createBooking({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        patientName: patientName.trim() || 'Guest Patient',
        dateTime: `${selectedDate} at ${selectedSlot}`,
        roomNumber: consultType === 'Telehealth' ? 'Virtual Telehealth Room' : 'Clinic Suite 204',
        type: consultType,
      });

      navigation.replace('BookingConfirmation', { appointmentId: appointment.id });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.centerLoading}>
        <Text style={styles.errorText}>Doctor details unavailable.</Text>
      </View>
    );
  }

  const isReady = Boolean(selectedDate && selectedSlot && patientName.trim());

  return (
    <View style={[styles.safeArea, { paddingTop: topPadding }]}>
      {/* Top Header with Back Button */}
      <View style={[styles.topHeader, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.headerInner}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={10}
          >
            <ChevronLeft size={24} color={colors.text.primary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Book Consultation</Text>
          <View style={{ width: 48 }} />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && { alignItems: 'center' },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.centerContainer}>
          {/* Doctor Context Header */}
          <Card variant="surface1" padding="md" style={styles.doctorHeaderCard}>
            <View style={styles.doctorHeaderRow}>
              <View style={styles.doctorIcon}>
                <Stethoscope size={20} color={colors.accent.primary} />
              </View>
              <View style={styles.doctorTextCol}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>
                  {doctor.specialty} • {doctor.hospitalAffiliation}
                </Text>
              </View>
            </View>
          </Card>

          {/* Date and Slot Picker */}
          <SlotPicker
            availableDates={doctor.availableDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />

          {/* 3. Patient Name Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Patient Full Name</Text>
            <View style={styles.inputContainer}>
              <User size={18} color={colors.text.muted} style={styles.inputIcon} />
              <TextInput
                value={patientName}
                onChangeText={setPatientName}
                placeholder="Enter patient full name"
                placeholderTextColor={colors.text.muted}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* 4. Consultation Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Consultation Mode</Text>
            <View style={styles.consultTypeRow}>
              <Pressable
                onPress={() => setConsultType('In-Person')}
                style={[
                  styles.typeOption,
                  consultType === 'In-Person' ? styles.typeSelected : styles.typeUnselected,
                ]}
              >
                <Stethoscope
                  size={18}
                  color={consultType === 'In-Person' ? colors.accent.primary : colors.text.muted}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    consultType === 'In-Person' ? styles.typeLabelActive : styles.typeLabelInactive,
                  ]}
                >
                  In-Person Visit
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setConsultType('Telehealth')}
                style={[
                  styles.typeOption,
                  consultType === 'Telehealth' ? styles.typeSelected : styles.typeUnselected,
                ]}
              >
                <Video
                  size={18}
                  color={consultType === 'Telehealth' ? colors.accent.primary : colors.text.muted}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    consultType === 'Telehealth' ? styles.typeLabelActive : styles.typeLabelInactive,
                  ]}
                >
                  Telehealth Call
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Appointment Summary Box */}
          <Card variant="surface2" padding="md" style={styles.summaryCard}>
            <View style={styles.summaryTitleRow}>
              <ShieldCheck size={16} color={colors.status.stable} />
              <Text style={styles.summaryTitle}>Booking Summary</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Scheduled Time:</Text>
              <Text style={styles.summaryValue}>
                {selectedDate} at {selectedSlot || 'Select Slot'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Consultation Fee:</Text>
              <Text style={[styles.summaryValue, { color: colors.status.stable }]}>
                ₹{doctor.consultationFee}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Sticky Bottom Confirmation CTA */}
      <View style={[styles.bottomBar, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.bottomBarInner}>
          <Button
            label={submitting ? 'Confirming Appointment...' : 'Confirm & Reserve Slot'}
            onPress={handleConfirmBooking}
            disabled={!isReady || submitting}
            loading={submitting}
            size="lg"
            style={styles.confirmCTA}
          />
        </View>
      </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  topHeader: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface1,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  centerContainer: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  bottomBarInner: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  backText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 90,
  },
  doctorHeaderCard: {
    marginBottom: spacing.md,
  },
  doctorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  doctorTextCol: {
    flex: 1,
  },
  doctorName: {
    ...typography.h3,
    color: colors.text.primary,
  },
  doctorSpecialty: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    color: colors.text.primary,
    ...typography.body,
  },
  consultTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  typeUnselected: {
    backgroundColor: colors.surface1,
    borderColor: colors.borderSubtle,
  },
  typeSelected: {
    backgroundColor: colors.accent.muted,
    borderColor: colors.accent.primary,
  },
  typeLabel: {
    ...typography.labelBold,
    marginLeft: spacing.xs + 2,
    fontSize: 13,
  },
  typeLabelActive: {
    color: colors.accent.primary,
  },
  typeLabelInactive: {
    color: colors.text.secondary,
  },
  summaryCard: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryTitle: {
    ...typography.labelBold,
    color: colors.status.stable,
    marginLeft: spacing.xs,
    fontSize: 13,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  summaryValue: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface1,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    padding: spacing.md,
  },
  confirmCTA: {
    width: '100%',
  },
  centerLoading: {
    flex: 1,
    backgroundColor: colors.canvas,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.status.warning,
  },
});
