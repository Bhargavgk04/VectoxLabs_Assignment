import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Users, Stethoscope, Calendar, Building2 } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import { elevation } from '../../../theme/elevation';
import * as Haptics from 'expo-haptics';

import { useResponsive } from '../../../hooks/useResponsive';

export interface QuickActionsProps {
  onPressPatients: () => void;
  onPressDoctors: () => void;
  onPressAppointments: () => void;
  onPressDepartments: () => void;
}

export function QuickActions({
  onPressPatients,
  onPressDoctors,
  onPressAppointments,
  onPressDepartments,
}: QuickActionsProps): React.JSX.Element {
  const { isDesktop } = useResponsive();

  const handlePress = (callback: () => void) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    callback();
  };

  const actions = [
    {
      id: 'patients',
      label: 'Patients',
      sub: '26 Inpatients',
      icon: <Users size={20} color="#0284C7" />,
      iconBg: '#F0F9FF',
      onPress: onPressPatients,
    },
    {
      id: 'doctors',
      label: 'Doctors',
      sub: '15 On Duty',
      icon: <Stethoscope size={20} color="#059669" />,
      iconBg: '#ECFDF5',
      onPress: onPressDoctors,
    },
    {
      id: 'appointments',
      label: 'Schedule',
      sub: '32 Booked',
      icon: <Calendar size={20} color="#4F46E5" />,
      iconBg: '#EEF2FF',
      onPress: onPressAppointments,
    },
    {
      id: 'departments',
      label: 'Wards',
      sub: '8 Clinical',
      icon: <Building2 size={20} color="#D97706" />,
      iconBg: '#FFFBEB',
      onPress: onPressDepartments,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Hospital Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            onPress={() => handlePress(action.onPress)}
            style={({ pressed }) => [
              styles.actionButton,
              isDesktop ? styles.actionButtonDesktop : styles.actionButtonMobile,
              elevation.level1,
              {
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${action.label}: ${action.sub}`}
          >
            <View style={[styles.iconCircle, { backgroundColor: action.iconBg }]}>
              {action.icon}
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.label} numberOfLines={1}>{action.label}</Text>
              <Text style={styles.sub} numberOfLines={1}>{action.sub}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonMobile: {
    width: '48%',
    minHeight: 98,
  },
  actionButtonDesktop: {
    flex: 1,
    minHeight: 104,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  textWrap: {
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  sub: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.muted,
    marginTop: 2,
    textAlign: 'center',
  },
});
