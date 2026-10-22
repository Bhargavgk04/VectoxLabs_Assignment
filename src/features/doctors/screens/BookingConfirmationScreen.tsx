import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, BackHandler } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../navigation/types';
import { Appointment } from '../../../types';
import { getAppointmentById } from '../../../services/appointmentService';
import { useRole } from '../../../store/RoleContext';
import { useToast } from '../../../context/ToastContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { CheckCircle2, Calendar, MapPin, User, Stethoscope, ArrowLeft } from 'lucide-react-native';
import { getSafeTopPadding } from '../../../utils/safeArea';

type RouteProps = RouteProp<RootStackParamList, 'BookingConfirmation'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export function BookingConfirmationScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 8);
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { currentRole } = useRole();
  const { showToast } = useToast();
  const [appointment, setAppointment] = useState<Appointment | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointmentById(route.params.appointmentId).then(a => {
      setAppointment(a);
      setLoading(false);
      if (a) {
        showToast({
          message: `Consultation reserved with ${a.doctorName} (${a.dateTime}).`,
          type: 'success',
          durationMs: 4000,
        });
      }
    });
  }, [route.params.appointmentId, showToast]);

  const handleReturnHome = useCallback(() => {
    // Reset navigation stack to eliminate confirmation and booking screens from history
    if (currentRole === 'doctor') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'DoctorTabs', params: { screen: 'TodayTab' } }],
      });
    } else if (currentRole === 'staff') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'StaffTabs', params: { screen: 'DashboardTab' } }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'PatientTabs', params: { screen: 'HomeTab' } }],
      });
    }
  }, [navigation, currentRole]);

  const handleViewConsultations = useCallback(() => {
    // Reset stack directly to visits/schedule tab so pressing back does not return to this confirmation screen
    if (currentRole === 'doctor') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'DoctorTabs', params: { screen: 'FollowUpsTab' } }],
      });
    } else if (currentRole === 'staff') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'StaffTabs', params: { screen: 'AppointmentsTab' } }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'PatientTabs', params: { screen: 'AppointmentsTab' } }],
      });
    }
  }, [navigation, currentRole]);

  // Intercept Android hardware back button: prevent returning to booking slot / doctor screen
  useEffect(() => {
    const onBackPress = () => {
      handleReturnHome();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [handleReturnHome]);

  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.safeArea, { paddingTop: topPadding }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + spacing.xxl,
            maxWidth: 540,
            width: '100%',
            alignSelf: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Success Badge */}
        <View style={styles.successIconCircle}>
          <CheckCircle2 size={56} color={colors.status.stable} />
        </View>

        <Text style={styles.confirmationTitle}>Appointment Reserved</Text>
        <Text style={styles.confirmationSubtitle}>
          Your clinical consultation has been confirmed in the Vectox Hospital telemetry schedule.
        </Text>

        {appointment && (
          <Card variant="surface1" padding="lg" style={styles.detailsCard}>
            <View style={styles.idRow}>
              <Text style={styles.idLabel}>Booking Reference</Text>
              <Text style={styles.idValue}>{appointment.id.toUpperCase()}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Stethoscope size={18} color={colors.accent.primary} style={styles.rowIcon} />
              <View style={styles.rowCol}>
                <Text style={styles.detailTitle}>{appointment.doctorName}</Text>
                <Text style={styles.detailSub}>{appointment.specialty}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Calendar size={18} color={colors.status.info} style={styles.rowIcon} />
              <View style={styles.rowCol}>
                <Text style={styles.detailTitle}>{appointment.dateTime}</Text>
                <Text style={styles.detailSub}>{appointment.type} Consultation</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <User size={18} color={colors.text.secondary} style={styles.rowIcon} />
              <View style={styles.rowCol}>
                <Text style={styles.detailTitle}>{appointment.patientName}</Text>
                <Text style={styles.detailSub}>Registered Patient</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MapPin size={18} color={colors.status.warning} style={styles.rowIcon} />
              <View style={styles.rowCol}>
                <Text style={styles.detailTitle}>{appointment.roomNumber}</Text>
                <Text style={styles.detailSub}>Please check in 15 mins prior</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Action CTAs */}
        <View style={styles.actionsContainer}>
          <Button
            label={currentRole === 'patient' ? 'View My Consultations' : 'View Hospital Schedule'}
            onPress={handleViewConsultations}
            variant="primary"
            size="md"
            style={styles.actionBtn}
          />
          <Button
            label={currentRole === 'patient' ? 'Return to Home Campus' : 'Return to Dashboard'}
            onPress={handleReturnHome}
            variant="secondary"
            size="md"
            icon={<ArrowLeft size={16} color={colors.text.primary} />}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flexGrow: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.status.stableBg,
    borderWidth: 1,
    borderColor: colors.status.stableBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  confirmationTitle: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    fontSize: 22,
  },
  confirmationSubtitle: {
    ...typography.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    lineHeight: 18,
    maxWidth: 320,
  },
  detailsCard: {
    width: '100%',
    marginBottom: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: spacing.lg,
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  idLabel: {
    ...typography.caption,
    color: colors.text.muted,
    letterSpacing: 0.8,
  },
  idValue: {
    ...typography.labelBold,
    color: colors.accent.primary,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  rowIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  rowCol: {
    flex: 1,
  },
  detailTitle: {
    ...typography.labelBold,
    color: colors.text.primary,
    fontSize: 14,
  },
  detailSub: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    marginBottom: spacing.xs,
  },
  centerLoading: {
    flex: 1,
    backgroundColor: colors.canvas,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
