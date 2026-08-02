import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FoodItem, FoodItemInput, StorageLocation } from '../types';
import { LOCATIONS } from '../constants';
import { colors, radii, spacing, typography } from '../theme';
import { usePantry } from '../hooks/usePantry';
import { ItemCard } from '../components/ItemCard';
import { Fab } from '../components/Fab';
import { EmptyState } from '../components/EmptyState';
import { ItemFormModal } from '../components/ItemFormModal';
import { LanguageModal } from '../components/LanguageModal';
import { useI18n } from '../i18n';

interface Section {
  location: StorageLocation;
  emoji: string;
  data: FoodItem[];
}

export function HomeScreen() {
  const { t } = useI18n();
  const {
    items,
    loading,
    error,
    addItem,
    editItem,
    removeItem,
    changeQuantity,
  } = usePantry();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [langOpen, setLangOpen] = useState(false);

  // Group items by storage location, preserving the canonical order and
  // hiding empty groups.
  const sections = useMemo<Section[]>(() => {
    return LOCATIONS.map((loc) => ({
      location: loc.id,
      emoji: loc.emoji,
      data: items.filter((i) => i.location === loc.id),
    })).filter((s) => s.data.length > 0);
  }, [items]);

  const openAdd = () => {
    setEditing(null);
    setModalVisible(true);
  };

  const openEdit = (item: FoodItem) => {
    setEditing(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditing(null);
  };

  const confirmDelete = (item: FoodItem) => {
    Alert.alert(
      t('deleteConfirm.title'),
      t('deleteConfirm.message', { name: item.name }),
      [
        { text: t('deleteConfirm.cancel'), style: 'cancel' },
        {
          text: t('deleteConfirm.confirm'),
          style: 'destructive',
          onPress: () => {
            removeItem(item.id);
            if (editing?.id === item.id) closeModal();
          },
        },
      ]
    );
  };

  const handleSubmit = async (input: FoodItemInput) => {
    if (editing) {
      await editItem(editing.id, input);
    } else {
      await addItem(input);
    }
    closeModal();
  };

  const totalCount = items.length;
  const locationCount = sections.length;

  const subtitle =
    totalCount === 0
      ? t('summary.empty')
      : t('summary.across', {
          items:
            totalCount === 1
              ? t('summary.items_one', { count: totalCount })
              : t('summary.items_other', { count: totalCount }),
          locations:
            locationCount === 1
              ? t('summary.locations_one', { count: locationCount })
              : t('summary.locations_other', { count: locationCount }),
        });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={typography.title}>{t('app.title')}</Text>
          <Text style={typography.subtitle}>{subtitle}</Text>
        </View>
        <Pressable
          onPress={() => setLangOpen(true)}
          style={({ pressed }) => [styles.langBtn, pressed && styles.langBtnPressed]}
          accessibilityLabel={t('language.a11y')}
          accessibilityRole="button"
        >
          <Text style={styles.langBtnText}>🌐 {t('language.short')}</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>
                {(section as Section).emoji}
              </Text>
              <Text style={styles.sectionTitle}>
                {t(`locations.${(section as Section).location}`)}
              </Text>
              <Text style={styles.sectionCount}>
                {(section as Section).data.length}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onChangeQuantity={(next) => changeQuantity(item.id, next)}
              onPress={() => openEdit(item)}
              onLongPress={() => confirmDelete(item)}
            />
          )}
        />
      )}

      <Fab onPress={openAdd} />

      <ItemFormModal
        visible={modalVisible}
        editing={editing}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onDelete={confirmDelete}
      />

      <LanguageModal visible={langOpen} onClose={() => setLangOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerText: { flex: 1 },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginStart: spacing.md,
  },
  langBtnPressed: { opacity: 0.7 },
  langBtnText: { fontSize: 14, fontWeight: '700', color: colors.text },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionEmoji: { fontSize: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    backgroundColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: {
    color: colors.danger,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
