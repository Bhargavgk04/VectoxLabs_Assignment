import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { spacing } from '../../../theme/spacing';

export interface CarouselSectionProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  keyExtractor: (item: T) => string;
  onViewAll?: () => void;
  viewAllText?: string;
  testID?: string;
}

export function CarouselSection<T>({
  title,
  subtitle,
  data,
  renderItem,
  keyExtractor,
  onViewAll,
  viewAllText = 'View All',
  testID,
}: CarouselSectionProps<T>): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        onViewAll={onViewAll}
        viewAllText={viewAllText}
        style={styles.header}
      />

      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 22,
  },
  header: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    gap: 16,
  },
});
