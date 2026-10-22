import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../navigation/types';
import { MetricCard } from '../components/MetricCard';
import { QuickActions } from '../components/QuickActions';
import { RecentAppointmentsList } from '../components/RecentAppointmentsList';
import { Appointment } from '../../../types';
import { getRecentAppointments } from '../../../services/appointmentService';
import { useRole } from '../../../store/RoleContext';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';
import { AppDialog } from '../../../components/ui/AppDialog';
import { LogOut, Activity } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function DashboardScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const navigation = useNavigation<NavigationProp>();
  const { logout, userProfile, currentRole } = useRole();
  const { isDesktop, containerMaxWidth, horizontalPadding } = useResponsive();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await getRecentAppointments(8);
      setAppointments(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSignOut = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
    setSignOutModalVisible(true);
  };

  const handleSelectAppointment = (appointment: Appointment) => {
    navigation.navigate('DetailView', {
      id: appointment.id,
      category: 'Appointment Record',
      title: `${appointment.patientName} (${appointment.type})`,
      subtitle: `${appointment.dateTime} • ${appointment.roomNumber}`,
      description: appointment.reason || 'Clinical consultation scheduled.',
      metadata: {
        'Attending Physician': appointment.doctorName,
        Specialty: appointment.specialty,
        Status: appointment.status,
        'Patient Demographics': `${appointment.patientAge}y, ${appointment.patientGender}`,
      },
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Clinician & Ward Telemetry Status Banner */}
      <View style={[styles.statusBanner, elevation.level1]}>
        <View style={styles.clinicianCol}>
          <Text style={styles.wardLabel}>Clinical Operations Center</Text>
          <Text style={styles.clinicianName}>
            {userProfile?.name || (currentRole === 'staff' ? 'Priya Nair, RN' : 'Dr. Aaron Vance, MD')}
          </Text>
          <Text style={styles.shiftDetails} numberOfLines={1}>
            {userProfile?.title
              ? `${userProfile.title} • Active Session`
              : currentRole === 'staff'
              ? 'Inpatient Operations • Ward 4B'
              : 'Acute Care Unit • Ward 4B'}
          </Text>
        </View>
        <View style={styles.activeShiftBadge}>
          <View style={styles.telemetryPulse} />
          <Text style={styles.activeShiftText}>Shift Active</Text>
        </View>
      </View>

      {/* Core Hospital Metric Telemetry */}
      <Text style={styles.metricsHeading}>Live Clinical Metrics</Text>
      <View style={[styles.metricsGrid, isDesktop && styles.metricsGridDesktop]}>
        {isDesktop ? (
          <View style={styles.metricsRowDesktop}>
            <View style={styles.metricColDesktop}>
              <MetricCard
                label="Inpatient Count"
                value="26"
                category="patients"
                onPress={() => navigation.navigate('PatientsList')}
              />
            </View>
            <View style={styles.metricColDesktop}>
              <MetricCard
                label="Appointments"
                value="32"
                category="appointments"
                onPress={() => navigation.navigate('AppointmentsList')}
              />
            </View>
            <View style={styles.metricColDesktop}>
              <MetricCard
                label="On-Duty Doctors"
                value="13 / 15"
                category="doctors"
                onPress={() => navigation.navigate('DoctorDirectory')}
              />
            </View>
            <View style={styles.metricColDesktop}>
              <MetricCard
                label="Pending Tasks"
                value="04"
                category="tasks"
                onPress={() => navigation.navigate('FollowUpQueue')}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.metricsRow}>
              <MetricCard
                label="Inpatient Count"
                value="26"
                category="patients"
                onPress={() => navigation.navigate('PatientsList')}
              />
              <MetricCard
                label="Appointments"
                value="32"
                category="appointments"
                onPress={() => navigation.navigate('AppointmentsList')}
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                label="On-Duty Doctors"
                value="13 / 15"
                category="doctors"
                onPress={() => navigation.navigate('DoctorDirectory')}
              />
              <MetricCard
                label="Pending Tasks"
                value="04"
                category="tasks"
                onPress={() => navigation.navigate('FollowUpQueue')}
              />
            </View>
          </>
        )}
      </View>

      {/* Quick Action Navigation Grid (Q1-02 & Q1-03) */}
      <QuickActions
        onPressPatients={() => navigation.navigate('PatientsList')}
        onPressDoctors={() => navigation.navigate('DoctorDirectory')}
        onPressAppointments={() => navigation.navigate('AppointmentsList')}
        onPressDepartments={() => navigation.navigate('DepartmentsList')}
      />

      {/* Recent Appointments Header */}
      <View style={styles.recentHeaderRow}>
        <Text style={styles.recentTitle} numberOfLines={1}>
          Recent Consultations & Schedule
        </Text>
        <View style={styles.recentCountPill}>
          <Text style={styles.recentCount}>{appointments.length} Total</Text>
        </View>
      </View>
    </View>
  );

  const getRoleLabel = () => {
    if (currentRole === 'doctor') return 'Doctor Portal';
    if (currentRole === 'staff') return 'Staff Portal';
    return 'Patient Portal';
  };

  return (
    <View style={[styles.safeArea, { paddingTop: topPadding }]}>
      <StatusBar style="dark" />

      {/* Top App Bar with Guaranteed Safe Clearance */}
      <View style={styles.topBar}>
        <View style={[styles.topBarInner, { maxWidth: containerMaxWidth }]}>
          <View style={styles.brandRow}>
            <View style={styles.brandIconWrap}>
              <Activity size={16} color="#0284C7" />
            </View>
            <View>
              <Text style={styles.brandTitle}>Vectox Central</Text>
            </View>
            <View style={styles.staffTag}>
              <Text style={styles.staffTagText}>{getRoleLabel()}</Text>
            </View>
          </View>

          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.logoutChip,
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
            hitSlop={10}
            accessibilityLabel="Sign out of active session"
          >
            <LogOut size={13} color={colors.status.critical} />
            <Text style={styles.logoutChipText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
        </View>
      ) : (
        <View
          style={[
            styles.listContainer,
            { maxWidth: containerMaxWidth, paddingHorizontal: horizontalPadding },
          ]}
        >
          <RecentAppointmentsList
            appointments={appointments}
            headerComponent={renderHeader()}
            onSelectAppointment={handleSelectAppointment}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        </View>
      )}

      {/* In-App Custom Dialog for Sign Out (replaces native Alert.alert) */}
      <AppDialog
        visible={signOutModalVisible}
        title="Sign Out Session"
        description="Are you sure you want to end your active clinical session? All verified audit records have been saved."
        type="critical"
        confirmLabel="Sign Out"
        cancelLabel="Stay Signed In"
        confirmVariant="critical"
        onConfirm={() => {
          setSignOutModalVisible(false);
          logout();
        }}
        onCancel={() => setSignOutModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  topBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  topBarInner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 2,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  staffTag: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  staffTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  logoutChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  logoutChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.status.critical,
  },
  headerContent: {
    paddingTop: spacing.md,
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface1,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: 20,
  },
  clinicianCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  wardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent.primary,
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  clinicianName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  shiftDetails: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.secondary,
    marginTop: 2,
  },
  activeShiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  telemetryPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  activeShiftText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
  },
  metricsHeading: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
  metricsGrid: {
    marginBottom: spacing.xs,
  },
  metricsGridDesktop: {
    marginBottom: spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
  },
  metricsRowDesktop: {
    flexDirection: 'row',
    gap: 16,
  },
  metricColDesktop: {
    flex: 1,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    gap: 8,
  },
  recentTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
    flex: 1,
    marginRight: spacing.xs,
  },
  recentCountPill: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    flexShrink: 0,
  },
  recentCount: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
    fontSize: 11,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
