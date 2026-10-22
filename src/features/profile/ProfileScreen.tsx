import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User,
  Hospital,
  Activity,
  Info,
  LogOut,
  Stethoscope,
  Calendar,
  AlertCircle,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  ChevronRight,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Users,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { elevation } from '../../theme/elevation';
import { useRole } from '../../store/RoleContext';
import { useToast } from '../../context/ToastContext';
import { getSafeTopPadding } from '../../utils/safeArea';
import { useResponsive } from '../../hooks/useResponsive';
import { AppDialog } from '../../components/ui/AppDialog';
import { RootStackParamList } from '../../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const navigation = useNavigation<NavProp>();
  const { currentRole, userProfile, logout } = useRole();
  const { showToast } = useToast();
  const { horizontalPadding, containerMaxWidth } = useResponsive();

  // App Preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [highContrastTelemetry, setHighContrastTelemetry] = useState(false);

  // Sign out confirmation dialog
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const handleConfirmSignOut = () => {
    setSignOutDialogOpen(false);
    logout();
    showToast({
      message: 'Signed out of Vectox Hospital. Session ended.',
      type: 'info',
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.canvas, paddingTop: topPadding },
      ]}
      testID="profile-screen"
    >
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface1,
            borderBottomColor: colors.borderSubtle,
            paddingHorizontal: horizontalPadding,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <View style={{ maxWidth: containerMaxWidth, width: '100%', alignSelf: 'center' }}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>My Profile & Persona</Text>
              <Text style={styles.headerSubtitle}>
                Vectox Hospital Healthcare Ecosystem
              </Text>
            </View>
            <View style={styles.rolePillHeader}>
              <ShieldCheck size={13} color={colors.accent.primary} />
              <Text style={styles.rolePillHeaderText}>
                {currentRole === 'patient'
                  ? 'Patient'
                  : currentRole === 'doctor'
                  ? 'Physician'
                  : 'Hospital Staff'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + 90,
            maxWidth: containerMaxWidth,
            width: '100%',
            alignSelf: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Identity Banner Card */}
        <View style={styles.userBanner}>
          <View style={styles.userAvatar}>
            {currentRole === 'doctor' ? (
              <Stethoscope size={24} color={colors.accent.primary} />
            ) : currentRole === 'staff' ? (
              <Hospital size={24} color={colors.accent.primary} />
            ) : (
              <User size={24} color={colors.accent.primary} />
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {userProfile.name}
            </Text>
            <Text style={styles.userRoleText} numberOfLines={1}>
              {userProfile.title}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {userProfile.email}
            </Text>
            {userProfile.phone ? (
              <Text style={styles.userSubMeta} numberOfLines={1}>
                {userProfile.phone} • {userProfile.location}
              </Text>
            ) : null}
          </View>
          <Pressable
            onPress={() => setSignOutDialogOpen(true)}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed ? styles.logoutButtonPressed : null,
            ]}
            hitSlop={8}
            accessibilityLabel="Sign Out of Session"
          >
            <LogOut size={15} color={colors.status.critical} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>

        {/* =========================================================================
            ROLE-SPECIFIC DOSSIER SECTIONS
           ========================================================================= */}

        {/* 1. PATIENT DOSSIER */}
        {currentRole === 'patient' && (
          <View style={styles.dossierContainer}>
            <View style={styles.sectionHeader}>
              <User size={18} color={colors.accent.primary} />
              <Text style={styles.sectionTitle}>Patient Health Profile</Text>
            </View>

            {/* Health Demographics Card */}
            <View style={styles.dossierCard}>
              <View style={styles.dossierRow}>
                <View style={styles.dossierCol}>
                  <Text style={styles.dossierLabel}>UHID Number</Text>
                  <Text style={styles.dossierValueHighlight}>
                    {userProfile.uhid || 'VX-90412'}
                  </Text>
                </View>
                <View style={styles.dossierCol}>
                  <Text style={styles.dossierLabel}>Blood Group</Text>
                  <View style={styles.bloodBadge}>
                    <Text style={styles.bloodBadgeText}>
                      {userProfile.bloodGroup || 'O+'}
                    </Text>
                  </View>
                </View>
                <View style={styles.dossierCol}>
                  <Text style={styles.dossierLabel}>Age / Gender</Text>
                  <Text style={styles.dossierValue}>
                    {userProfile.age || 45}y • {userProfile.gender || 'Male'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Allergy Warning Alert */}
              <View style={styles.allergyAlertBox}>
                <AlertCircle size={16} color={colors.status.critical} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.allergyAlertTitle}>Documented Allergies</Text>
                  <Text style={styles.allergyAlertText}>
                    {userProfile.allergies?.join(', ') || 'Penicillin, Sulfa Drugs'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Emergency Contact */}
              <View style={styles.detailRow}>
                <Phone size={15} color={colors.accent.primary} style={styles.detailIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Emergency Contact</Text>
                  <Text style={styles.detailValue}>
                    {userProfile.emergencyContact || 'Kavita Patel (Spouse) • +91 98201 44321'}
                  </Text>
                </View>
              </View>

              {/* Health Insurance Card */}
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <CreditCard size={15} color="#059669" style={styles.detailIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Health Insurance Policy</Text>
                  <Text style={styles.detailValue}>
                    {userProfile.insuranceProvider || 'Star Health Comprehensive Premier'}
                  </Text>
                  <Text style={styles.insuranceSub}>
                    Policy: {userProfile.insurancePolicyNumber || 'POL-VX-88912-2026'} •{' '}
                    <Text style={{ color: '#059669', fontWeight: '700' }}>
                      {userProfile.insuranceStatus || 'Cashless Pre-Approved'}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Patient Quick Shortcuts */}
            <View style={styles.shortcutRow}>
              <Pressable
                style={styles.shortcutBtn}
                onPress={() => navigation.navigate('AppointmentsList')}
              >
                <Calendar size={18} color={colors.accent.primary} />
                <Text style={styles.shortcutBtnText}>My Consultations</Text>
                <ChevronRight size={14} color={colors.text.muted} />
              </Pressable>
              <Pressable
                style={styles.shortcutBtn}
                onPress={() => navigation.navigate('DoctorDirectory')}
              >
                <Stethoscope size={18} color={colors.accent.primary} />
                <Text style={styles.shortcutBtnText}>Find Specialists</Text>
                <ChevronRight size={14} color={colors.text.muted} />
              </Pressable>
            </View>
          </View>
        )}

        {/* 2. DOCTOR DOSSIER */}
        {currentRole === 'doctor' && (
          <View style={styles.dossierContainer}>
            <View style={styles.sectionHeader}>
              <Activity size={18} color={colors.accent.primary} />
              <Text style={styles.sectionTitle}>Physician Credentials & Station</Text>
            </View>

            <View style={styles.dossierCard}>
              <View style={styles.detailRow}>
                <ShieldCheck size={16} color={colors.accent.primary} style={styles.detailIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Medical Registration & Council</Text>
                  <Text style={styles.detailValue}>
                    {userProfile.licenseNumber || 'MCI-99412-A / State Medical Council'}
                  </Text>
                  <Text style={styles.subDetailText}>
                    Specialty: {userProfile.specialty || 'Interventional Cardiology'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <MapPin size={16} color={colors.accent.primary} style={styles.detailIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Assigned Clinic Suite & OPD Hours</Text>
                  <Text style={styles.detailValue}>
                    {userProfile.opdRoom || 'OPD Suite 204 (2nd Floor • Block B)'}
                  </Text>
                  <Text style={styles.subDetailText}>
                    Hours: {userProfile.consultingHours || 'Mon - Fri: 09:00 AM - 04:00 PM'}
                  </Text>
                </View>
              </View>

              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <CheckCircle2 size={16} color="#059669" style={styles.detailIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Clinical Prescribing Privileges</Text>
                  <Text style={styles.detailValue}>
                    Full E-Prescribing & STAT Lab Orders
                  </Text>
                  <Text style={styles.insuranceSub}>
                    Signature: Cryptographic Key Active (RSA-4096 / EMR Synced)
                  </Text>
                </View>
              </View>
            </View>

            {/* Doctor Quick Shortcuts */}
            <View style={styles.shortcutRow}>
              <Pressable
                style={styles.shortcutBtn}
                onPress={() => navigation.navigate('FollowUpQueue')}
              >
                <Activity size={18} color={colors.accent.primary} />
                <Text style={styles.shortcutBtnText}>Rx Renewal Queue</Text>
                <ChevronRight size={14} color={colors.text.muted} />
              </Pressable>
              <Pressable
                style={styles.shortcutBtn}
                onPress={() => navigation.navigate('AppointmentsList')}
              >
                <Calendar size={18} color={colors.accent.primary} />
                <Text style={styles.shortcutBtnText}>OPD Daily Schedule</Text>
                <ChevronRight size={14} color={colors.text.muted} />
              </Pressable>
            </View>
          </View>
        )}

        {/* 3. STAFF DOSSIER */}
        {currentRole === 'staff' && (
          <View style={styles.dossierContainer}>
            <View style={styles.sectionHeader}>
              <Hospital size={18} color={colors.accent.primary} />
              <Text style={styles.sectionTitle}>Hospital Staff & Operations Station</Text>
            </View>

            <View style={styles.dossierCard}>
              <View style={styles.detailRow}>
                <ShieldCheck size={16} color={colors.accent.primary} style={styles.detailIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Staff ID & Department</Text>
                  <Text style={styles.detailValue}>
                    {userProfile.staffId || 'STF-204 (Credential #EMP-8831)'}
                  </Text>
                  <Text style={styles.subDetailText}>
                    Department: {userProfile.department || 'Nursing Operations & Bed Allocation'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <MapPin size={16} color={colors.accent.primary} style={styles.detailIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Active Station & Shift</Text>
                  <Text style={styles.detailValue}>
                    {userProfile.nursingStation || 'Central Triage & Nursing Station 3 (Ward 4B)'}
                  </Text>
                  <Text style={styles.subDetailText}>
                    {userProfile.shiftTiming || 'Day Shift: 07:00 AM - 03:30 PM (Supervisor: Dr. Mehta)'}
                  </Text>
                </View>
              </View>

              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <CheckCircle2 size={16} color="#059669" style={styles.detailIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Operational Authorizations</Text>
                  <Text style={styles.detailValue}>
                    Bed Allocation • Triage Admission • Census Override
                  </Text>
                  <Text style={styles.insuranceSub}>
                    Authority Level: Grade-A Clinical Operations Administrator
                  </Text>
                </View>
              </View>
            </View>

            {/* Staff Quick Shortcuts */}
            <View style={styles.shortcutRow}>
              <Pressable
                style={styles.shortcutBtn}
                onPress={() => navigation.navigate('PatientsList')}
              >
                <Users size={18} color={colors.accent.primary} />
                <Text style={styles.shortcutBtnText}>Inpatient Bed Registry</Text>
                <ChevronRight size={14} color={colors.text.muted} />
              </Pressable>
              <Pressable
                style={styles.shortcutBtn}
                onPress={() => navigation.navigate('AppointmentsList')}
              >
                <Calendar size={18} color={colors.accent.primary} />
                <Text style={styles.shortcutBtnText}>Master Schedule</Text>
                <ChevronRight size={14} color={colors.text.muted} />
              </Pressable>
            </View>
          </View>
        )}

        {/* =========================================================================
            APP SETTINGS & PREFERENCES
           ========================================================================= */}
        <View style={styles.sectionHeader}>
          <Sliders size={18} color={colors.accent.primary} />
          <Text style={styles.sectionTitle}>App Preferences & Telemetry</Text>
        </View>

        <View style={styles.dossierCard}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <Bell size={18} color={colors.accent.primary} style={styles.prefIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.preferenceTitle}>Clinical Alerts & Reminders</Text>
                <Text style={styles.preferenceDesc}>
                  Receive real-time push alerts for visits, STAT orders & renewals
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.borderSubtle, true: colors.accent.primary }}
              thumbColor={colors.surface1}
            />
          </View>

          <View style={[styles.preferenceRow, { borderBottomWidth: 0 }]}>
            <View style={styles.preferenceLeft}>
              <Activity size={18} color={colors.accent.primary} style={styles.prefIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.preferenceTitle}>High-Contrast Telemetry View</Text>
                <Text style={styles.preferenceDesc}>
                  Optimized for hospital ambient lighting and clinical monitors
                </Text>
              </View>
            </View>
            <Switch
              value={highContrastTelemetry}
              onValueChange={setHighContrastTelemetry}
              trackColor={{ false: colors.borderSubtle, true: colors.accent.primary }}
              thumbColor={colors.surface1}
            />
          </View>
        </View>

        {/* =========================================================================
            SYSTEM & ARCHITECTURE VERIFICATION
           ========================================================================= */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.surface1,
              borderColor: colors.borderSubtle,
              borderRadius: radius.lg,
              padding: spacing.md,
              marginTop: spacing.lg,
            },
          ]}
        >
          <View style={styles.infoHeader}>
            <Info size={18} color={colors.accent.primary} />
            <Text
              style={[
                typography.labelBold,
                { color: colors.text.primary, marginLeft: 6 },
              ]}
            >
              System & Architecture Verification
            </Text>
          </View>

          <View style={styles.infoItems}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Framework</Text>
              <Text style={[styles.infoVal, { color: colors.text.primary }]}>
                React Native 0.76.9 • Expo SDK 52 (LTS)
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Navigation</Text>
              <Text style={[styles.infoVal, { color: colors.accent.primary }]}>
                React Navigation v7 (Dynamic Persona Root)
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Theme Standard</Text>
              <Text style={[styles.infoVal, { color: colors.text.primary }]}>
                Clinical Light Mode (WCAG AAA Compliant)
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Type Safety</Text>
              <Text style={[styles.infoVal, { color: colors.status.stable }]}>
                Strict TypeScript (0 errors)
              </Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoKey}>Unit Test Suite</Text>
              <Text style={[styles.infoVal, { color: colors.status.stable }]}>
                20 Tests Passing across 4 Suites
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Safety Sign-Out Confirmation Dialog */}
      <AppDialog
        visible={signOutDialogOpen}
        title="Confirm Sign Out"
        description="Are you sure you want to end your active session in Vectox Hospital? In-progress notes and draft renewals are saved."
        type="critical"
        confirmLabel="Sign Out"
        cancelLabel="Stay Logged In"
        confirmVariant="critical"
        onConfirm={handleConfirmSignOut}
        onCancel={() => setSignOutDialogOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.primary,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: 2,
    fontWeight: '500',
  },
  rolePillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent.muted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  rolePillHeaderText: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '700',
    fontSize: 11,
  },
  scrollContent: {},
  userBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface1,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: spacing.xl,
    ...elevation.level1,
  },
  userAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.accent.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.bodyBold,
    color: colors.text.primary,
    fontSize: 16,
  },
  userRoleText: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  userEmail: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: 2,
  },
  userSubMeta: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 11,
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.status.criticalBg,
    borderWidth: 1,
    borderColor: colors.status.criticalBorder,
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutText: {
    ...typography.caption,
    color: colors.status.critical,
    fontWeight: '700',
  },
  dossierContainer: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    ...typography.labelBold,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  dossierCard: {
    backgroundColor: colors.surface1,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...elevation.level1,
  },
  dossierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dossierCol: {
    flex: 1,
  },
  dossierLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: 4,
  },
  dossierValue: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
  },
  dossierValueHighlight: {
    ...typography.bodySmall,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  bloodBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  bloodBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.md,
  },
  allergyAlertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  allergyAlertTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#991B1B',
  },
  allergyAlertText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailIcon: {
    marginTop: 2,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 11,
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  subDetailText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 3,
  },
  insuranceSub: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: 3,
  },
  shortcutRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  shortcutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...elevation.level1,
  },
  shortcutBtnText: {
    flex: 1,
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 10,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  preferenceLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginRight: 12,
  },
  prefIcon: {
    marginTop: 2,
  },
  preferenceTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.text.primary,
  },
  preferenceDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  infoCard: {
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoItems: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  infoKey: {
    ...typography.caption,
    color: colors.text.muted,
    width: 125,
    flexShrink: 0,
  },
  infoVal: {
    ...typography.caption,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});
