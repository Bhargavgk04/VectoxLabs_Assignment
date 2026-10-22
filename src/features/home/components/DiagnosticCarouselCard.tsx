import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { RemoteImage } from '../../../components/media/RemoteImage';
import { DiagnosticService } from '../../../types';
import * as Haptics from 'expo-haptics';

interface DiagnosticCarouselCardProps {
  service: DiagnosticService;
  onPress: (service: DiagnosticService) => void;
}

export const DiagnosticCarouselCard: React.FC<DiagnosticCarouselCardProps> = ({
  service,
  onPress,
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onPress(service);
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
      testID={`diagnostic-card-${service.id}`}
    >
      <View style={styles.imageWrap}>
        <RemoteImage
          uri={service.imageUrl}
          style={styles.image}
          fallbackText={service.name}
          borderRadius={radius.xl}
        />
        <View style={styles.categoryBadge}>
          <Text style={[typography.caption, { color: colors.accent.primary, fontWeight: '700', fontSize: 10 }]}>
            {service.category.toUpperCase()}
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
          {service.name}
        </Text>

        <View style={styles.metaRow}>
          <Clock size={12} color={colors.status.stable} />
          <Text
            style={[
              typography.caption,
              { color: colors.status.stable, marginLeft: 4, fontWeight: '600' },
            ]}
          >
            {service.turnaroundTime}
          </Text>
        </View>

        <Text
          style={[typography.caption, { color: colors.text.muted, fontSize: 11.5 }]}
          numberOfLines={1}
        >
          {service.preparationNotes}
        </Text>

        <View style={styles.footerRow}>
          <Text style={[typography.bodySm, { color: colors.text.primary, fontWeight: '700', fontSize: 14 }]}>
            ₹{service.price}
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
              Order Test
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
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
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
  bookBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
