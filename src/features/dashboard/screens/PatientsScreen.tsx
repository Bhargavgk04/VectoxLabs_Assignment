import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AlertCircle,
  Plus,
  X,
  ChevronLeft,
  UserCheck,
  Phone,
  Bed,
} from 'lucide-react-native';
import { Patient } from '../../../types';
import { getPatients, addPatient } from '../../../services/patientService';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Chip } from '../../../components/ui/Chip';
import { Button } from '../../../components/ui/Button';
import { useDebounce } from '../../../hooks/useDebounce';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { RootStackParamList } from '../../../navigation/types';
import * as Haptics from 'expo-haptics';

import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const STATUS_TABS = ['All', 'Admitted', 'Outpatient', 'Discharged'] as const;

export function PatientsScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const navigation = useNavigation<NavProp>();
  const { isDesktop, containerMaxWidth, horizontalPadding, patientColumns, cardGap } =
    useResponsive();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const debouncedSearch = useDebounce(search, 200);

  // New Admission Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'M' | 'F' | 'Other'>('M');
  const [newBloodGroup, setNewBloodGroup] = useState('O+');
  const [newRoomBed, setNewRoomBed] = useState('');
  const [newPhone, setNewPhone] = useState('+91 98201 ');
  const [newAllergies, setNewAllergies] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesStatus =
        selectedStatus === 'All' || p.status.toLowerCase() === selectedStatus.toLowerCase();
      if (!matchesStatus) return false;

      if (!debouncedSearch.trim()) return true;
      const q = debouncedSearch.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.roomBed && p.roomBed.toLowerCase().includes(q)) ||
        p.bloodGroup.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    });
  }, [patients, selectedStatus, debouncedSearch]);

  const handleOpenPatientDetail = (patient: Patient) => {
    navigation.navigate('DetailView', {
      id: patient.id,
      category: 'Inpatient Clinical Record',
      title: `${patient.name} (${patient.gender}, ${patient.age}y)`,
      subtitle: `Status: ${patient.status} • Location: ${patient.roomBed || 'Outpatient Clinic'}`,
      description: `Primary clinical case under observation at Vectox Hospital. Blood Group: ${patient.bloodGroup}. Allergies: ${patient.allergies.length > 0 ? patient.allergies.join(', ') : 'No known drug allergies'}.`,
      metadata: {
        'Medical Record ID': patient.id.toUpperCase(),
        'Bed / Room Assignment': patient.roomBed || 'Outpatient Clinic',
        'Blood Group': patient.bloodGroup,
        'Primary Contact': patient.phone,
        'Email Address': patient.email,
        'Known Allergies': patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None Reported',
        'Chronic History': patient.chronicConditions.join(', ') || 'None Reported',
      },
    });
  };

  const handleConfirmAdmission = async () => {
    if (!newName.trim() || !newAge.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await addPatient({
        name: newName.trim(),
        age: parseInt(newAge, 10) || 35,
        gender: newGender,
        bloodGroup: newBloodGroup,
        phone: newPhone.trim(),
        email: `${newName.toLowerCase().replace(/\s+/g, '.')}@patient.com`,
        assignedDoctorId: 'doc-1',
        roomBed: newRoomBed.trim() || 'Bed 302-B',
        status: 'Admitted',
        allergies: newAllergies.trim() ? newAllergies.split(',').map((s) => s.trim()) : [],
        chronicConditions: ['Acute Observation'],
      });

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // ignore
      }

      setPatients((prev) => [created, ...prev]);
      setIsModalVisible(false);
      // Reset form
      setNewName('');
      setNewAge('');
      setNewRoomBed('');
      setNewAllergies('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <Pressable
      onPress={() => handleOpenPatientDetail(item)}
      style={({ pressed }) => [
        patientColumns > 1 && { flex: 1 },
        pressed ? { opacity: 0.9, transform: [{ scale: 0.995 }] } : null,
      ]}
    >
      <Card variant="surface1" padding="md" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.infoCol}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.age}y, {item.gender} • Blood {item.bloodGroup}
            </Text>
          </View>
          <Badge
            label={item.status}
            variant={item.status === 'Admitted' ? 'accent' : item.status === 'Discharged' ? 'neutral' : 'warning'}
            dot
          />
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Bed size={13} color={colors.accent.primary} />
            <Text style={styles.detailHighlight}>{item.roomBed ? `Bed ${item.roomBed}` : 'Outpatient'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Phone size={13} color={colors.text.muted} />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
        </View>

        {item.allergies.length > 0 ? (
          <View style={styles.allergyTag}>
            <AlertCircle size={12} color={colors.status.critical} />
            <Text style={styles.allergyTagText} numberOfLines={1}>
              Allergies: {item.allergies.join(', ')}
            </Text>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Top Header Bar */}
      <View style={[styles.topHeader, { paddingHorizontal: horizontalPadding }]}>
        <View style={[styles.headerInner, { maxWidth: containerMaxWidth }]}>
          <View style={styles.headerLeft}>
            {navigation.canGoBack() ? (
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
                <ChevronLeft size={22} color={colors.text.primary} />
              </Pressable>
            ) : null}
            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle} numberOfLines={1}>Inpatients</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>Live Bed Census</Text>
            </View>
          </View>

          <Pressable
            onPress={() => setIsModalVisible(true)}
            style={({ pressed }) => [
              styles.admitButton,
              pressed ? styles.admitButtonPressed : null,
            ]}
            hitSlop={8}
          >
            <Plus size={15} color={colors.text.inverse} />
            <Text style={styles.admitButtonText}>Admit</Text>
          </Pressable>
        </View>
      </View>

      {/* Search Bar & Filter Chips */}
      <View style={[styles.searchHeader, { paddingHorizontal: horizontalPadding }]}>
        <View style={{ maxWidth: containerMaxWidth, width: '100%', alignSelf: 'center' }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search inpatients..."
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            {STATUS_TABS.map((tab) => {
              const count =
                tab === 'All'
                  ? patients.length
                  : patients.filter((p) => p.status.toLowerCase() === tab.toLowerCase()).length;
              return (
                <Chip
                  key={tab}
                  label={tab}
                  selected={selectedStatus === tab}
                  count={count}
                  onPress={() => setSelectedStatus(tab)}
                />
              );
            })}
            {(selectedStatus !== 'All' || search.trim() !== '') && (
              <Chip
                label="Reset"
                selected={false}
                onPress={() => {
                  setSelectedStatus('All');
                  setSearch('');
                }}
              />
            )}
          </ScrollView>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
        </View>
      ) : (
        <FlatList
          key={`patients-grid-${patientColumns}`}
          numColumns={patientColumns}
          columnWrapperStyle={patientColumns > 1 ? { gap: cardGap } : undefined}
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          renderItem={renderPatientItem}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: insets.bottom + spacing.xxl,
              maxWidth: containerMaxWidth,
              width: '100%',
              alignSelf: 'center',
              paddingHorizontal: horizontalPadding,
            },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <UserCheck size={36} color={colors.text.muted} />
              <Text style={styles.emptyTitle}>No Inpatients Found</Text>
              <Text style={styles.emptyText}>
                No patient records match &ldquo;{search}&rdquo; in the {selectedStatus} census.
              </Text>
            </View>
          }
        />
      )}

      {/* New Inpatient Admission Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[
            styles.modalBackdrop,
            isDesktop && { justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
          ]}
        >
          <View
            style={[
              styles.modalCard,
              { paddingBottom: insets.bottom + spacing.md },
              isDesktop && {
                maxWidth: 540,
                width: '100%',
                borderRadius: radius.xl,
                borderBottomLeftRadius: radius.xl,
                borderBottomRightRadius: radius.xl,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Admit New Patient</Text>
                <Text style={styles.modalSubtitle}>Register inpatient into bed management</Text>
              </View>
              <Pressable
                onPress={() => setIsModalVisible(false)}
                style={styles.closeModalButton}
                hitSlop={10}
              >
                <X size={20} color={colors.text.secondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm}>
              {/* Patient Full Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Patient Full Name *</Text>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="e.g. Ramesh Kulkarni"
                  placeholderTextColor={colors.text.muted}
                  style={styles.formInput}
                />
              </View>

              {/* Age and Gender Row */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: spacing.sm }]}>
                  <Text style={styles.formLabel}>Age (Years) *</Text>
                  <TextInput
                    value={newAge}
                    onChangeText={setNewAge}
                    placeholder="e.g. 52"
                    placeholderTextColor={colors.text.muted}
                    keyboardType="numeric"
                    style={styles.formInput}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Gender</Text>
                  <View style={styles.genderSelectRow}>
                    {(['M', 'F', 'Other'] as const).map((g) => (
                      <Pressable
                        key={g}
                        onPress={() => setNewGender(g)}
                        style={[
                          styles.genderChip,
                          newGender === g ? styles.genderChipActive : null,
                        ]}
                      >
                        <Text
                          style={[
                            styles.genderChipText,
                            newGender === g ? styles.genderChipTextActive : null,
                          ]}
                        >
                          {g}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              {/* Blood Group and Assigned Bed */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: spacing.sm }]}>
                  <Text style={styles.formLabel}>Blood Group</Text>
                  <TextInput
                    value={newBloodGroup}
                    onChangeText={setNewBloodGroup}
                    placeholder="e.g. B+"
                    placeholderTextColor={colors.text.muted}
                    style={styles.formInput}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Bed / Room Number</Text>
                  <TextInput
                    value={newRoomBed}
                    onChangeText={setNewRoomBed}
                    placeholder="e.g. Bed 402-A"
                    placeholderTextColor={colors.text.muted}
                    style={styles.formInput}
                  />
                </View>
              </View>

              {/* Contact Phone */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Emergency Contact Number</Text>
                <TextInput
                  value={newPhone}
                  onChangeText={setNewPhone}
                  placeholder="+91 98201 00000"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="phone-pad"
                  style={styles.formInput}
                />
              </View>

              {/* Drug Allergies */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Known Drug Allergies (Optional)</Text>
                <TextInput
                  value={newAllergies}
                  onChangeText={setNewAllergies}
                  placeholder="e.g. Penicillin, Aspirin (or None)"
                  placeholderTextColor={colors.text.muted}
                  style={styles.formInput}
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActionRow}>
              <Button
                label="Cancel"
                variant="outline"
                onPress={() => setIsModalVisible(false)}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <Button
                label={isSubmitting ? 'Admitting...' : 'Confirm Admission'}
                variant="primary"
                onPress={handleConfirmAdmission}
                disabled={!newName.trim() || !newAge.trim() || isSubmitting}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  admitButton: {
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
  admitButtonPressed: {
    backgroundColor: colors.accent.hover,
    transform: [{ scale: 0.97 }],
  },
  admitButtonText: {
    fontSize: 12,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  searchHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.canvas,
  },
  filterChipsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    marginBottom: 12,
    backgroundColor: colors.surface1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.xl,
    ...elevation.level1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoCol: {
    flex: 1,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
    fontSize: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 12,
  },
  detailHighlight: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 8,
    gap: 6,
  },
  allergyTagText: {
    fontSize: 11,
    color: colors.status.critical,
    fontWeight: '600',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  emptyText: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  closeModalButton: {
    padding: 6,
  },
  modalForm: {
    marginBottom: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    ...typography.labelSmall,
    color: colors.text.secondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  formInput: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    height: 44,
    ...typography.body,
    color: colors.text.primary,
  },
  genderSelectRow: {
    flexDirection: 'row',
    gap: 6,
    height: 44,
  },
  genderChip: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipActive: {
    backgroundColor: colors.accent.muted,
    borderColor: colors.accent.primary,
  },
  genderChipText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  genderChipTextActive: {
    color: colors.accent.primary,
    fontWeight: '700',
  },
  modalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
});
