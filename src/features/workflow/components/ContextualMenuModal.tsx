import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {
  FileText,
  Calendar,
  Clock,
  XCircle,
  X,
  ChevronRight,
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { FollowUpQueueItem } from '../../../types';
import * as Haptics from 'expo-haptics';

interface ContextualMenuModalProps {
  visible: boolean;
  item: FollowUpQueueItem | null;
  onClose: () => void;
  onRenew: (item: FollowUpQueueItem) => void;
  onReschedule: (item: FollowUpQueueItem) => void;
  onSkip: (item: FollowUpQueueItem) => void;
  onViewHistory: (item: FollowUpQueueItem) => void;
}

export const ContextualMenuModal: React.FC<ContextualMenuModalProps> = ({
  visible,
  item,
  onClose,
  onRenew,
  onReschedule,
  onSkip,
  onViewHistory,
}) => {
  if (!item) return null;

  const handleAction = (action: () => void) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
    onClose();
    action();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        testID="modal-backdrop"
      >
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface1,
              borderColor: colors.borderSubtle,
              borderRadius: radius.xl,
              padding: spacing.lg,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.h3,
                  { color: colors.text.primary, marginBottom: 2 },
                ]}
              >
                {item.patientName}
              </Text>
              <Text style={[typography.caption, { color: colors.text.secondary }]}>
                {item.lastPrescription.medication} ({item.lastPrescription.dosage}) • {item.diagnoses.join(', ')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              testID="close-menu-button"
            >
              <X size={20} color={colors.text.muted} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: colors.borderSubtle, marginVertical: spacing.md },
            ]}
          />

          {/* Action List */}
          <View style={styles.actionList}>
            <TouchableOpacity
              style={[
                styles.actionItem,
                { backgroundColor: colors.surface2, borderRadius: radius.md },
              ]}
              onPress={() => handleAction(() => onRenew(item))}
              testID="action-renew"
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.accent.muted },
                ]}
              >
                <FileText size={18} color={colors.accent.primary} />
              </View>
              <View style={styles.actionTextWrap}>
                <Text
                  style={[
                    typography.body,
                    { color: colors.text.primary, fontWeight: '600' },
                  ]}
                >
                  Renew Prescription
                </Text>
                <Text
                  style={[typography.caption, { color: colors.text.secondary }]}
                >
                  3-tap review and sign off
                </Text>
              </View>
              <ChevronRight size={18} color={colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { backgroundColor: colors.surface2, borderRadius: radius.md },
              ]}
              onPress={() => handleAction(() => onViewHistory(item))}
              testID="action-history"
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.status.infoBg },
                ]}
              >
                <Clock size={18} color={colors.status.info} />
              </View>
              <View style={styles.actionTextWrap}>
                <Text
                  style={[
                    typography.body,
                    { color: colors.text.primary, fontWeight: '600' },
                  ]}
                >
                  View Clinical History
                </Text>
                <Text
                  style={[typography.caption, { color: colors.text.secondary }]}
                >
                  Past consults and lab vitals
                </Text>
              </View>
              <ChevronRight size={18} color={colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { backgroundColor: colors.surface2, borderRadius: radius.md },
              ]}
              onPress={() => handleAction(() => onReschedule(item))}
              testID="action-reschedule"
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.status.warningBg },
                ]}
              >
                <Calendar size={18} color={colors.status.warning} />
              </View>
              <View style={styles.actionTextWrap}>
                <Text
                  style={[
                    typography.body,
                    { color: colors.text.primary, fontWeight: '600' },
                  ]}
                >
                  Reschedule Follow-Up
                </Text>
                <Text
                  style={[typography.caption, { color: colors.text.secondary }]}
                >
                  Postpone date by 7 or 14 days
                </Text>
              </View>
              <ChevronRight size={18} color={colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { backgroundColor: colors.surface2, borderRadius: radius.md },
              ]}
              onPress={() => handleAction(() => onSkip(item))}
              testID="action-skip"
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.status.criticalBg },
                ]}
              >
                <XCircle size={18} color={colors.status.critical} />
              </View>
              <View style={styles.actionTextWrap}>
                <Text
                  style={[
                    typography.body,
                    { color: colors.status.critical, fontWeight: '600' },
                  ]}
                >
                  Dismiss / Patient No-Show
                </Text>
                <Text
                  style={[typography.caption, { color: colors.text.secondary }]}
                >
                  Archive from current review queue
                </Text>
              </View>
              <ChevronRight size={18} color={colors.text.muted} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  sheet: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  actionList: {
    gap: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTextWrap: {
    flex: 1,
  },
});
