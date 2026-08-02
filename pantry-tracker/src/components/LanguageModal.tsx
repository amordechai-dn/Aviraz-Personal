import React from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme';
import { useI18n } from '../i18n';
import { Lang } from '../i18n/translations';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const OPTIONS: { id: Lang; labelKey: string; native: string; flag: string }[] = [
  { id: 'en', labelKey: 'language.english', native: 'English', flag: '🇬🇧' },
  { id: 'he', labelKey: 'language.hebrew', native: 'עברית', flag: '🇮🇱' },
];

export function LanguageModal({ visible, onClose }: Props) {
  const { t, lang, setLanguage, reload } = useI18n();

  const choose = async (next: Lang) => {
    if (next === lang) {
      onClose();
      return;
    }
    const needsReload = await setLanguage(next);
    onClose();
    if (needsReload) {
      Alert.alert(
        t('language.restartTitle'),
        t('language.restartMessage'),
        [
          { text: t('language.restartLater'), style: 'cancel' },
          {
            text: t('language.restartNow'),
            onPress: async () => {
              const ok = await reload();
              if (!ok) {
                Alert.alert(
                  t('language.restartTitle'),
                  t('language.restartManual')
                );
              }
            },
          },
        ]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>{t('language.title')}</Text>
          {OPTIONS.map((opt) => {
            const active = opt.id === lang;
            return (
              <Pressable
                key={opt.id}
                onPress={() => choose(opt.id)}
                style={[styles.row, active && styles.rowActive]}
              >
                <Text style={styles.flag}>{opt.flag}</Text>
                <Text style={[styles.label, active && styles.labelActive]}>
                  {opt.native}
                </Text>
                {active ? <Text style={styles.check}>✓</Text> : null}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,35,26,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.bg,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  rowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  flag: { fontSize: 22 },
  label: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  labelActive: { color: colors.primaryDark },
  check: { fontSize: 18, fontWeight: '800', color: colors.primary },
});
