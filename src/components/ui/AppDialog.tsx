import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  HelpCircle,
  X,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { elevation } from '../../theme/elevation';
import { Button, ButtonVariant } from './Button';
import * as Haptics from 'expo-haptics';

export type DialogType = 'info' | 'warning' | 'critical' | 'success' | 'confirm';

export interface DialogDetailItem {
  label: string;
  value: string;
  isHighlight?: boolean;
}

export interface AppDialogProps {
  visible: boolean;
  title: string;
  description: string;
  type?: DialogType;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  details?: DialogDetailItem[];
  onConfirm: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

export const AppDialog: React.FC<AppDialogProps> = ({
  visible,
  title,
  description,
  type = 'info',
  confirmLabel = 'Confirm',
  cancelLabel,
  confirmVariant,
  details,
  onConfirm,
  onCancel,
  children,
}) => {
  if (!visible) return null;

  const handleConfirm = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const getIcon = () => {
    switch (type) {
      case 'critical':
        return <ShieldAlert size={28} color={colors.status.critical} />;
      case 'warning':
        return <AlertTriangle size={28} color={colors.status.warning} />;
      case 'success':
        return <CheckCircle2 size={28} color={colors.status.stable} />;
      case 'confirm':
        return <HelpCircle size={28} color={colors.accent.primary} />;
      case 'info':
      default:
        return <Info size={28} color={colors.status.info} />;
    }
  };

  const getBadgeStyle = () => {
    switch (type) {
      case 'critical':
        return {
          backgroundColor: colors.status.criticalBg,
          borderColor: colors.status.criticalBorder,
        };
      case 'warning':
        return {
          backgroundColor: colors.status.warningBg,
          borderColor: colors.status.warningBorder,
        };
      case 'success':
        return {
          backgroundColor: colors.status.stableBg,
          borderColor: colors.status.stableBorder,
        };
      case 'confirm':
        return {
          backgroundColor: colors.accent.muted,
          borderColor: '#BAE6FD',
        };
      case 'info':
      default:
        return {
          backgroundColor: colors.status.infoBg,
          borderColor: colors.status.infoBorder,
        };
    }
  };

  const resolvedConfirmVariant =
    confirmVariant || (type === 'critical' ? 'critical' : 'primary');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
    >
      <TouchableWithoutFeedback onPress={onCancel || onConfirm}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialogCard, elevation.level3]}>
              {/* Close Button if dismissible */}
              {onCancel ? (
                <Pressable
                  onPress={onCancel}
                  style={styles.closeBtn}
                  hitSlop={10}
                  accessibilityLabel="Close dialog"
                >
                  <X size={18} color={colors.text.muted} />
                </Pressable>
              ) : null}

              <ScrollView
                style={styles.scrollBody}
                contentContainerStyle={styles.scrollBodyContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Icon Badge */}
                <View style={[styles.iconBadge, getBadgeStyle()]}>
                  {getIcon()}
                </View>

                {/* Title & Description */}
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.descText}>{description}</Text>

                {/* Optional Key-Value Details */}
                {details && details.length > 0 ? (
                  <View style={styles.detailsBox}>
                    {details.map((item, idx) => (
                      <View
                        key={item.label}
                        style={[
                          styles.detailRow,
                          idx === details.length - 1 ? { borderBottomWidth: 0 } : null,
                        ]}
                      >
                        <Text style={styles.detailLabel}>{item.label}</Text>
                        {item.isHighlight ? (
                          <View style={styles.highlightPill}>
                            <Text style={styles.highlightPillText}>{item.value}</Text>
                          </View>
                        ) : (
                          <Text style={styles.detailValue}>{item.value}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                ) : null}

                {/* Children (e.g. form fields or inputs) */}
                {children ? <View style={styles.customContent}>{children}</View> : null}
              </ScrollView>

              {/* Action Buttons */}
              <View
                style={[
                  styles.buttonRow,
                  cancelLabel ? styles.buttonRowSplit : null,
                ]}
              >
                {cancelLabel && onCancel ? (
                  <View style={styles.buttonFlex}>
                    <Button
                      label={cancelLabel}
                      variant="secondary"
                      size="md"
                      onPress={handleCancel}
                      style={styles.actionButton}
                    />
                  </View>
                ) : null}

                <View style={styles.buttonFlex}>
                  <Button
                    label={confirmLabel}
                    variant={resolvedConfirmVariant}
                    size="md"
                    onPress={handleConfirm}
                    style={styles.actionButton}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '88%',
    backgroundColor: colors.surface1,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  scrollBody: {
    width: '100%',
  },
  scrollBodyContent: {
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  titleText: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  descText: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  detailLabel: {
    width: 125,
    flexShrink: 0,
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    lineHeight: 18,
  },
  detailValue: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'right',
    lineHeight: 18,
  },
  highlightPill: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    alignSelf: 'flex-end',
  },
  highlightPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  customContent: {
    width: '100%',
    marginBottom: spacing.md,
  },
  buttonRow: {
    width: '100%',
    marginTop: spacing.xs,
  },
  buttonRowSplit: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonFlex: {
    flex: 1,
  },
  actionButton: {
    width: '100%',
  },
});
