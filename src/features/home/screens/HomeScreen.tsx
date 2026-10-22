import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Hospital, ShieldCheck, Search, ArrowRight, Stethoscope, LogOut } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { useRole } from '../../../store/RoleContext';
import { SearchBar } from '../../../components/ui/SearchBar';
import { AppDialog } from '../../../components/ui/AppDialog';
import { PromoHeroBanner } from '../components/PromoHeroBanner';
import { CarouselSection } from '../components/CarouselSection';
import { DepartmentCarouselCard } from '../components/DepartmentCarouselCard';
import { DoctorCarouselCard } from '../components/DoctorCarouselCard';
import { DiagnosticCarouselCard } from '../components/DiagnosticCarouselCard';
import { FacilityCarouselCard } from '../components/FacilityCarouselCard';
import { getDepartments } from '../../../services/departmentService';
import { getDoctors } from '../../../services/doctorService';
import {
  getDiagnosticServices,
  getHospitalFacilities,
  getHealthPackages,
} from '../../../services/facilityService';
import {
  Department,
  Doctor,
  DiagnosticService,
  HospitalFacility,
  HealthPackage,
} from '../../../types';
import {
  PatientTabParamList,
  RootStackParamList,
} from '../../../navigation/types';

import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';

type Props = CompositeScreenProps<
  BottomTabScreenProps<PatientTabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const { logout } = useRole();
  const { containerMaxWidth, horizontalPadding } = useResponsive();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticService[]>([]);
  const [facilities, setFacilities] = useState<HospitalFacility[]>([]);
  const [healthPackages, setHealthPackages] = useState<HealthPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [deptRes, docRes, diagRes, facRes, pkgRes] = await Promise.all([
        getDepartments(),
        getDoctors(),
        getDiagnosticServices(),
        getHospitalFacilities(),
        getHealthPackages(),
      ]);
      setDepartments(deptRes);
      setDoctors(docRes);
      setDiagnostics(diagRes);
      setFacilities(facRes);
      setHealthPackages(pkgRes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleViewAll = (
    title: string,
    category: 'departments' | 'doctors' | 'diagnostics' | 'facilities'
  ) => {
    navigation.navigate('ViewAll', { title, category });
  };

  const handleOpenDepartment = useCallback(
    (dept: Department) => {
      navigation.navigate('DetailView', {
        id: dept.id,
        category: 'Hospital Clinical Department',
        title: dept.name,
        subtitle: `${dept.code} • ${dept.floor}`,
        imageUrl: dept.imageUrl,
        description: dept.description,
        metadata: {
          'Head Clinician': dept.headDoctor,
          'Active Doctors': dept.activeDoctorsCount,
          'Floor Location': dept.floor,
          'Department Code': dept.code,
        },
      });
    },
    [navigation]
  );

  const handleOpenDoctor = useCallback(
    (doctor: Doctor) => {
      navigation.navigate('DoctorProfile', { doctorId: doctor.id });
    },
    [navigation]
  );

  const handleOpenDiagnostic = useCallback(
    (diag: DiagnosticService) => {
      navigation.navigate('DetailView', {
        id: diag.id,
        category: 'Diagnostic Service',
        title: diag.name,
        subtitle: `${diag.category.toUpperCase()} • ${diag.turnaroundTime}`,
        imageUrl: diag.imageUrl,
        description: diag.description,
        metadata: {
          Category: diag.category,
          'Turnaround Time': diag.turnaroundTime,
          Price: `₹${diag.price}`,
          Preparation: diag.preparationNotes,
        },
      });
    },
    [navigation]
  );

  const handleOpenFacility = useCallback(
    (facility: HospitalFacility) => {
      navigation.navigate('DetailView', {
        id: facility.id,
        category: 'Hospital Facility',
        title: facility.name,
        subtitle: facility.location,
        imageUrl: facility.imageUrl,
        description: facility.description,
        metadata: {
          Availability: facility.availability,
          'Location Wing': facility.location,
          Capacity: facility.capacity,
        },
      });
    },
    [navigation]
  );

  const handleOpenPackage = useCallback(
    (pkg: HealthPackage) => {
      navigation.navigate('DetailView', {
        id: pkg.id,
        category: 'Health Checkup Package',
        title: pkg.title,
        subtitle: `${pkg.includesTestsCount} Tests Included • ${pkg.badge}`,
        imageUrl: pkg.imageUrl,
        description: pkg.description,
        metadata: {
          'Total Tests': pkg.includesTestsCount,
          'Discounted Price': `₹${pkg.discountedPrice}`,
          'Original Price': `₹${pkg.originalPrice}`,
          'Key Screenings': pkg.features.join(', '),
        },
      });
    },
    [navigation]
  );

  // Live Instant Search Matches
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matchedDocs = doctors.filter(
      (d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
    );
    const matchedDepts = departments.filter(
      (d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)
    );
    const matchedDiags = diagnostics.filter(
      (d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    );

    return {
      docs: matchedDocs,
      depts: matchedDepts,
      diags: matchedDiags,
      total: matchedDocs.length + matchedDepts.length + matchedDiags.length,
    };
  }, [searchQuery, doctors, departments, diagnostics]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.canvas, paddingTop: topPadding },
      ]}
      testID="home-screen"
    >
      {/* Top Clinical Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface1,
            borderBottomColor: colors.borderSubtle,
            paddingHorizontal: horizontalPadding,
            paddingVertical: spacing.sm,
          },
        ]}
      >
        <View style={[styles.headerInner, { maxWidth: containerMaxWidth }]}>
          <View style={styles.brandingRow}>
            <View
              style={[
                styles.logoBox,
                { backgroundColor: colors.accent.muted, borderRadius: radius.md },
              ]}
            >
              <Hospital size={22} color={colors.accent.primary} />
            </View>
            <View style={styles.titleWrap}>
              <Text
                style={[
                  typography.caption,
                  { color: colors.accent.primary, fontWeight: '700', letterSpacing: 0.3 },
                ]}
              >
                Vectox Healthcare
              </Text>
              <Text
                style={[
                  typography.h3,
                  { color: colors.text.primary, fontWeight: '700' },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Main Campus
              </Text>
            </View>
          </View>

            {/* Hospital Accreditation Badge & Sign Out */}
            <View style={styles.headerRightActions}>
              <View
                style={[
                  styles.rolePill,
                  { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
                ]}
              >
                <ShieldCheck size={12} color={colors.status.stable} />
                <Text
                  style={[
                    typography.caption,
                    { color: colors.status.stable, fontWeight: '700', marginLeft: 3, fontSize: 10 },
                  ]}
                >
                  NABH
                </Text>
              </View>

            <Pressable
              onPress={() => setSignOutDialogOpen(true)}
              style={({ pressed }) => [
                styles.logoutBtn,
                pressed ? { opacity: 0.8, transform: [{ scale: 0.96 }] } : null,
              ]}
              hitSlop={10}
              accessibilityLabel="Sign out"
            >
              <LogOut size={13} color={colors.status.critical} />
              <Text style={styles.logoutBtnText}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80, alignItems: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={colors.accent.primary}
          />
        }
      >
        <View style={[styles.contentWrapper, { maxWidth: containerMaxWidth }]}>
          {/* Search Bar */}
          <View style={[styles.searchContainer, { paddingHorizontal: spacing.md, marginTop: spacing.md }]}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search doctors, departments, diagnostic tests..."
            />
          </View>

        {/* Live Instant Search Dropdown Results */}
        {searchResults ? (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsHeader}>
              SEARCH RESULTS ({searchResults.total})
            </Text>

            {searchResults.total === 0 ? (
              <View style={styles.searchEmptyCard}>
                <Text style={styles.searchEmptyText}>
                  No doctors or tests matched &ldquo;{searchQuery}&rdquo;.
                </Text>
              </View>
            ) : null}

            {/* Matching Doctors */}
            {searchResults.docs.slice(0, 3).map((doc) => (
              <Pressable
                key={doc.id}
                onPress={() => handleOpenDoctor(doc)}
                style={({ pressed }) => [
                  styles.searchResultRow,
                  pressed ? styles.searchResultRowPressed : null,
                ]}
              >
                <Stethoscope size={18} color={colors.accent.primary} />
                <View style={styles.searchResultTextWrap}>
                  <Text style={styles.searchResultTitle}>{doc.name}</Text>
                  <Text style={styles.searchResultSubtitle}>{doc.specialty} • ₹{doc.consultationFee}</Text>
                </View>
                <ArrowRight size={16} color={colors.text.muted} />
              </Pressable>
            ))}

            {/* Matching Departments */}
            {searchResults.depts.slice(0, 3).map((dept) => (
              <Pressable
                key={dept.id}
                onPress={() => handleOpenDepartment(dept)}
                style={({ pressed }) => [
                  styles.searchResultRow,
                  pressed ? styles.searchResultRowPressed : null,
                ]}
              >
                <Hospital size={18} color={colors.status.info} />
                <View style={styles.searchResultTextWrap}>
                  <Text style={styles.searchResultTitle}>{dept.name} ({dept.code})</Text>
                  <Text style={styles.searchResultSubtitle}>{dept.floor} • {dept.activeDoctorsCount} Specialists</Text>
                </View>
                <ArrowRight size={16} color={colors.text.muted} />
              </Pressable>
            ))}

            {/* Matching Diagnostics */}
            {searchResults.diags.slice(0, 3).map((diag) => (
              <Pressable
                key={diag.id}
                onPress={() => handleOpenDiagnostic(diag)}
                style={({ pressed }) => [
                  styles.searchResultRow,
                  pressed ? styles.searchResultRowPressed : null,
                ]}
              >
                <Search size={18} color={colors.status.stable} />
                <View style={styles.searchResultTextWrap}>
                  <Text style={styles.searchResultTitle}>{diag.name}</Text>
                  <Text style={styles.searchResultSubtitle}>{diag.category} • ₹{diag.price}</Text>
                </View>
                <ArrowRight size={16} color={colors.text.muted} />
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* Q4 Promotional Hero Banner for Health Checkup Package */}
        <PromoHeroBanner
          packageData={healthPackages[0]}
          onPress={() => healthPackages[0] && handleOpenPackage(healthPackages[0])}
        />

        {/* Section 1: Clinical Departments */}
        <CarouselSection
          title="Hospital Departments"
          subtitle="Specialized inpatient and surgical wings"
          data={departments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DepartmentCarouselCard
              department={item}
              onPress={handleOpenDepartment}
            />
          )}
          onViewAll={() => handleViewAll('Clinical Departments', 'departments')}
          testID="carousel-departments"
        />

        {/* Section 2: Find a Specialist Doctor */}
        <CarouselSection
          title="Find a Doctor"
          subtitle="Top rated consulting physicians available today"
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DoctorCarouselCard
              doctor={item}
              onPress={handleOpenDoctor}
            />
          )}
          onViewAll={() => handleViewAll('Consulting Doctors', 'doctors')}
          testID="carousel-doctors"
        />

        {/* Section 3: Diagnostic Services */}
        <CarouselSection
          title="Diagnostic Services"
          subtitle="Advanced imaging, pathology & ECG diagnostics"
          data={diagnostics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DiagnosticCarouselCard
              service={item}
              onPress={handleOpenDiagnostic}
            />
          )}
          onViewAll={() => handleViewAll('Diagnostic Services', 'diagnostics')}
          testID="carousel-diagnostics"
        />

        {/* Section 4: Hospital Facilities */}
        <CarouselSection
          title="Campus Facilities"
          subtitle="24/7 Emergency trauma, ICU & modular suites"
          data={facilities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FacilityCarouselCard
              facility={item}
              onPress={handleOpenFacility}
            />
          )}
          onViewAll={() => handleViewAll('Hospital Facilities', 'facilities')}
          testID="carousel-facilities"
        />
        </View>
      </ScrollView>

      {/* Safety Sign-Out Confirmation Dialog */}
      <AppDialog
        visible={signOutDialogOpen}
        title="Confirm Sign Out"
        description="Are you sure you want to end your active session in Vectox Hospital?"
        type="critical"
        confirmLabel="Sign Out"
        cancelLabel="Stay in Campus"
        confirmVariant="critical"
        onConfirm={() => {
          setSignOutDialogOpen(false);
          logout();
        }}
        onCancel={() => setSignOutDialogOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    ...elevation.level1,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  contentWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  logoBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  titleWrap: {
    marginLeft: 10,
    flex: 1,
    flexShrink: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.criticalBg,
    borderColor: colors.status.criticalBorder,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.full,
    gap: 4,
  },
  logoutBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.status.critical,
  },
  scrollContent: {},
  searchContainer: {},
  searchResultsContainer: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.surface1,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...elevation.level2,
  },
  searchResultsHeader: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginBottom: spacing.xs,
    letterSpacing: 0.8,
  },
  searchEmptyCard: {
    paddingVertical: spacing.sm,
  },
  searchEmptyText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  searchResultRowPressed: {
    backgroundColor: colors.surface2,
  },
  searchResultTextWrap: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  searchResultTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  searchResultSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 1,
  },
});
