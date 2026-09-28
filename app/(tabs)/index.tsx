import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Chip, Difficulty, text } from '@/components/ui';
import { TRICKS } from '@/data/tricks';
import { useProgress } from '@/store/progress';
import { colors, statusColor } from '@/theme';
import type { Discipline } from '@/types';

const DISCIPLINES: Discipline[] = ['surface', 'air', 'kicker', 'box', 'rail'];

export default function TricksScreen() {
  const [query, setQuery] = useState('');
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const { goals } = useProgress();

  const tricks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TRICKS.filter(
      (t) =>
        (!discipline || t.discipline === discipline) &&
        (!q || t.name.toLowerCase().includes(q) || t.aliases?.some((a) => a.toLowerCase().includes(q))),
    ).sort((a, b) => a.difficulty - b.difficulty);
  }, [query, discipline]);

  return (
    <View style={styles.screen}>
      <TextInput
        placeholder="Search a trick…"
        placeholderTextColor={colors.muted}
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />
      <View style={styles.row}>
        {DISCIPLINES.map((d) => (
          <Chip key={d} label={d} color={colors.accent} active={discipline === d} onPress={() => setDiscipline(discipline === d ? null : d)} />
        ))}
      </View>
      <FlatList
        data={tricks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => {
          const goal = goals[item.id];
          return (
            <Link href={{ pathname: '/trick/[id]', params: { id: item.id } }} asChild>
              <Pressable>
                <Card>
                  <View style={styles.between}>
                    <Text style={text.h2}>{item.name}</Text>
                    <Difficulty level={item.difficulty} />
                  </View>
                  <Text style={text.muted}>
                    {item.discipline} · {item.approachEdge}
                  </Text>
                  <Text style={[text.body, { marginTop: 6 }]}>{item.summary}</Text>
                  {goal && <Text style={{ color: statusColor[goal.status], marginTop: 6, fontWeight: '700' }}>{goal.status}</Text>}
                </Card>
              </Pressable>
            </Link>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  search: { backgroundColor: colors.card, color: colors.text, borderRadius: 10, padding: 12, marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
