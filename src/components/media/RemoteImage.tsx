import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';
import { Skeleton } from '../ui/Skeleton';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import { ImageIcon } from 'lucide-react-native';

export interface RemoteImageProps {
  uri?: string;
  fallbackText?: string;
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  contentFit?: ImageContentFit;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export function RemoteImage({
  uri,
  fallbackText,
  width = '100%',
  height = 160,
  borderRadius = radius.md,
  contentFit = 'cover',
  accessibilityLabel,
  style,
}: RemoteImageProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(Boolean(uri));
  const [hasError, setHasError] = useState(!uri);

  useEffect(() => {
    setHasError(!uri);
    setIsLoading(Boolean(uri));
  }, [uri]);

  const initials = fallbackText
    ? fallbackText
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : undefined;

  return (
    <View
      style={[
        styles.container,
        {
          width: width as any,
          height,
          borderRadius,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || fallbackText || 'Image'}
    >
      {/* Loading Skeleton Indicator */}
      {isLoading && !hasError && (
        <View style={StyleSheet.absoluteFill}>
          <Skeleton width="100%" height={height} borderRadius={borderRadius} />
        </View>
      )}

      {/* Render Main Image */}
      {uri && !hasError ? (
        <Image
          source={{ uri }}
          style={[styles.image, { borderRadius }]}
          contentFit={contentFit}
          transition={300}
          cachePolicy="memory-disk"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      ) : (
        /* Fallback Container for Broken URLs or Missing Media */
        <View style={[styles.fallbackContainer, { borderRadius }]}>
          {initials ? (
            <View style={styles.initialsCircle}>
              <Text style={styles.fallbackInitials}>{initials}</Text>
            </View>
          ) : (
            <ImageIcon size={22} color={colors.text.muted} />
          )}
          {typeof height === 'number' && height >= 110 ? (
            <Text style={styles.fallbackLabel}>Image unavailable</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  initialsCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackInitials: {
    ...typography.labelBold,
    color: colors.accent.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  fallbackLabel: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 10,
    marginTop: 4,
  },
});
