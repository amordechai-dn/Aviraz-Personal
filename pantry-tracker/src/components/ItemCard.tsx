import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FoodItem } from '../types';
import { getCategory } from '../constants';
import { colors, radii, shadow, spacing } from '../theme';
import { QuantityStepper } from './QuantityStepper';
import { useI18n } from '../i18n';

interface Props {
  item: FoodItem;
  onChangeQuantity: (next: number) => void;
  onPress: () => void;
  onLongPress: () => void;
}

/** A single food item, shown as a rounded card with an emoji badge. */
export function ItemCard({
  item,
  onChangeQuantity,
  onPress,
  onLongPress,
}: Props) {
  const { t } = useI18n();
  const category = getCategory(item.categoryId);
  const isOut = item.quantity <= 0;
  const categoryLabel = t(`categories.${category.id}`);
  const unitLabel = t(`units.${item.unit}`);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      style={({ pressed }) => [
        styles.card,
        shadow.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeEmoji}>{category.emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{categoryLabel}</Text>
          {isOut ? (
            <View style={styles.outPill}>
              <Text style={styles.outPillText}>{t('card.out')}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <QuantityStepper
        value={item.quantity}
        unit={unitLabel}
        onChange={onChangeQuantity}
        compact
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.85 },
  badge: {
    width: 46,
    height: 46,
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.md,
  },
  badgeEmoji: { fontSize: 24 },
  info: { flex: 1, marginEnd: spacing.sm },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  meta: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  outPill: {
    marginStart: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  outPillText: { fontSize: 11, fontWeight: '700', color: colors.danger },
});
