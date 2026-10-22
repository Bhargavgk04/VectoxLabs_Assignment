import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../navigation/types';
import { Doctor } from '../../../types';
import { getDoctorById } from '../../../services/doctorService';
import { RemoteImage } from '../../../components/media/RemoteImage';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Star, Award, Building2, GraduationCap, Clock, ChevronLeft } from 'lucide-react-native';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';

type ProfileRouteProp = RouteProp<RootStackParamList, 'DoctorProfile'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function DoctorProfileScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const route = useRoute<ProfileRouteProp>();
  const navigation = useNavigation<NavProp>();
  const { isDesktop, horizontalPadding } = useResponsive();
  const [doctor, setDoctor] = useState<Doctor | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorById(route.params.doctorId).then(data => {
      setDoctor(data);
      setLoading(false);
    });
  }, [route.params.doctorId]);

  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.centerLoading}>
        <Text style={styles.errorText}>Physician record not found.</Text>
      </View>
    );
  }

  const isAvailable = doctor.availability !== 'On Leave';

  return (
    <View style={[styles.safeArea, { paddingTop: topPadding }]}>
      {/* Top Header with Back Button */}
      <View style={[styles.topHeader, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.headerInner}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={10}
          >
            <ChevronLeft size={24} color={colors.text.primary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Physician Profile</Text>
          <View style={{ width: 48 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && { alignItems: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerContainer}>
          {/* Doctor Header Banner Card */}
          <Card variant="surface1" padding="lg" style={styles.profileHeaderCard}>
            <View style={styles.topProfileRow}>
              <RemoteImage
                uri={doctor.imageUrl}
                fallbackText={doctor.name}
                width={100}
                height={110}
                borderRadius={12}
                accessibilityLabel={`Portrait of ${doctor.name}`}
              />
              <View style={styles.profileMetaCol}>
                <Badge
                  label={doctor.availability}
                  variant={isAvailable ? 'stable' : 'critical'}
                  dot
                />
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.specialty}>{doctor.specialty}</Text>
                <Text style={styles.affiliation}>{doctor.hospitalAffiliation}</Text>
              </View>
            </View>

            {/* Quick Metrics Bar */}
            <View style={styles.metricsBar}>
              <View style={styles.metricItem}>
                <View style={styles.metricIconRow}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.metricVal}>{doctor.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.metricSub}>{doctor.reviewCount} Reviews</Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricItem}>
                <View style={styles.metricIconRow}>
                  <Award size={14} color={colors.accent.primary} />
                  <Text style={styles.metricVal}>{doctor.experienceYears} Years</Text>
                </View>
                <Text style={styles.metricSub}>Clinical Experience</Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricItem}>
                <Text style={[styles.metricVal, { color: colors.status.stable }]}>
                  ₹{doctor.consultationFee}
                </Text>
                <Text style={styles.metricSub}>Consultation Fee</Text>
              </View>
            </View>
          </Card>

          {/* Biography Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physician Biography</Text>
            <Card variant="surface1" padding="md">
              <Text style={styles.bodyText}>{doctor.bio}</Text>
            </Card>
          </View>

          {/* Clinical Qualifications & Education */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Credentials & Hospital Wing</Text>
            <Card variant="surface1" padding="md">
              <View style={styles.credentialRow}>
                <GraduationCap size={18} color={colors.accent.primary} style={styles.credIcon} />
                <View style={styles.credCol}>
                  <Text style={styles.credTitle}>Medical Education</Text>
                  <Text style={styles.credSub}>{doctor.education}</Text>
                </View>
              </View>

              <View style={[styles.credentialRow, { marginTop: spacing.md }]}>
                <Building2 size={18} color={colors.status.stable} style={styles.credIcon} />
                <View style={styles.credCol}>
                  <Text style={styles.credTitle}>Affiliated Department</Text>
                  <Text style={styles.credSub}>{doctor.hospitalAffiliation}</Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View style={[styles.bottomBar, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.bottomBarInner}>
          <View style={styles.priceCol}>
            <Text style={styles.feeLabel}>CONSULTATION FEE</Text>
            <Text style={styles.feeVal}>₹{doctor.consultationFee}</Text>
          </View>

          <Button
            label={isAvailable ? 'Book Appointment' : 'Physician On Leave'}
            onPress={() =>
              navigation.navigate('BookingSlot', {
                doctorId: doctor.id,
                doctorName: doctor.name,
                specialty: doctor.specialty,
              })
            }
            variant={isAvailable ? 'primary' : 'secondary'}
            disabled={!isAvailable}
            icon={isAvailable ? <Clock size={16} color={colors.canvas} /> : undefined}
            style={styles.bookCTA}
          />
        </View>
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
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface1,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  centerContainer: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  backText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 120,
  },
  profileHeaderCard: {
    marginBottom: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  topProfileRow: {
    flexDirection: 'row',
  },
  profileMetaCol: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  doctorName: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  specialty: {
    ...typography.labelBold,
    color: colors.accent.primary,
    fontSize: 13,
  },
  affiliation: {
    ...typography.caption,
    color: colors.text.muted,
  },
  metricsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricVal: {
    ...typography.labelBold,
    color: colors.text.primary,
    fontSize: 15,
    marginLeft: 4,
  },
  metricSub: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 11,
    marginTop: 3,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 10,
    marginTop: 4,
  },
  bodyText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  credentialRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  credIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  credCol: {
    flex: 1,
  },
  credTitle: {
    ...typography.labelBold,
    color: colors.text.primary,
    fontSize: 13,
  },
  credSub: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 4,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface1,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceCol: {
    justifyContent: 'center',
  },
  feeLabel: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  feeVal: {
    ...typography.metricLg,
    color: colors.accent.primary,
    fontSize: 22,
  },
  bookCTA: {
    minWidth: 180,
  },
  centerLoading: {
    flex: 1,
    backgroundColor: colors.canvas,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.status.warning,
  },
});
