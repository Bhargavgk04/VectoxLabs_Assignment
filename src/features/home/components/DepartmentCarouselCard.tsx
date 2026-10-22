import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin, Users, Award } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { RemoteImage } from '../../../components/media/RemoteImage';
import { Department } from '../../../types';
import * as Haptics from 'expo-haptics';

interface DepartmentCarouselCardProps {
  department: Department;
  onPress: (dept: Department) => void;
}

export const DepartmentCarouselCard: React.FC<DepartmentCarouselCardProps> = ({
  department,
  onPress,
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onPress(department);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        elevation[1],
        {
          backgroundColor: colors.surface1,
          borderColor: colors.borderSubtle,
          borderRadius: radius.xl,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
      testID={`dept-card-${department.id}`}
    >
      <View style={styles.imageWrap}>
        <RemoteImage
          uri={department.imageUrl}
          style={styles.image}
          fallbackText={department.name}
          borderRadius={radius.xl}
        />
        <View style={styles.codeBadge}>
          <Text style={[typography.caption, { color: colors.accent.primary, fontWeight: '700', fontSize: 11 }]}>
            {department.code}
          </Text>
        </View>
      </View>

      <View style={[styles.content, { padding: 14 }]}>
        <Text
          style={[
            typography.h3,
            { color: colors.text.primary, fontWeight: '700', fontSize: 15 },
          ]}
          numberOfLines={1}
        >
          {department.name}
        </Text>

        <View style={styles.metaRow}>
          <MapPin size={13} color={colors.text.muted} />
          <Text
            style={[
              typography.caption,
              { color: colors.text.secondary, marginLeft: 4 },
            ]}
            numberOfLines={1}
          >
            {department.floor}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Users size={13} color={colors.accent.primary} />
            <Text style={[typography.caption, { color: colors.text.primary, marginLeft: 4, fontWeight: '600' }]}>
              {department.activeDoctorsCount} Specialists
            </Text>
          </View>
          <View style={styles.statItem}>
            <Award size={13} color={colors.status.stable} />
            <Text
              style={[typography.caption, { color: colors.text.muted, marginLeft: 4 }]}
              numberOfLines={1}
            >
              {department.headDoctor.replace('Dr. ', '')}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  codeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  content: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
