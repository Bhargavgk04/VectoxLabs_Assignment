import React, { memo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Appointment } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { Clock, MapPin, Stethoscope } from 'lucide-react-native';
import { useResponsive } from '../../../hooks/useResponsive';

export interface RecentAppointmentsListProps {
  appointments: Appointment[];
  onSelectAppointment?: (appointment: Appointment) => void;
  headerComponent?: React.ReactElement;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const AppointmentRow = memo(function AppointmentRow({
  item,
  onPress,
}: {
  item: Appointment;
  onPress?: () => void;
}) {
  const getBadgeVariant = (status: Appointment['status']) => {
    switch (status) {
      case 'In-Progress':
        return 'accent';
      case 'Scheduled':
        return 'warning';
      case 'Completed':
        return 'stable';
      case 'Cancelled':
      default:
        return 'critical';
    }
  };

  return (
    <Card
      onPress={onPress}
      variant="surface1"
      padding="md"
      style={styles.appointmentCard}
      accessibilityLabel={`Appointment for ${item.patientName} with ${item.doctorName}, status ${item.status}`}
    >
      <View style={styles.cardHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName} numberOfLines={1}>
            {item.patientName}
            <Text style={styles.patientMeta}> ({item.patientAge}y, {item.patientGender})</Text>
          </Text>
          <View style={styles.doctorRow}>
            <Stethoscope size={13} color={colors.accent.primary} />
            <Text style={styles.doctorName} numberOfLines={1}>{item.doctorName} • {item.specialty}</Text>
          </View>
        </View>
        <Badge label={item.status} variant={getBadgeVariant(item.status)} dot />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerDetails}>
          <View style={styles.metaRow}>
            <Clock size={12} color={colors.accent.primary} />
            <Text style={styles.metaText} numberOfLines={1}>{item.dateTime}</Text>
          </View>

          <View style={styles.metaRow}>
            <MapPin size={12} color={colors.text.muted} />
            <Text style={styles.metaText} numberOfLines={1}>{item.roomNumber}</Text>
          </View>
        </View>
      </View>

      {item.reason && (
        <Text style={styles.reasonText} numberOfLines={1}>
          Note: {item.reason}
        </Text>
      )}
    </Card>
  );
});

export function RecentAppointmentsList({
  appointments,
  onSelectAppointment,
  headerComponent,
  onRefresh,
  refreshing = false,
}: RecentAppointmentsListProps): React.JSX.Element {
  const { isDesktop, appointmentColumns } = useResponsive();

  const renderItem = ({ item }: { item: Appointment }) => (
    <View style={{ flex: 1 / appointmentColumns, padding: isDesktop ? 6 : 0 }}>
      <AppointmentRow
        item={item}
        onPress={onSelectAppointment ? () => onSelectAppointment(item) : undefined}
      />
    </View>
  );

  return (
    <FlatList
      key={`appts-grid-${appointmentColumns}`}
      data={appointments}
      numColumns={appointmentColumns}
      columnWrapperStyle={appointmentColumns > 1 ? { gap: 8 } : undefined}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ListHeaderComponent={headerComponent}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
      maxToRenderPerBatch={8}
      windowSize={5}
      removeClippedSubviews={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={
        <EmptyState
          type="calendar"
          title="No Appointments Found"
          description="There are no consultations matching your selected status filter or search keywords."
          actionLabel="Refresh Appointments"
          onAction={onRefresh}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  appointmentCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  patientInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  patientName: {
    ...typography.h3,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  patientMeta: {
    ...typography.bodySm,
    color: colors.text.muted,
    fontWeight: '400',
    fontSize: 12,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 5,
  },
  doctorName: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    gap: 8,
  },
  footerDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  metaText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 4,
    fontSize: 11,
  },
  reasonText: {
    ...typography.caption,
    color: colors.text.muted,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.muted,
  },
});
