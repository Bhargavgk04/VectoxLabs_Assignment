import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Users, Calendar, Stethoscope, CheckSquare, TrendingUp, AlertCircle } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';

export interface MetricCardProps {
  label: string;
  value: string | number;
  changeText?: string;
  isPositive?: boolean;
  category: 'patients' | 'appointments' | 'doctors' | 'tasks';
  onPress?: () => void;
}

const CATEGORY_THEMES = {
  patients: {
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
  },
  appointments: {
    iconColor: '#4F46E5',
    iconBg: '#EEF2FF',
    badgeBg: '#E0E7FF',
    badgeText: '#4338CA',
  },
  doctors: {
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    badgeBg: '#D1FAE5',
    badgeText: '#047857',
  },
  tasks: {
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
  },
};

export function MetricCard({
  label,
  value,
  changeText,
  isPositive = true,
  category,
  onPress,
}: MetricCardProps): React.JSX.Element {
  const theme = CATEGORY_THEMES[category] ?? CATEGORY_THEMES.patients;

  const renderIcon = () => {
    switch (category) {
      case 'patients':
        return <Users size={18} color={theme.iconColor} />;
      case 'appointments':
        return <Calendar size={18} color={theme.iconColor} />;
      case 'doctors':
        return <Stethoscope size={18} color={theme.iconColor} />;
      case 'tasks':
      default:
        return <CheckSquare size={18} color={theme.iconColor} />;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        elevation.level1,
        {
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}${changeText ? `, ${changeText}` : ''}`}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
          {renderIcon()}
        </View>
        {changeText ? (
          <View
            style={[
              styles.changePill,
              { backgroundColor: isPositive ? theme.badgeBg : '#FEF2F2' },
            ]}
          >
            {isPositive ? (
              <TrendingUp size={10} color={theme.badgeText} style={{ marginRight: 3 }} />
            ) : (
              <AlertCircle size={10} color="#DC2626" style={{ marginRight: 3 }} />
            )}
            <Text
              style={[
                styles.changeText,
                { color: isPositive ? theme.badgeText : '#DC2626' },
              ]}
            >
              {changeText}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    margin: 6,
    backgroundColor: colors.surface1,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text.secondary,
    lineHeight: 17,
  },
});
