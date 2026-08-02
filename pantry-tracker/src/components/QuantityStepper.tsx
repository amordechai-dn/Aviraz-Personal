import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';

interface Props {
  value: number;
  onChange: (next: number) => void;
  unit?: string;
  min?: number;
  compact?: boolean;
}

/** Rounded +/- stepper used on cards and in the form. */
export function QuantityStepper({
  value,
  onChange,
  unit,
  min = 0,
  compact,
}: Props) {
  const size = compact ? 30 : 36;
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(value + 1);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={dec}
        hitSlop={8}
        style={({ pressed }) => [
          styles.btn,
          { width: size, height: size, borderRadius: size / 2 },
          pressed && styles.btnPressed,
          value <= min && styles.btnDisabled,
        ]}
        disabled={value <= min}
      >
        <Text style={styles.btnLabel}>−</Text>
      </Pressable>

      <View style={styles.valueWrap}>
        <Text style={[styles.value, compact && styles.valueCompact]}>
          {formatQty(value)}
        </Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      <Pressable
        onPress={inc}
        hitSlop={8}
        style={({ pressed }) => [
          styles.btn,
          styles.btnPrimary,
          { width: size, height: size, borderRadius: size / 2 },
          pressed && styles.btnPressed,
        ]}
      >
        <Text style={[styles.btnLabel, styles.btnLabelPrimary]}>+</Text>
      </Pressable>
    </View>
  );
}

function formatQty(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnPressed: { opacity: 0.6 },
  btnDisabled: { opacity: 0.4 },
  btnLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    lineHeight: 22,
  },
  btnLabelPrimary: { color: colors.white },
  valueWrap: {
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  value: { fontSize: 17, fontWeight: '800', color: colors.text },
  valueCompact: { fontSize: 16 },
  unit: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
});
