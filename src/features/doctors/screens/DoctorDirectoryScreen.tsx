import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../navigation/types';
import { Doctor } from '../../../types';
import { getDoctors } from '../../../services/doctorService';
import { DoctorCard } from '../components/DoctorCard';
import { DoctorFilters } from '../components/DoctorFilters';
import { useDebounce } from '../../../hooks/useDebounce';
import { useResponsive } from '../../../hooks/useResponsive';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/CardSkeleton';
import { Stethoscope, ChevronLeft } from 'lucide-react-native';
import { getSafeTopPadding } from '../../../utils/safeArea';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function DoctorDirectoryScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const navigation = useNavigation<NavProp>();
  const { isDesktop, doctorColumns, containerMaxWidth, horizontalPadding } = useResponsive();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    getDoctors().then(data => {
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  const specialties = useMemo(() => {
    const list = Array.from(new Set(doctors.map(d => d.specialty)));
    return ['All', ...list];
  }, [doctors]);

  const specialtyCounts = useMemo(() => {
    const map: Record<string, number> = { All: doctors.length };
    doctors.forEach(d => {
      map[d.specialty] = (map[d.specialty] || 0) + 1;
    });
    return map;
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch =
        debouncedSearch === '' ||
        doctor.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        doctor.hospitalAffiliation.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, debouncedSearch, selectedSpecialty]);

  const handlePressProfile = (doctor: Doctor) => {
    navigation.navigate('DoctorProfile', { doctorId: doctor.id });
  };

  const handlePressBook = (doctor: Doctor) => {
    navigation.navigate('BookingSlot', {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
    });
  };

  const renderItem = ({ item }: { item: Doctor }) => (
    <View style={{ flex: 1 / doctorColumns, padding: isDesktop ? 8 : 0 }}>
      <DoctorCard
        doctor={item}
        onPressProfile={handlePressProfile}
        onPressBook={handlePressBook}
      />
    </View>
  );

  return (
    <View style={[styles.safeArea, { paddingTop: topPadding }]}>
      {/* Top Header Bar */}
      <View style={[styles.topHeader, { paddingHorizontal: horizontalPadding }]}>
        <View style={[styles.headerInner, { maxWidth: containerMaxWidth }]}>
          <View style={styles.headerLeft}>
            {navigation.canGoBack() ? (
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                hitSlop={10}
                accessibilityLabel="Go back"
              >
                <ChevronLeft size={22} color={colors.text.primary} />
              </Pressable>
            ) : null}
            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle} numberOfLines={1}>Find a Specialist</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>Verified Medical Doctors</Text>
            </View>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{filteredDoctors.length} Available</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <View style={[styles.filtersWrap, { maxWidth: containerMaxWidth, paddingHorizontal: horizontalPadding }]}>
          <DoctorFilters
            search={search}
            onChangeSearch={setSearch}
            specialties={specialties}
            selectedSpecialty={selectedSpecialty}
            onSelectSpecialty={setSelectedSpecialty}
            specialtyCounts={specialtyCounts}
          />
        </View>

        {loading ? (
          <View style={{ maxWidth: containerMaxWidth, width: '100%', alignSelf: 'center' }}>
            <CardSkeleton count={4} type="doctor" />
          </View>
        ) : (
          <FlatList
            key={`doc-grid-${doctorColumns}`}
            numColumns={doctorColumns}
            columnWrapperStyle={doctorColumns > 1 ? { gap: spacing.md } : undefined}
            data={filteredDoctors}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              { maxWidth: containerMaxWidth, paddingHorizontal: horizontalPadding },
            ]}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            ListEmptyComponent={
              <EmptyState
                icon={<Stethoscope size={36} color={colors.text.muted} />}
                title="No Physicians Found"
                description={`No doctors matched "${search}". Try adjusting your specialty filter or clearing search.`}
                actionLabel="Clear All Filters"
                onAction={() => {
                  setSearch('');
                  setSelectedSpecialty('All');
                }}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.accent.muted,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
  },
  filtersWrap: {
    paddingTop: spacing.sm,
    width: '100%',
    alignSelf: 'center',
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    width: '100%',
    alignSelf: 'center',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
