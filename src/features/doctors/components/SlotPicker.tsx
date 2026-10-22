import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { Calendar, Clock, Check } from 'lucide-react-native';

export interface DateSlots {
  date: string;
  slots: string[];
}

export interface SlotPickerProps {
  availableDates: DateSlots[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}

export function SlotPicker({
  availableDates,
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
}: SlotPickerProps): React.JSX.Element {
  const activeDateObj = availableDates.find(d => d.date === selectedDate);
  const activeSlots = activeDateObj ? activeDateObj.slots : [];

  return (
    <View style={styles.container}>
      {/* 1. Date Selector */}
      <View style={styles.sectionHeader}>
        <Calendar size={16} color={colors.accent.primary} />
        <Text style={styles.sectionTitle}>1. Select Consultation Date</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScroll}
      >
        {availableDates.map(d => {
          const isSelected = d.date === selectedDate;
          return (
            <Pressable
              key={d.date}
              onPress={() => {
                onSelectDate(d.date);
                if (d.slots.length > 0 && !d.slots.includes(selectedSlot)) {
                  onSelectSlot(d.slots[0]);
                }
              }}
              style={({ pressed }) => [
                styles.dateCard,
                isSelected ? styles.dateCardSelected : styles.dateCardUnselected,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select date ${d.date}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.dateText,
                  isSelected ? styles.dateTextSelected : styles.dateTextUnselected,
                ]}
              >
                {d.date}
              </Text>
              <Text style={styles.slotCountText}>{d.slots.length} Slots</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 2. Available Time Slots Grid */}
      <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
        <Clock size={16} color={colors.accent.primary} />
        <Text style={styles.sectionTitle}>2. Select Available Time Slot</Text>
      </View>

      {activeSlots.length === 0 ? (
        <View style={styles.noSlotsBox}>
          <Text style={styles.noSlotsText}>No appointment slots available for this date.</Text>
        </View>
      ) : (
        <View style={styles.slotsGrid}>
          {activeSlots.map(slot => {
            const isSelected = selectedSlot === slot;
            return (
              <Pressable
                key={slot}
                onPress={() => onSelectSlot(slot)}
                style={({ pressed }) => [
                  styles.slotChip,
                  isSelected ? styles.slotChipSelected : styles.slotChipUnselected,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Select time slot ${slot}`}
                accessibilityState={{ selected: isSelected }}
              >
                {isSelected && (
                  <Check size={14} color={colors.canvas} style={styles.checkIcon} />
                )}
                <Text
                  style={[
                    styles.slotText,
                    isSelected ? styles.slotTextSelected : styles.slotTextUnselected,
                  ]}
                >
                  {slot}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginLeft: spacing.xs,
    fontSize: 14,
  },
  dateScroll: {
    flexDirection: 'row',
    paddingBottom: spacing.xs,
  },
  dateCard: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    marginRight: spacing.sm,
    minWidth: 96,
    alignItems: 'center',
  },
  dateCardUnselected: {
    backgroundColor: colors.surface1,
    borderColor: colors.borderSubtle,
  },
  dateCardSelected: {
    backgroundColor: colors.accent.muted,
    borderColor: colors.accent.primary,
  },
  dateText: {
    ...typography.labelBold,
    fontSize: 13,
  },
  dateTextUnselected: {
    color: colors.text.primary,
  },
  dateTextSelected: {
    color: colors.accent.primary,
  },
  slotCountText: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 10,
    marginTop: 2,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    margin: 4,
    minWidth: 88,
  },
  slotChipUnselected: {
    backgroundColor: colors.surface1,
    borderColor: colors.borderSubtle,
  },
  slotChipSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  slotText: {
    ...typography.bodySm,
    fontWeight: '600',
  },
  slotTextUnselected: {
    color: colors.text.secondary,
  },
  slotTextSelected: {
    color: colors.canvas,
    fontWeight: '700',
  },
  checkIcon: {
    marginRight: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  noSlotsBox: {
    padding: spacing.md,
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  noSlotsText: {
    ...typography.caption,
    color: colors.text.muted,
  },
});
