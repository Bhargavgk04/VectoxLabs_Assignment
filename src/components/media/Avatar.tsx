import { View, StyleSheet, ViewStyle } from 'react-native';
import { RemoteImage } from './RemoteImage';
import { colors } from '../../theme/colors';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  uri?: string;
  name: string;
  size?: AvatarSize;
  statusDotColor?: string;
  style?: ViewStyle;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 72,
};

export function Avatar({
  uri,
  name,
  size = 'md',
  statusDotColor,
  style,
}: AvatarProps): React.JSX.Element {
  const dimension = SIZE_MAP[size];

  return (
    <View style={[styles.wrapper, { width: dimension, height: dimension }, style]}>
      <RemoteImage
        uri={uri}
        fallbackText={name}
        width={dimension}
        height={dimension}
        borderRadius={dimension / 2}
        accessibilityLabel={`Avatar of ${name}`}
      />
      {statusDotColor && (
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: statusDotColor,
              right: size === 'xl' ? 4 : 0,
              bottom: size === 'xl' ? 4 : 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.surface1,
  },
});
