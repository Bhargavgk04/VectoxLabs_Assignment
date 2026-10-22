import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { useRole } from '../../../store/RoleContext';
import { useWorkflow } from '../../../store/WorkflowContext';
import { FollowUpQueueItem } from '../../../types';
import { FollowUpCard } from '../components/FollowUpCard';
import { ContextualMenuModal } from '../components/ContextualMenuModal';
import { ProgressBar } from '../../../components/feedback/ProgressBar';
import { SearchBar } from '../../../components/ui/SearchBar';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/CardSkeleton';
import { Chip } from '../../../components/ui/Chip';
import { Snackbar } from '../../../components/ui/Snackbar';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';
import { AppDialog, DialogDetailItem } from '../../../components/ui/AppDialog';

type Props = {
  navigation: any;
  route?: any;
};

export const FollowUpQueueScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const { isDesktop, containerMaxWidth, horizontalPadding } = useResponsive();
  const queueColumns = isDesktop ? 2 : 1;
  const { logout } = useRole();

  const {
    queue,
    loading,
    completedCount,
    totalCount,
    undoItem,
    rescheduleFollowUp,
    skipFollowUp,
    refreshQueue,
    clearUndo,
    executeUndo,
  } = useWorkflow();

  const [activeMenuItem, setActiveMenuItem] = useState<FollowUpQueueItem | null>(null);
  const [search, setSearch] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');

  // Custom AppDialog state (replaces native Alert.alert)
  const [dialogConfig, setDialogConfig] = useState<{
    visible: boolean;
    title: string;
    description: string;
    type?: 'info' | 'warning' | 'critical' | 'success' | 'confirm';
    details?: DialogDetailItem[];
  }>({
    visible: false,
    title: '',
    description: '',
  });
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      if (item.status !== 'pending') return false;

      const matchesSearch =
        item.patientName.toLowerCase().includes(search.toLowerCase()) ||
        item.diagnoses.some((d) => d.toLowerCase().includes(search.toLowerCase())) ||
        item.lastPrescription.medication.toLowerCase().includes(search.toLowerCase());

      const matchesUrgency =
        selectedUrgency === 'All' || item.urgency === selectedUrgency;

      return matchesSearch && matchesUrgency;
    });
  }, [queue, search, selectedUrgency]);

  const handleOpenItem = (item: FollowUpQueueItem) => {
    navigation.navigate('RenewalReview', { itemId: item.id });
  };

  const handleLongPressItem = (item: FollowUpQueueItem) => {
    setActiveMenuItem(item);
  };

  const handleSkip = (item: FollowUpQueueItem) => {
    skipFollowUp(item.id);
  };

  const handleReschedule = (item: FollowUpQueueItem) => {
    rescheduleFollowUp(item.id);
    setDialogConfig({
      visible: true,
      title: 'Follow-Up Rescheduled',
      description: `Clinical follow-up for ${item.patientName} has been deferred by 7 calendar days. Patient portal updated.`,
      type: 'success',
    });
  };

  const handleViewHistory = (item: FollowUpQueueItem) => {
    setDialogConfig({
      visible: true,
      title: `Clinical Chart: ${item.patientName}`,
      description: 'Active Patient Diagnoses & Maintenance Telemetry',
      type: 'info',
      details: [
        { label: 'Primary Diagnoses', value: item.diagnoses.join(', ') },
        {
          label: 'Active Medication',
          value: `${item.lastPrescription.medication} ${item.lastPrescription.dosage}`,
        },
        { label: 'Last Clinical Visit', value: item.lastVisitDate },
        {
          label: 'Documented Allergies',
          value: item.allergies.length > 0 ? item.allergies.join(', ') : 'None Reported',
          isHighlight: item.allergies.length > 0,
        },
        { label: 'Prescribing Physician', value: item.lastPrescription.prescribedBy },
      ],
    });
  };

  const pendingCount = queue.filter((i) => i.status === 'pending').length;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.canvas, paddingTop: topPadding },
      ]}
      testID="follow-up-queue-screen"
    >
      {/* Header Banner & Telemetry */}
      <View
        style={[
          styles.headerSection,
          {
            backgroundColor: colors.surface1,
            borderBottomColor: colors.borderSubtle,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <View style={[styles.headerInner, { maxWidth: containerMaxWidth, paddingHorizontal: horizontalPadding }]}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerTitleCol}>
              <View style={styles.subTitleRow}>
                <Text style={styles.subTitle}>Prescription Telemetry</Text>
                <View style={styles.counterPill}>
                  <Text style={styles.counterPillText}>{pendingCount} Action Due</Text>
                </View>
              </View>
              <Text style={styles.mainTitle} numberOfLines={1}>Rx Renewal Queue</Text>
            </View>

            <Pressable
              onPress={() => setSignOutDialogOpen(true)}
              style={({ pressed }) => [
                styles.logoutChip,
                pressed ? { opacity: 0.8, transform: [{ scale: 0.96 }] } : null,
              ]}
              hitSlop={10}
              accessibilityLabel="Sign out"
            >
              <LogOut size={13} color={colors.status.critical} />
              <Text style={styles.logoutChipText}>Sign Out</Text>
            </Pressable>
          </View>

          {/* Daily Progress Tracker */}
          <View style={{ marginTop: spacing.md }}>
            <ProgressBar
              completed={completedCount}
              total={totalCount}
              label="Today's Shift Progress"
            />
          </View>
        </View>
      </View>

      {/* Filter and Search Bar */}
      <View style={[styles.filterBarWrap, { maxWidth: containerMaxWidth, paddingHorizontal: horizontalPadding }]}>
        <View style={styles.filterBar}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search queue..."
          />

          <View style={styles.urgencyRow}>
            {['All', 'High', 'Medium', 'Routine'].map((u) => (
              <Chip
                key={u}
                label={u}
                selected={selectedUrgency === u}
                onPress={() => setSelectedUrgency(u)}
              />
            ))}
            {(selectedUrgency !== 'All' || search.trim() !== '') && (
              <Chip
                label="Reset"
                selected={false}
                onPress={() => {
                  setSelectedUrgency('All');
                  setSearch('');
                }}
              />
            )}
          </View>
        </View>
      </View>

      {/* Queue List with Responsive Columns */}
      <FlatList
        key={`queue-${queueColumns}`}
        numColumns={queueColumns}
        columnWrapperStyle={queueColumns > 1 ? { gap: spacing.md } : undefined}
        data={filteredQueue}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          {
            maxWidth: containerMaxWidth,
            paddingHorizontal: horizontalPadding,
            paddingBottom: insets.bottom + 90,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshQueue}
            tintColor={colors.accent.primary}
          />
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 / queueColumns, padding: isDesktop ? 6 : 0 }}>
            <FollowUpCard
              item={item}
              onPress={handleOpenItem}
              onLongPress={handleLongPressItem}
            />
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <CardSkeleton count={4} type="queue" />
          ) : (
            <EmptyState
              type="queue"
              title={
                completedCount > 0 && filteredQueue.length === 0
                  ? 'All Follow-Ups Cleared!'
                  : 'No Follow-Ups Found'
              }
              description={
                completedCount > 0 && filteredQueue.length === 0
                  ? 'Great job! You have cleared all pending prescriptions in your review batch.'
                  : 'There are no patients matching the selected filter criteria.'
              }
              actionLabel="Refresh Queue"
              onAction={refreshQueue}
            />
          )
        }
      />

      {/* Long-press Contextual Menu Modal */}
      <ContextualMenuModal
        visible={!!activeMenuItem}
        item={activeMenuItem}
        onClose={() => setActiveMenuItem(null)}
        onRenew={(item) => handleOpenItem(item)}
        onReschedule={handleReschedule}
        onSkip={handleSkip}
        onViewHistory={handleViewHistory}
      />

      {/* Snackbar for Undo */}
      <Snackbar
        visible={!!undoItem}
        message={`Status updated for ${undoItem?.item.patientName}.`}
        actionLabel="UNDO"
        onAction={executeUndo}
        onDismiss={clearUndo}
        durationMs={5000}
      />

      {/* Custom In-App Dialog replacing native Alert.alert */}
      <AppDialog
        visible={dialogConfig.visible}
        title={dialogConfig.title}
        description={dialogConfig.description}
        type={dialogConfig.type}
        details={dialogConfig.details}
        confirmLabel="Dismiss"
        onConfirm={() => setDialogConfig((prev) => ({ ...prev, visible: false }))}
      />

      {/* Sign Out Confirmation Dialog */}
      <AppDialog
        visible={signOutDialogOpen}
        title="Sign Out of Doctor Session?"
        description="Are you sure you want to end your active physician session? Any unsigned drafts will remain saved locally."
        type="confirm"
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
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
  headerSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerInner: {
    width: '100%',
    alignSelf: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  counterPill: {
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  counterPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  logoutChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.criticalBg,
    borderColor: colors.status.criticalBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: 4,
  },
  logoutChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.status.critical,
  },
  counterNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0284C7',
    lineHeight: 22,
  },
  counterLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0369A1',
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  mainTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  filterBarWrap: {
    width: '100%',
    alignSelf: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  filterBar: {
    gap: 12,
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  listContent: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    paddingTop: spacing.md,
  },
});
