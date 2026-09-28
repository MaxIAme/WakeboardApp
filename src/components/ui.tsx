import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors } from '@/theme';

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({ label, color = colors.muted, active, onPress }: { label: string; color?: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, { borderColor: color }, active && { backgroundColor: color }]}>
      <Text style={[styles.chipText, { color: active ? colors.bg : color }]}>{label}</Text>
    </Pressable>
  );
}

export function Button({ label, onPress, variant = 'primary' }: { label: string; onPress: () => void; variant?: 'primary' | 'ghost' }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, variant === 'ghost' && styles.ghost]}>
      <Text style={[styles.buttonText, variant === 'ghost' && { color: colors.accent }]}>{label}</Text>
    </Pressable>
  );
}

export const Difficulty = ({ level }: { level: number }) => (
  <Text style={{ color: colors.warn }}>{'●'.repeat(level) + '○'.repeat(5 - level)}</Text>
);

export const text = StyleSheet.create({
  h1: { color: colors.text, fontSize: 26, fontWeight: '800' },
  h2: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  body: { color: colors.text, fontSize: 15, lineHeight: 21 },
  muted: { color: colors.muted, fontSize: 13 },
});

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6 },
  chipText: { fontSize: 12, fontWeight: '600' },
  button: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', marginVertical: 4 },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accent },
  buttonText: { color: colors.bg, fontWeight: '700' },
});
