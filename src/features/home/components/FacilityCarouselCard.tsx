import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { RemoteImage } from '../../../components/media/RemoteImage';
import { HospitalFacility } from '../../../types';
import * as Haptics from 'expo-haptics';

interface FacilityCarouselCardProps {
  facility: HospitalFacility;
  onPress: (facility: HospitalFacility) => void;
}

export const FacilityCarouselCard: React.FC<FacilityCarouselCardProps> = ({
  facility,
  onPress,
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onPress(facility);
  };

  const is24x7 = facility.availability.toLowerCase().includes('24/7');

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
      testID={`facility-card-${facility.id}`}
    >
      <View style={styles.imageWrap}>
        <RemoteImage
          uri={facility.imageUrl}
          style={styles.image}
          fallbackText={facility.name}
          borderRadius={radius.xl}
        />
        <View
          style={[
            styles.availabilityBadge,
            {
              backgroundColor: is24x7 ? '#DCFCE7' : '#F1F5F9',
              borderColor: is24x7 ? '#86EFAC' : '#E2E8F0',
            },
          ]}
        >
          <Text
            style={[
              typography.caption,
              {
                color: is24x7 ? '#15803D' : colors.text.secondary,
                fontWeight: '700',
                fontSize: 10,
              },
            ]}
          >
            {facility.availability}
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
          {facility.name}
        </Text>

        <View style={styles.metaRow}>
          <MapPin size={12} color={colors.text.muted} />
          <Text
            style={[
              typography.caption,
              { color: colors.text.secondary, marginLeft: 4 },
            ]}
            numberOfLines={1}
          >
            {facility.location}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Text
            style={[
              typography.caption,
              { color: colors.accent.primary, fontWeight: '600', flex: 1, fontSize: 12 },
            ]}
            numberOfLines={1}
          >
            {facility.capacity}
          </Text>
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
  availabilityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  content: {
    gap: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1F5F9',
  },
});
