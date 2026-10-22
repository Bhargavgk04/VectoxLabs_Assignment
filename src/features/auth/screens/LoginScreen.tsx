import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  Stethoscope,
  User,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ChevronRight,
  PhoneCall,
  Activity,
  CheckCircle2,
} from 'lucide-react-native';
import { useRole } from '../../../store/RoleContext';
import { UserRole } from '../../../types';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { AppDialog } from '../../../components/ui/AppDialog';

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, spacing.md);
  const { width } = useWindowDimensions();
  const { login } = useRole();

  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [identifier, setIdentifier] = useState<string>('rajesh.patel@gmail.com');
  const [password, setPassword] = useState<string>('VectoxPass#2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordDialogVisible, setForgotPasswordDialogVisible] = useState<boolean>(false);

  // Responsive container width: max 480px on tablets/desktop, 100% on phones
  const isLargeScreen = width > 600;
  const contentWidth = isLargeScreen ? 480 : '100%';

  const handleRoleTabChange = useCallback((role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'patient') {
      setIdentifier('rajesh.patel@gmail.com');
      setPassword('VectoxPass#2026');
    } else if (role === 'doctor') {
      setIdentifier('dr.sharma@vectoxhospital.com');
      setPassword('VectoxPass#2026');
    } else {
      setIdentifier('priya.nair@vectoxhospital.com');
      setPassword('VectoxPass#2026');
    }
  }, []);

  const handleLoginSubmit = useCallback(() => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or Hospital ID');
      return;
    }
    login(selectedRole);
  }, [identifier, login, selectedRole]);

  const handleQuickDemoLogin = useCallback((role: UserRole) => {
    login(role);
  }, [login]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.centerWrapper, { maxWidth: contentWidth }]}>
          {/* Header Brand & Trust Badges */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Activity size={28} color={colors.accent.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.brandTitle}>Vectox Memorial Hospital</Text>
            <Text style={styles.brandSubtitle}>Super Specialty Healthcare & Research Institute</Text>

            {/* Social Proof & Trust Badges */}
            <View style={styles.accreditationRow}>
              <View style={styles.trustBadge}>
                <ShieldCheck size={14} color={colors.status.stable} strokeWidth={2} />
                <Text style={styles.trustBadgeText}>NABH & JCI Accredited</Text>
              </View>
              <View style={styles.trustBadge}>
                <Activity size={14} color={colors.accent.primary} strokeWidth={2} />
                <Text style={styles.trustBadgeText}>24/7 Tertiary Care</Text>
              </View>
            </View>
          </View>

          {/* Role Selector Tabs */}
          <View style={styles.roleTabsCard}>
            <Text style={styles.sectionLabel}>Select Your Access Portal</Text>
            <View style={styles.roleTabsContainer}>
              <Pressable
                onPress={() => handleRoleTabChange('patient')}
                style={({ pressed }) => [
                  styles.roleTab,
                  selectedRole === 'patient' ? styles.roleTabActive : null,
                  pressed ? styles.roleTabPressed : null,
                ]}
              >
                <User
                  size={18}
                  color={selectedRole === 'patient' ? colors.accent.primary : colors.text.muted}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    selectedRole === 'patient' ? styles.roleTabTextActive : null,
                  ]}
                >
                  Patient
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleRoleTabChange('doctor')}
                style={({ pressed }) => [
                  styles.roleTab,
                  selectedRole === 'doctor' ? styles.roleTabActive : null,
                  pressed ? styles.roleTabPressed : null,
                ]}
              >
                <Stethoscope
                  size={18}
                  color={selectedRole === 'doctor' ? colors.accent.primary : colors.text.muted}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    selectedRole === 'doctor' ? styles.roleTabTextActive : null,
                  ]}
                >
                  Doctor
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleRoleTabChange('staff')}
                style={({ pressed }) => [
                  styles.roleTab,
                  selectedRole === 'staff' ? styles.roleTabActive : null,
                  pressed ? styles.roleTabPressed : null,
                ]}
              >
                <Building2
                  size={18}
                  color={selectedRole === 'staff' ? colors.accent.primary : colors.text.muted}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    selectedRole === 'staff' ? styles.roleTabTextActive : null,
                  ]}
                >
                  Staff/Admin
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Login Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {selectedRole === 'patient'
                ? 'Patient Health Portal'
                : selectedRole === 'doctor'
                ? 'Clinical Doctor Portal'
                : 'Staff & Hospital Operations'}
            </Text>
            <Text style={styles.formDescription}>
              {selectedRole === 'patient'
                ? 'Book specialist consults, track prescriptions, and view diagnostic reports.'
                : selectedRole === 'doctor'
                ? 'Review 3-tap follow-up renewals, monitor patient vitals, and approve scripts.'
                : 'Manage inpatient census, emergency bed allocation, and live hospital telemetry.'}
            </Text>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Identifier Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {selectedRole === 'patient'
                  ? 'Email or Mobile Number'
                  : 'Medical Council ID / Hospital Email'}
              </Text>
              <View style={styles.inputContainer}>
                <Mail size={18} color={colors.text.muted} style={styles.inputIcon} />
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder={
                    selectedRole === 'patient'
                      ? 'e.g. rajesh.patel@gmail.com'
                      : 'e.g. dr.sharma@vectoxhospital.com'
                  }
                  placeholderTextColor={colors.text.muted}
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>Password / Security PIN</Text>
                <Pressable
                  onPress={() => setForgotPasswordDialogVisible(true)}
                  hitSlop={8}
                  accessibilityLabel="Forgot PIN recovery assistance"
                >
                  <Text style={styles.forgotText}>Forgot PIN?</Text>
                </Pressable>
              </View>
              <View style={styles.inputContainer}>
                <Lock size={18} color={colors.text.muted} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.text.muted}
                  secureTextEntry={!showPassword}
                  style={styles.textInput}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  hitSlop={8}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={colors.text.muted} />
                  ) : (
                    <Eye size={18} color={colors.text.muted} />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Remember Me Checkbox */}
            <View style={styles.optionsRow}>
              <Pressable
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberMeContainer}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    rememberMe ? styles.checkboxBoxActive : null,
                  ]}
                >
                  {rememberMe ? <CheckCircle2 size={16} color={colors.text.inverse} /> : null}
                </View>
                <Text style={styles.rememberMeText}>Remember my credentials</Text>
              </Pressable>
            </View>

            {/* Submit Action CTA */}
            <Pressable
              onPress={handleLoginSubmit}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed ? styles.primaryButtonPressed : null,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                Sign In to {selectedRole === 'patient' ? 'Patient Portal' : selectedRole === 'doctor' ? 'Doctor Portal' : 'Staff Operations'}
              </Text>
              <ChevronRight size={18} color={colors.text.inverse} />
            </Pressable>
          </View>

          {/* 1-Tap Quick Demo Logins for Fast Review */}
          <View style={styles.demoSection}>
            <View style={styles.demoHeaderRow}>
              <Text style={styles.demoHeaderTitle}>Instant Demo Portals</Text>
              <Text style={styles.demoHeaderSubtitle}>One-tap login without typing</Text>
            </View>

            <Pressable
              onPress={() => handleQuickDemoLogin('doctor')}
              style={({ pressed }) => [
                styles.demoCard,
                pressed ? styles.demoCardPressed : null,
              ]}
            >
              <View style={[styles.demoIconBadge, { backgroundColor: colors.accent.muted }]}>
                <Stethoscope size={20} color={colors.accent.primary} />
              </View>
              <View style={styles.demoInfo}>
                <Text style={styles.demoName}>Dr. Rajesh Sharma, MD</Text>
                <Text style={styles.demoRoleDesc}>Chief Cardiologist • Q3 Rx Renewal Queue</Text>
              </View>
              <ChevronRight size={16} color={colors.text.muted} />
            </Pressable>

            <Pressable
              onPress={() => handleQuickDemoLogin('patient')}
              style={({ pressed }) => [
                styles.demoCard,
                pressed ? styles.demoCardPressed : null,
              ]}
            >
              <View style={[styles.demoIconBadge, { backgroundColor: colors.status.infoBg }]}>
                <User size={20} color={colors.status.info} />
              </View>
              <View style={styles.demoInfo}>
                <Text style={styles.demoName}>Rajesh Patel (Patient)</Text>
                <Text style={styles.demoRoleDesc}>Q2 Doctor Booking & Q4 Swiggy Hospital Home</Text>
              </View>
              <ChevronRight size={16} color={colors.text.muted} />
            </Pressable>

            <Pressable
              onPress={() => handleQuickDemoLogin('staff')}
              style={({ pressed }) => [
                styles.demoCard,
                pressed ? styles.demoCardPressed : null,
              ]}
            >
              <View style={[styles.demoIconBadge, { backgroundColor: colors.status.stableBg }]}>
                <Building2 size={20} color={colors.status.stable} />
              </View>
              <View style={styles.demoInfo}>
                <Text style={styles.demoName}>Priya Nair, RN (Staff Nurse)</Text>
                <Text style={styles.demoRoleDesc}>Q1 Staff Dashboard, Census & Bed Allocation</Text>
              </View>
              <ChevronRight size={16} color={colors.text.muted} />
            </Pressable>
          </View>

          {/* Emergency Helpline Footer */}
          <View style={styles.emergencyFooter}>
            <PhoneCall size={16} color={colors.status.critical} />
            <Text style={styles.emergencyText}>
              24/7 Emergency Trauma & Ambulance: <Text style={styles.emergencyBold}>108 / 1800-VECTOX</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Hospital Credential Recovery Assistance Dialog */}
      <AppDialog
        visible={forgotPasswordDialogVisible}
        title="Hospital Credential Recovery"
        description="For data protection and HIPAA compliance, security PIN or password resets require identity verification with the Vectox Medical Records & IT Helpdesk."
        type="info"
        confirmLabel="Understood"
        onConfirm={() => setForgotPasswordDialogVisible(false)}
        details={[
          {
            label: 'Helpline Contact',
            value: '+91 80 4040 2026 (Ext: 404)',
          },
          {
            label: 'Hospital IT Desk',
            value: 'it-records@vectoxhospital.com',
          },
          {
            label: 'In-Person Helpdesk',
            value: 'Central Patient Records, Ground Floor (Block A)',
          },
          {
            label: 'Helpdesk Hours',
            value: '24/7 Tertiary Emergency & IT Desk',
          },
        ]}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  centerWrapper: {
    width: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.surface1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...elevation.level2,
  },
  brandTitle: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '700',
  },
  brandSubtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  accreditationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md + 2,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface1,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  trustBadgeText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  roleTabsCard: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginBottom: spacing.xs + 2,
    letterSpacing: 0.8,
  },
  roleTabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderRadius: radius.xl,
    padding: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.lg,
  },
  roleTabActive: {
    backgroundColor: colors.surface1,
    ...elevation.level1,
  },
  roleTabPressed: {
    opacity: 0.85,
  },
  roleTabText: {
    ...typography.labelSmall,
    color: colors.text.muted,
    fontWeight: '600',
  },
  roleTabTextActive: {
    color: colors.accent.primary,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: colors.surface1,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: spacing.xl,
    ...elevation.level2,
  },
  formTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 6,
    fontWeight: '700',
  },
  formDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: colors.status.criticalBg,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.status.criticalBorder,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.status.critical,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.labelSmall,
    color: colors.text.secondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    height: '100%',
  },
  eyeButton: {
    padding: 6,
  },
  optionsRow: {
    marginBottom: spacing.xl,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface1,
  },
  checkboxBoxActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  rememberMeText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  primaryButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: radius.xl,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...elevation.level1,
  },
  primaryButtonPressed: {
    backgroundColor: colors.accent.hover,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    ...typography.label,
    color: colors.text.inverse,
    fontWeight: '700',
  },
  demoSection: {
    marginBottom: spacing.xl,
  },
  demoHeaderRow: {
    marginBottom: spacing.md,
  },
  demoHeaderTitle: {
    ...typography.labelSmall,
    color: colors.text.muted,
    letterSpacing: 0.8,
  },
  demoHeaderSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface1,
    borderRadius: radius.xl,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: spacing.sm + 2,
    ...elevation.level1,
  },
  demoCardPressed: {
    backgroundColor: colors.surface2,
    transform: [{ scale: 0.99 }],
  },
  demoIconBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  demoInfo: {
    flex: 1,
  },
  demoName: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  demoRoleDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  emergencyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  emergencyText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  emergencyBold: {
    fontWeight: '700',
    color: colors.status.critical,
  },
});
