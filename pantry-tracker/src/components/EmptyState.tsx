import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { useI18n } from '../i18n';

/** Friendly empty state shown when the pantry has no items yet. */
export function EmptyState() {
  const { t } = useI18n();
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>🧺</Text>
      <Text style={styles.title}>{t('empty.title')}</Text>
      <Text style={styles.body}>{t('empty.body')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingBottom: 80,
  },
  emoji: { fontSize: 64, marginBottom: spacing.lg },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: colors.textMuted,
    textAlign: 'center',
  },
});
