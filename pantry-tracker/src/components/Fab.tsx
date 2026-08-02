import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, shadow } from '../theme';
import { useI18n } from '../i18n';

interface Props {
  onPress: () => void;
}

/** Prominent floating "+" button to add a new item. */
export function Fab({ onPress }: Props) {
  const { t } = useI18n();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        shadow.fab,
        pressed && styles.pressed,
      ]}
      accessibilityLabel={t('fab.add')}
      accessibilityRole="button"
    >
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    end: 20, // flips to the left in RTL
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
  plus: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '600',
    lineHeight: 38,
    marginTop: -2,
  },
});
