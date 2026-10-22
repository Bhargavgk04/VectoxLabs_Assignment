import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { Appointment } from '../../../types';
import { getAppointments } from '../../../services/appointmentService';
import { RecentAppointmentsList } from '../components/RecentAppointmentsList';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Chip } from '../../../components/ui/Chip';
import { CardSkeleton } from '../../../components/ui/CardSkeleton';
import { useDebounce } from '../../../hooks/useDebounce';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { RootStackParamList } from '../../../navigation/types';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';
import { useRole } from '../../../store/RoleContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const DEFAULT_STATUS_FILTERS = ['All', 'Scheduled', 'In-Progress', 'Completed', 'Cancelled'] as const;

export function AppointmentsScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const navigation = useNavigation<NavProp>();
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  const { currentRole, userProfile } = useRole();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const debouncedSearch = useDebounce(search, 200);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const roleFilters = useMemo(() => {
    if (currentRole === 'patient') {
      return ['All', 'My Consultations', 'Scheduled', 'In-Progress', 'Completed'];
    }
    if (currentRole === 'doctor') {
      return ['All', 'My Schedule', 'Scheduled', 'In-Progress', 'Completed'];
    }
    return [...DEFAULT_STATUS_FILTERS];
  }, [currentRole]);

  const filteredAppointments = useMemo(() => {
    const patientNameLower = (userProfile?.name || 'rajesh patel').toLowerCase();
    const doctorLastName = (userProfile?.name || 'sharma').toLowerCase().replace('dr.', '').trim();

    return appointments.filter((a) => {
      if (activeStatus === 'My Consultations') {
        if (!a.patientName.toLowerCase().includes(patientNameLower) && !a.patientName.toLowerCase().includes('rajesh')) {
          return false;
        }
      } else if (activeStatus === 'My Schedule') {
        if (!a.doctorName.toLowerCase().includes(doctorLastName) && !a.doctorName.toLowerCase().includes('jenkins')) {
          return false;
        }
      } else if (activeStatus !== 'All') {
        if (a.status.toLowerCase() !== activeStatus.toLowerCase()) {
          return false;
        }
      }

      if (!debouncedSearch.trim()) return true;
      const q = debouncedSearch.toLowerCase().trim();
      return (
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.specialty.toLowerCase().includes(q) ||
        a.roomNumber.toLowerCase().includes(q)
      );
    });
  }, [appointments, activeStatus, debouncedSearch, userProfile]);

  const counts: Record<string, number> = useMemo(() => {
    const patientNameLower = (userProfile?.name || 'rajesh patel').toLowerCase();
    const doctorLastName = (userProfile?.name || 'sharma').toLowerCase().replace('dr.', '').trim();
    return {
      All: appointments.length,
      'My Consultations': appointments.filter(a =>
        a.patientName.toLowerCase().includes(patientNameLower) || a.patientName.toLowerCase().includes('rajesh')
      ).length,
      'My Schedule': appointments.filter(a =>
        a.doctorName.toLowerCase().includes(doctorLastName) || a.doctorName.toLowerCase().includes('jenkins')
      ).length,
      Scheduled: appointments.filter((a) => a.status === 'Scheduled').length,
      'In-Progress': appointments.filter((a) => a.status === 'In-Progress').length,
      Completed: appointments.filter((a) => a.status === 'Completed').length,
      Cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
    };
  }, [appointments, userProfile]);

  const handleSelectAppointment = useCallback(
    (appointment: Appointment) => {
      navigation.navigate('DetailView', {
        id: appointment.id,
        category: 'Clinical Appointment Record',
        title: `${appointment.patientName} (${appointment.type})`,
        subtitle: `${appointment.dateTime} • ${appointment.roomNumber}`,
        description: appointment.reason || 'Clinical outpatient consult scheduled at Vectox Hospital.',
        metadata: {
          'Attending Physician': appointment.doctorName,
          'Department & Specialty': appointment.specialty,
          'Appointment Status': appointment.status,
          'Clinic Room / Location': appointment.roomNumber,
          'Consultation Mode': appointment.type,
          'Patient Demographics': `${appointment.patientAge}y, Gender: ${appointment.patientGender}`,
        },
      });
    },
    [navigation]
  );

  const handleBack = useCallback(() => {
    const state = navigation.getState();
    const routes = state?.routes || [];
    const currentIndex = state?.index ?? routes.length - 1;
    const previousRoute = currentIndex > 0 ? routes[currentIndex - 1]?.name : null;

    if (previousRoute === 'BookingConfirmation' || previousRoute === 'BookingSlot') {
      if (currentRole === 'doctor') {
        navigation.reset({ index: 0, routes: [{ name: 'DoctorTabs' }] });
      } else if (currentRole === 'staff') {
        navigation.reset({ index: 0, routes: [{ name: 'StaffTabs' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'PatientTabs' }] });
      }
      return;
    }

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
  }, [navigation, currentRole]);

  useEffect(() => {
    const onBackPress = () => {
      const state = navigation.getState();
      const routes = state?.routes || [];
      const currentIndex = state?.index ?? routes.length - 1;
      const previousRoute = currentIndex > 0 ? routes[currentIndex - 1]?.name : null;

      if (previousRoute === 'BookingConfirmation' || previousRoute === 'BookingSlot') {
        handleBack();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [handleBack, navigation]);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Top Header */}
      <View style={[styles.topHeader, { paddingHorizontal: horizontalPadding }]}>
        <View style={[styles.headerInner, { maxWidth: containerMaxWidth }]}>
          <View style={styles.headerLeft}>
            {navigation.canGoBack() ? (
              <Pressable onPress={handleBack} style={styles.backButton} hitSlop={10}>
                <ChevronLeft size={22} color={colors.text.primary} />
              </Pressable>
            ) : null}
            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {currentRole === 'patient' ? 'My Consultations' : 'Appointments'}
              </Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {currentRole === 'patient'
                  ? 'Upcoming & Recent OPD Visits'
                  : 'Hospital OPD & Consult Schedule'}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => navigation.navigate('DoctorDirectory')}
            style={({ pressed }) => [
              styles.bookButton,
              pressed ? styles.bookButtonPressed : null,
            ]}
            hitSlop={8}
          >
            <Plus size={15} color={colors.text.inverse} />
            <Text style={styles.bookButtonText}>
              {currentRole === 'patient' ? 'Book' : 'New Visit'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Search Bar & Status Chips */}
      <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
        <View style={{ maxWidth: containerMaxWidth, width: '100%', alignSelf: 'center' }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search appointments..."
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {roleFilters.map((status) => (
              <Chip
                key={status}
                label={status}
                selected={activeStatus === status}
                count={counts[status]}
                onPress={() => setActiveStatus(status)}
              />
            ))}
            {(activeStatus !== 'All' || search.trim() !== '') && (
              <Chip
                label="Reset"
                selected={false}
                onPress={() => {
                  setActiveStatus('All');
                  setSearch('');
                }}
              />
            )}
          </ScrollView>
        </View>
      </View>

      {loading ? (
        <View style={{ maxWidth: containerMaxWidth, width: '100%', alignSelf: 'center', flex: 1 }}>
          <CardSkeleton count={4} type="appointment" />
        </View>
      ) : (
        <View style={{ maxWidth: containerMaxWidth, width: '100%', alignSelf: 'center', flex: 1 }}>
          <RecentAppointmentsList
            appointments={filteredAppointments}
            onSelectAppointment={handleSelectAppointment}
            onRefresh={fetchAppointments}
            refreshing={loading}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  topHeader: {
    paddingVertical: 14,
    backgroundColor: colors.surface1,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    ...elevation.level1,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: spacing.sm,
  },
  headerTextCol: {
    flex: 1,
  },
  backButton: {
    padding: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface2,
    marginRight: 2,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent.primary,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: radius.full,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  bookButtonPressed: {
    backgroundColor: colors.accent.hover,
    transform: [{ scale: 0.97 }],
  },
  bookButtonText: {
    fontSize: 12,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chipsContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
