import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Department } from '../../../types';
import { getDepartments } from '../../../services/departmentService';
import { Card } from '../../../components/ui/Card';
import { RemoteImage } from '../../../components/media/RemoteImage';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { Building2, Stethoscope, MapPin, ChevronLeft, ArrowRight } from 'lucide-react-native';
import { RootStackParamList } from '../../../navigation/types';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function DepartmentsScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const navigation = useNavigation<NavProp>();
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDepartments().then((data) => {
      setDepartments(data);
      setLoading(false);
    });
  }, []);

  const handleOpenDepartment = useCallback((dept: Department) => {
    navigation.navigate('DetailView', {
      id: dept.id,
      category: 'Clinical Department',
      title: `${dept.name} (${dept.code})`,
      subtitle: `${dept.floor} • ${dept.activeDoctorsCount} On-Duty Specialists`,
      imageUrl: dept.imageUrl,
      description: dept.description,
      metadata: {
        'Department Head': dept.headDoctor,
        'Wing & Floor': dept.floor,
        'Active Physicians': dept.activeDoctorsCount,
        'Department Code': dept.code,
        'Emergency Capabilities': 'Equipped with dedicated resuscitation & critical telemetry beds',
      },
    });
  }, [navigation]);

  const renderDepartmentCard = useCallback(({ item }: { item: Department }) => (
    <Pressable
      onPress={() => handleOpenDepartment(item)}
      style={({ pressed }) => [
        styles.cardPressable,
        pressed ? { opacity: 0.92, transform: [{ scale: 0.99 }] } : null,
      ]}
    >
      <Card variant="surface1" padding="none" style={styles.card}>
        <RemoteImage
          uri={item.imageUrl}
          fallbackText={item.name}
          height={140}
          accessibilityLabel={`Department ${item.name}`}
        />
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.deptName}>{item.name}</Text>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{item.code}</Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={14} color={colors.accent.primary} />
              <Text style={styles.metaText}>{item.floor}</Text>
            </View>

            <View style={styles.metaItem}>
              <Stethoscope size={14} color={colors.status.stable} />
              <Text style={styles.metaText}>{item.activeDoctorsCount} On Duty</Text>
            </View>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.headDoctor}>
              Head: <Text style={styles.headDoctorHighlight}>{item.headDoctor}</Text>
            </Text>
            <View style={styles.viewDetailsRow}>
              <Text style={styles.viewDetailsText}>View Department</Text>
              <ArrowRight size={14} color={colors.accent.primary} />
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  ), [handleOpenDepartment]);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Top Header */}
      <View style={[styles.topHeader, { paddingHorizontal: horizontalPadding }]}>
        <View style={[styles.headerInner, { maxWidth: containerMaxWidth }]}>
          <View style={styles.headerLeft}>
            {navigation.canGoBack() ? (
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
                <ChevronLeft size={22} color={colors.text.primary} />
              </Pressable>
            ) : null}
            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle} numberOfLines={1}>Departments</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                Specialty Wings & Bed Census
              </Text>
            </View>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{departments.length} Wings</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
        </View>
      ) : (
        <FlatList
          data={departments}
          keyExtractor={(item) => item.id}
          renderItem={renderDepartmentCard}
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
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.headerIconCircle}>
                <Building2 size={24} color={colors.accent.primary} />
              </View>
              <Text style={styles.bannerTitle}>Vectox Campus Directory</Text>
              <Text style={styles.bannerSubtitle}>
                Select any department to view attending physicians, floor maps, and bed allocation.
              </Text>
            </View>
          }
        />
      )}
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
  listContent: {
    padding: spacing.md,
  },
  listHeader: {
    marginBottom: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  headerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  bannerTitle: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '700',
  },
  bannerSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 340,
    lineHeight: 18,
  },
  cardPressable: {
    marginBottom: spacing.md + 2,
  },
  card: {
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...elevation.level1,
  },
  cardContent: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  deptName: {
    ...typography.h3,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
    fontWeight: '700',
  },
  codeBadge: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  codeText: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '700',
    fontSize: 10,
  },
  description: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  headDoctor: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 11,
  },
  headDoctorHighlight: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewDetailsText: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
