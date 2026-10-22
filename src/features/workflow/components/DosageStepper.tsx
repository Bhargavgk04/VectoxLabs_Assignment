import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Plus, Minus, Clock, Repeat, Check } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import * as Haptics from 'expo-haptics';

interface DosageStepperProps {
  durationDays: number;
  refills: number;
  dosage: string;
  dosageOptions?: string[];
  onDurationChange: (days: number) => void;
  onRefillsChange: (refills: number) => void;
  onDosageChange: (dosage: string) => void;
}

export const DosageStepper: React.FC<DosageStepperProps> = ({
  durationDays,
  refills,
  dosage,
  dosageOptions = ['5mg Once Daily', '10mg Once Daily', '20mg Twice Daily'],
  onDurationChange,
  onRefillsChange,
  onDosageChange,
}) => {
  const handleDurationDelta = (delta: number) => {
    const next = Math.max(7, Math.min(180, durationDays + delta));
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onDurationChange(next);
  };

  const handleRefillsDelta = (delta: number) => {
    const next = Math.max(0, Math.min(6, refills + delta));
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onRefillsChange(next);
  };

  const handleSelectDurationPreset = (days: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onDurationChange(days);
  };

  return (
    <View style={styles.container}>
      {/* Dosage Selection */}
      <View style={{ marginBottom: spacing.md }}>
        <Text
          style={[
            typography.labelBold,
            { color: colors.text.secondary, marginBottom: spacing.xs },
          ]}
        >
          Prescription Strength & Frequency
        </Text>
        <View style={styles.optionsWrap}>
          {dosageOptions.map((opt) => {
            const isSelected = opt.toLowerCase() === dosage.toLowerCase();
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: isSelected
                      ? colors.accent.muted
                      : colors.surface2,
                    borderColor: isSelected ? colors.accent.primary : colors.borderSubtle,
                    borderRadius: radius.md,
                  },
                ]}
                onPress={() => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch {
                    // ignore
                  }
                  onDosageChange(opt);
                }}
                testID={`dosage-option-${opt.replace(/\s+/g, '-')}`}
              >
                {isSelected && (
                  <Check
                    size={13}
                    color={colors.accent.primary}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text
                  style={[
                    typography.bodySm,
                    {
                      color: isSelected ? colors.accent.primary : colors.text.primary,
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: 12,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Steppers Row: Duration and Refills */}
      <View style={styles.steppersRow}>
        {/* Duration Stepper */}
        <View
          style={[
            styles.stepperBox,
            {
              backgroundColor: colors.surface2,
              borderColor: colors.borderSubtle,
              borderRadius: radius.xl,
            },
          ]}
        >
          <View style={styles.stepperHeader}>
            <Clock size={15} color={colors.accent.primary} />
            <Text
              style={[
                typography.caption,
                { color: colors.text.secondary, marginLeft: 5, fontWeight: '600' },
              ]}
            >
              Duration
            </Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.stepBtn,
                {
                  backgroundColor: colors.surface1,
                  borderColor: colors.borderSubtle,
                  borderRadius: radius.md,
                },
              ]}
              onPress={() => handleDurationDelta(-7)}
              disabled={durationDays <= 7}
              testID="duration-minus"
            >
              <Minus
                size={15}
                color={durationDays <= 7 ? colors.text.muted : colors.text.primary}
              />
            </TouchableOpacity>

            <View style={styles.valDisplay}>
              <TextInput
                style={[
                  styles.valInput,
                  { color: colors.text.primary, borderColor: colors.borderSubtle },
                ]}
                value={String(durationDays)}
                keyboardType="number-pad"
                selectTextOnFocus
                maxLength={3}
                onChangeText={(txt) => {
                  const cleaned = txt.replace(/[^0-9]/g, '');
                  if (cleaned === '') {
                    onDurationChange(0);
                  } else {
                    const parsed = parseInt(cleaned, 10);
                    if (!isNaN(parsed)) {
                      onDurationChange(Math.max(1, Math.min(365, parsed)));
                    }
                  }
                }}
                testID="duration-display"
                accessibilityLabel="Duration in days"
              />
              <Text style={[typography.caption, { color: colors.text.muted, fontSize: 10, marginTop: 2 }]}>
                days
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.stepBtn,
                {
                  backgroundColor: colors.surface1,
                  borderColor: colors.borderSubtle,
                  borderRadius: radius.md,
                },
              ]}
              onPress={() => handleDurationDelta(7)}
              disabled={durationDays >= 180}
              testID="duration-plus"
            >
              <Plus
                size={15}
                color={
                  durationDays >= 180 ? colors.text.muted : colors.text.primary
                }
              />
            </TouchableOpacity>
          </View>

          {/* Quick Presets */}
          <View style={styles.presetsRow}>
            {[14, 30, 60, 90].map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => handleSelectDurationPreset(d)}
                style={[
                  styles.presetChip,
                  {
                    backgroundColor:
                      durationDays === d ? colors.accent.primary : colors.surface1,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      durationDays === d ? colors.canvas : colors.text.secondary,
                    fontSize: 10,
                    fontWeight: durationDays === d ? '700' : '600',
                  }}
                >
                  {d}d
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Refills Stepper */}
        <View
          style={[
            styles.stepperBox,
            {
              backgroundColor: colors.surface2,
              borderColor: colors.borderSubtle,
              borderRadius: radius.xl,
            },
          ]}
        >
          <View style={styles.stepperHeader}>
            <Repeat size={15} color={colors.accent.primary} />
            <Text
              style={[
                typography.caption,
                { color: colors.text.secondary, marginLeft: 5, fontWeight: '600' },
              ]}
            >
              Refills
            </Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.stepBtn,
                {
                  backgroundColor: colors.surface1,
                  borderColor: colors.borderSubtle,
                  borderRadius: radius.md,
                },
              ]}
              onPress={() => handleRefillsDelta(-1)}
              disabled={refills <= 0}
              testID="refills-minus"
            >
              <Minus
                size={15}
                color={refills <= 0 ? colors.text.muted : colors.text.primary}
              />
            </TouchableOpacity>

            <View style={styles.valDisplay}>
              <TextInput
                style={[
                  styles.valInput,
                  { color: colors.text.primary, borderColor: colors.borderSubtle },
                ]}
                value={String(refills)}
                keyboardType="number-pad"
                selectTextOnFocus
                maxLength={2}
                onChangeText={(txt) => {
                  const cleaned = txt.replace(/[^0-9]/g, '');
                  if (cleaned === '') {
                    onRefillsChange(0);
                  } else {
                    const parsed = parseInt(cleaned, 10);
                    if (!isNaN(parsed)) {
                      onRefillsChange(Math.max(0, Math.min(12, parsed)));
                    }
                  }
                }}
                testID="refills-display"
                accessibilityLabel="Refill repeat count"
              />
              <Text style={[typography.caption, { color: colors.text.muted, fontSize: 10, marginTop: 2 }]}>
                repeats
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.stepBtn,
                {
                  backgroundColor: colors.surface1,
                  borderColor: colors.borderSubtle,
                  borderRadius: radius.md,
                },
              ]}
              onPress={() => handleRefillsDelta(1)}
              disabled={refills >= 6}
              testID="refills-plus"
            >
              <Plus
                size={15}
                color={refills >= 6 ? colors.text.muted : colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.presetsRow, { justifyContent: 'center', height: 24 }]}>
            <Text style={[typography.caption, { color: colors.text.muted, fontSize: 11 }]}>
              {refills === 0 ? 'Single fill' : `${refills + 1} total fills`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    flexGrow: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  steppersRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stepperBox: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valDisplay: {
    alignItems: 'center',
  },
  valInput: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    minWidth: 46,
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surface1,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
