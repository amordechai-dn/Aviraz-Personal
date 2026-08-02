import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FoodItem, FoodItemInput, StorageLocation } from '../types';
import { CATEGORIES, DEFAULT_UNIT, LOCATIONS, UNITS } from '../constants';
import { colors, radii, spacing } from '../theme';
import { QuantityStepper } from './QuantityStepper';
import { useI18n } from '../i18n';

interface Props {
  visible: boolean;
  /** When set, the modal is in "edit" mode. */
  editing: FoodItem | null;
  onClose: () => void;
  onSubmit: (input: FoodItemInput) => void;
  onDelete?: (item: FoodItem) => void;
}

const DEFAULTS: FoodItemInput = {
  name: '',
  quantity: 1,
  unit: DEFAULT_UNIT,
  categoryId: 'other',
  location: 'Fridge',
  note: '',
};

export function ItemFormModal({
  visible,
  editing,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const { t } = useI18n();
  const [name, setName] = useState(DEFAULTS.name);
  const [quantity, setQuantity] = useState(DEFAULTS.quantity);
  const [unit, setUnit] = useState(DEFAULTS.unit);
  const [categoryId, setCategoryId] = useState(DEFAULTS.categoryId);
  const [location, setLocation] = useState<StorageLocation>(DEFAULTS.location);
  const [note, setNote] = useState('');
  const textAlign = I18nManager.isRTL ? 'right' : 'left';

  // Sync form fields whenever we open (either fresh or with an item to edit).
  useEffect(() => {
    if (!visible) return;
    if (editing) {
      setName(editing.name);
      setQuantity(editing.quantity);
      setUnit(editing.unit);
      setCategoryId(editing.categoryId);
      setLocation(editing.location);
      setNote(editing.note ?? '');
    } else {
      setName(DEFAULTS.name);
      setQuantity(DEFAULTS.quantity);
      setUnit(DEFAULTS.unit);
      setCategoryId(DEFAULTS.categoryId);
      setLocation(DEFAULTS.location);
      setNote('');
    }
  }, [visible, editing]);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSubmit({
      name: name.trim(),
      quantity,
      unit,
      categoryId,
      location,
      note: note.trim() ? note.trim() : null,
    });
  };

  const title = editing ? t('form.editTitle') : t('form.addTitle');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.grabber} />

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: spacing.lg }}
            >
              {/* Name */}
              <Text style={styles.label}>{t('form.name')}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('form.namePlaceholder')}
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { textAlign }]}
                autoFocus={!editing}
                returnKeyType="done"
              />

              {/* Location */}
              <Text style={styles.label}>{t('form.location')}</Text>
              <View style={styles.segment}>
                {LOCATIONS.map((loc) => {
                  const active = location === loc.id;
                  return (
                    <Pressable
                      key={loc.id}
                      onPress={() => setLocation(loc.id)}
                      style={[
                        styles.segmentItem,
                        active && styles.segmentItemActive,
                      ]}
                    >
                      <Text style={styles.segmentEmoji}>{loc.emoji}</Text>
                      <Text
                        style={[
                          styles.segmentText,
                          active && styles.segmentTextActive,
                        ]}
                      >
                        {t(`locations.${loc.id}`)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Category */}
              <Text style={styles.label}>{t('form.category')}</Text>
              <View style={styles.chips}>
                {CATEGORIES.map((cat) => {
                  const active = categoryId === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setCategoryId(cat.id)}
                      style={[styles.chip, active && styles.chipActive]}
                    >
                      <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {t(`categories.${cat.id}`)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Quantity + unit */}
              <Text style={styles.label}>{t('form.quantity')}</Text>
              <View style={styles.qtyRow}>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  unit={t(`units.${unit}`)}
                />
              </View>

              <View style={styles.chips}>
                {UNITS.map((u) => {
                  const active = unit === u;
                  return (
                    <Pressable
                      key={u}
                      onPress={() => setUnit(u)}
                      style={[styles.unitChip, active && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {t(`units.${u}`)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Note */}
              <Text style={styles.label}>{t('form.note')}</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={t('form.notePlaceholder')}
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.noteInput, { textAlign }]}
                multiline
              />

              {editing && onDelete ? (
                <Pressable
                  onPress={() => onDelete(editing)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteBtnText}>{t('form.delete')}</Text>
                </Pressable>
              ) : null}
            </ScrollView>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
                style={[styles.actionBtn, styles.cancelBtn]}
              >
                <Text style={styles.cancelText}>{t('form.cancel')}</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={!canSave}
                style={[
                  styles.actionBtn,
                  styles.saveBtn,
                  !canSave && styles.saveBtnDisabled,
                ]}
              >
                <Text style={styles.saveText}>
                  {editing ? t('form.save') : t('form.create')}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,35,26,0.35)',
    justifyContent: 'flex-end',
  },
  sheetWrap: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    maxHeight: '92%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  close: { fontSize: 18, color: colors.textMuted, fontWeight: '700' },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: colors.text,
  },
  noteInput: { minHeight: 64, textAlignVertical: 'top' },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radii.sm,
    gap: 6,
  },
  segmentItemActive: { backgroundColor: colors.primary },
  segmentEmoji: { fontSize: 16 },
  segmentText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  segmentTextActive: { color: colors.white },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  unitChip: {
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipEmoji: { fontSize: 15 },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  chipTextActive: { color: colors.primaryDark },
  qtyRow: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  deleteBtn: {
    marginTop: spacing.lg,
    paddingVertical: 14,
    borderRadius: radii.md,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
  },
  deleteBtnText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  cancelBtn: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  cancelText: { fontSize: 16, fontWeight: '700', color: colors.text },
  saveBtn: { backgroundColor: colors.primary },
  saveBtnDisabled: { opacity: 0.5 },
  saveText: { fontSize: 16, fontWeight: '800', color: colors.white },
});
