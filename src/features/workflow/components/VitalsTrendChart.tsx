import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity, Heart, Droplets, ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { VitalsReading } from '../../../types';

interface VitalsTrendChartProps {
  vitalsTrend?: VitalsReading[];
}

export const VitalsTrendChart: React.FC<VitalsTrendChartProps> = ({
  vitalsTrend = [],
}) => {
  if (!vitalsTrend || vitalsTrend.length === 0) {
    return null;
  }

  const previousVitals = vitalsTrend.length > 1 ? vitalsTrend[0] : undefined;
  const currentVitals = vitalsTrend[vitalsTrend.length - 1];

  // Parse systolic for delta comparison
  const parseSystolic = (bp?: string) => {
    if (!bp) return null;
    const parts = bp.split('/');
    return parseInt(parts[0], 10);
  };

  const currentSys = parseSystolic(currentVitals?.bp);
  const prevSys = parseSystolic(previousVitals?.bp);
  const sysDelta = currentSys && prevSys ? currentSys - prevSys : null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface2,
          borderColor: colors.borderSubtle,
          borderRadius: radius.lg,
          padding: spacing.md,
        },
      ]}
      testID="vitals-trend-chart"
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Activity size={18} color={colors.accent.primary} />
          <Text
            style={[
              typography.labelBold,
              { color: colors.text.primary, marginLeft: spacing.xs },
            ]}
          >
            Vitals Telemetry Trend
          </Text>
        </View>
        {sysDelta !== null && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  sysDelta <= 0 ? colors.status.stableBg : colors.status.warningBg,
              },
            ]}
          >
            {sysDelta <= 0 ? (
              <ArrowDownRight size={12} color={colors.status.stable} />
            ) : (
              <ArrowUpRight size={12} color={colors.status.warning} />
            )}
            <Text
              style={[
                typography.caption,
                {
                  color: sysDelta <= 0 ? colors.status.stable : colors.status.warning,
                  fontWeight: '700',
                  marginLeft: 3,
                },
              ]}
            >
              {sysDelta <= 0
                ? `${Math.abs(sysDelta)} mmHg lower`
                : `+${sysDelta} mmHg elevated`}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.metricsGrid}>
        {/* Blood Pressure */}
        <View
          style={[
            styles.metricCard,
            { backgroundColor: colors.surface1, borderRadius: radius.lg },
          ]}
        >
          <View style={styles.metricLabelRow}>
            <Heart size={13} color={colors.status.critical} />
            <Text style={styles.metricLabel}>BP</Text>
          </View>
          <Text style={styles.currentValue}>{currentVitals.bp}</Text>
          <View style={styles.trendRow}>
            <Text style={styles.statusPill}>Target</Text>
            {previousVitals ? (
              <Text style={styles.baselineText}>was {previousVitals.bp}</Text>
            ) : null}
          </View>
        </View>

        {/* Heart Rate / Pulse */}
        <View
          style={[
            styles.metricCard,
            { backgroundColor: colors.surface1, borderRadius: radius.lg },
          ]}
        >
          <View style={styles.metricLabelRow}>
            <Activity size={13} color={colors.accent.primary} />
            <Text style={styles.metricLabel}>Pulse</Text>
          </View>
          <Text style={styles.currentValue}>
            {currentVitals.pulse} <Text style={styles.unitText}>bpm</Text>
          </Text>
          <View style={styles.trendRow}>
            <Text style={styles.statusPill}>Steady</Text>
            {previousVitals ? (
              <Text style={styles.baselineText}>was {previousVitals.pulse}</Text>
            ) : null}
          </View>
        </View>

        {/* SpO2 */}
        <View
          style={[
            styles.metricCard,
            { backgroundColor: colors.surface1, borderRadius: radius.lg },
          ]}
        >
          <View style={styles.metricLabelRow}>
            <Droplets size={13} color={colors.status.info} />
            <Text style={styles.metricLabel}>SpO₂</Text>
          </View>
          <Text style={styles.currentValue}>{currentVitals.spo2}%</Text>
          <View style={styles.trendRow}>
            <Text style={styles.statusPill}>Normal</Text>
            {previousVitals ? (
              <Text style={styles.baselineText}>was {previousVitals.spo2}%</Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 10.5,
    fontWeight: '500',
  },
  currentValue: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  unitText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.text.muted,
  },
  trendRow: {
    marginTop: 4,
    gap: 2,
  },
  statusPill: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.status.stable,
  },
  baselineText: {
    fontSize: 9.5,
    color: colors.text.muted,
  },
});
