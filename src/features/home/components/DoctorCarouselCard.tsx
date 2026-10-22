import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Star, Clock } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { RemoteImage } from '../../../components/media/RemoteImage';
import { Doctor } from '../../../types';
import * as Haptics from 'expo-haptics';

interface DoctorCarouselCardProps {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
}

export const DoctorCarouselCard: React.FC<DoctorCarouselCardProps> = ({
  doctor,
  onPress,
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onPress(doctor);
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
      testID={`doctor-carousel-card-${doctor.id}`}
    >
      <View style={styles.imageWrap}>
        <RemoteImage
          uri={doctor.imageUrl}
          style={styles.image}
          fallbackText={doctor.name}
          borderRadius={radius.xl}
        />
        <View style={styles.ratingBadge}>
          <Star size={11} color="#f59e0b" fill="#f59e0b" />
          <Text style={[typography.caption, { color: colors.text.primary, fontWeight: '700', marginLeft: 3 }]}>
            {doctor.rating}
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
          {doctor.name}
        </Text>

        <Text
          style={[typography.caption, { color: colors.accent.primary, fontWeight: '600', fontSize: 12 }]}
          numberOfLines={1}
        >
          {doctor.specialty}
        </Text>

        <View style={styles.availabilityRow}>
          <Clock size={12} color={colors.text.muted} />
          <Text
            style={[
              typography.caption,
              { color: colors.text.secondary, marginLeft: 5, fontSize: 11.5 },
            ]}
            numberOfLines={1}
          >
            {doctor.availability}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={[typography.bodySm, { color: colors.text.primary, fontWeight: '700', fontSize: 14 }]}>
            ₹{doctor.consultationFee}
          </Text>
          <View
            style={[
              styles.bookBtn,
              { backgroundColor: colors.accent.muted, borderRadius: radius.full },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: colors.accent.primary, fontWeight: '700', fontSize: 11 },
              ]}
            >
              Consult
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
    height: 130,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  content: {
    gap: 5,
  },
  availabilityRow: {
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
  bookBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
