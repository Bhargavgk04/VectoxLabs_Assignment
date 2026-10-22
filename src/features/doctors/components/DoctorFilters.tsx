import { View, StyleSheet, ScrollView } from 'react-native';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Chip } from '../../../components/ui/Chip';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export interface DoctorFiltersProps {
  search: string;
  onChangeSearch: (text: string) => void;
  specialties: string[];
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  specialtyCounts: Record<string, number>;
  onReset?: () => void;
}

export function DoctorFilters({
  search,
  onChangeSearch,
  specialties,
  selectedSpecialty,
  onSelectSpecialty,
  specialtyCounts,
  onReset,
}: DoctorFiltersProps): React.JSX.Element {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onSelectSpecialty('All');
      onChangeSearch('');
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={search}
        onChangeText={onChangeSearch}
        placeholder="Search doctors or specialty..."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {specialties.map(spec => (
          <Chip
            key={spec}
            label={spec}
            selected={selectedSpecialty === spec}
            count={specialtyCounts[spec]}
            onPress={() => onSelectSpecialty(spec)}
          />
        ))}
        {(selectedSpecialty !== 'All' || search.trim() !== '') && (
          <Chip
            label="Reset"
            selected={false}
            onPress={handleReset}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chipsScroll: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingBottom: spacing.xs,
  },
});
