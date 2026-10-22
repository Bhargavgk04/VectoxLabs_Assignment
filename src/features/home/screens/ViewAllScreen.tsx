import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { elevation } from '../../../theme/elevation';
import { SearchBar } from '../../../components/ui/SearchBar';
import { EmptyState } from '../../../components/ui/EmptyState';
import { RemoteImage } from '../../../components/media/RemoteImage';
import { getDepartments } from '../../../services/departmentService';
import { getDoctors } from '../../../services/doctorService';
import {
  getDiagnosticServices,
  getHospitalFacilities,
} from '../../../services/facilityService';
import { RootStackParamList } from '../../../navigation/types';
import { getSafeTopPadding } from '../../../utils/safeArea';
import { useResponsive } from '../../../hooks/useResponsive';

type Props = NativeStackScreenProps<RootStackParamList, 'ViewAll'>;

interface ListItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  raw: any;
}

export const ViewAllScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title, category } = route.params;
  const insets = useSafeAreaInsets();
  const topPadding = getSafeTopPadding(insets, 4);
  const { containerMaxWidth, horizontalPadding, doctorColumns, cardGap } =
    useResponsive();

  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCategoryData = useCallback(async () => {
    setLoading(true);
    try {
      if (category === 'departments') {
        const depts = await getDepartments();
        setItems(
          depts.map((d) => ({
            id: d.id,
            title: d.name,
            subtitle: `${d.floor} • ${d.activeDoctorsCount} Specialists`,
            tag: d.code,
            imageUrl: d.imageUrl,
            raw: d,
          }))
        );
      } else if (category === 'doctors') {
        const docs = await getDoctors();
        setItems(
          docs.map((d) => ({
            id: d.id,
            title: d.name,
            subtitle: `${d.specialty} • ₹${d.consultationFee}`,
            tag: `★ ${d.rating}`,
            imageUrl: d.imageUrl,
            raw: d,
          }))
        );
      } else if (category === 'diagnostics') {
        const diags = await getDiagnosticServices();
        setItems(
          diags.map((d) => ({
            id: d.id,
            title: d.name,
            subtitle: `${d.turnaroundTime} • ₹${d.price}`,
            tag: d.category.toUpperCase(),
            imageUrl: d.imageUrl,
            raw: d,
          }))
        );
      } else if (category === 'facilities') {
        const facs = await getHospitalFacilities();
        setItems(
          facs.map((f) => ({
            id: f.id,
            title: f.name,
            subtitle: `${f.location} • Capacity: ${f.capacity}`,
            tag: f.availability.toLowerCase().includes('24/7') ? '24/7' : 'Standard',
            imageUrl: f.imageUrl,
            raw: f,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleSelectItem = useCallback((item: ListItem) => {
    if (category === 'doctors') {
      navigation.navigate('DoctorProfile', { doctorId: item.id });
    } else {
      navigation.navigate('DetailView', {
        id: item.id,
        category: category.toUpperCase(),
        title: item.title,
        subtitle: item.subtitle,
        imageUrl: item.imageUrl,
        description: item.raw.description || `Full clinical profile for ${item.title}.`,
        metadata: {
          Category: category.toUpperCase(),
          Identifier: item.id,
          Location: item.raw.location || item.raw.floor || 'Main Campus Wing',
        },
      });
    }
  }, [category, navigation]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => (
      <Pressable
        onPress={() => handleSelectItem(item)}
        style={({ pressed }) => [
          doctorColumns > 1 && { flex: 1 },
          styles.itemCard,
          pressed ? { opacity: 0.9, transform: [{ scale: 0.99 }] } : null,
        ]}
      >
        <RemoteImage
          uri={item.imageUrl}
          style={styles.itemImage}
          fallbackText={item.title}
          borderRadius={12}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>

        <View style={styles.itemRightActions}>
          {category === 'doctors' ? (
            <View style={styles.ratingPill}>
              <Star size={11} color="#D97706" fill="#D97706" />
              <Text style={styles.ratingText}>{item.tag.replace('★', '').trim()}</Text>
            </View>
          ) : (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          )}

          <View style={styles.arrowCircle}>
            <ChevronRight size={16} color={colors.accent.primary} />
          </View>
        </View>
      </Pressable>
    ),
    [handleSelectItem, doctorColumns, category]
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.canvas, paddingTop: topPadding },
      ]}
      testID="view-all-screen"
    >
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface1,
            borderBottomColor: colors.borderSubtle,
            paddingHorizontal: horizontalPadding,
            paddingVertical: spacing.sm,
          },
        ]}
      >
        <View style={[styles.headerInner, { maxWidth: containerMaxWidth }]}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            testID="view-all-back-btn"
            hitSlop={10}
          >
            <ChevronLeft size={24} color={colors.text.primary} />
            <Text style={[typography.body, { color: colors.text.primary, marginLeft: 4, fontWeight: '600' }]}>
              Back
            </Text>
          </Pressable>
          <Text
            style={[
              typography.h3,
              { color: colors.text.primary, fontWeight: '700' },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Search Filter */}
      <View style={[styles.searchBox, { paddingHorizontal: horizontalPadding, paddingVertical: spacing.sm }]}>
        <View style={{ maxWidth: containerMaxWidth, width: '100%', alignSelf: 'center' }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={`Filter ${title.toLowerCase()}...`}
          />
        </View>
      </View>

      {/* Vertical FlatList with Responsive Columns */}
      <FlatList
        key={`view-all-${doctorColumns}`}
        numColumns={doctorColumns}
        columnWrapperStyle={doctorColumns > 1 ? { gap: cardGap } : undefined}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: insets.bottom + spacing.xl,
            maxWidth: containerMaxWidth,
            width: '100%',
            alignSelf: 'center',
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadCategoryData}
            tintColor={colors.accent.primary}
          />
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title={`No ${title} Found`}
              description={`No results matched "${search}". Try searching with a different term.`}
            />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    ...elevation.level1,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  searchBox: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.canvas,
  },
  listContent: {
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface1,
    borderRadius: 16,
    padding: spacing.sm + 2,
    ...elevation.level1,
  },
  itemImage: {
    width: 52,
    height: 52,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  itemTitle: {
    ...typography.labelBold,
    color: colors.text.primary,
    fontSize: 14,
  },
  itemSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  itemRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  tagBadge: {
    backgroundColor: colors.accent.muted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  tagText: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '700',
    fontSize: 10,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
