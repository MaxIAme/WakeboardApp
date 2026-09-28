import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, text } from '@/components/ui';
import { trickById } from '@/data/tricks';
import { useProgress } from '@/store/progress';
import { colors, statusColor } from '@/theme';
import type { GoalStatus } from '@/types';

const SECTIONS: { status: GoalStatus; title: string }[] = [
  { status: 'learning', title: 'Working on' },
  { status: 'wishlist', title: 'Want to learn' },
  { status: 'landed', title: 'Landed' },
  { status: 'mastered', title: 'Mastered' },
];

export default function ProgressScreen() {
  const { goals } = useProgress();
  const all = Object.values(goals);
  const landed = all.filter((g) => g.status === 'landed' || g.status === 'mastered').length;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Card>
        <Text style={text.h1}>
          {landed} / {all.length}
        </Text>
        <Text style={text.muted}>tricks landed from your list</Text>
      </Card>
      {all.length === 0 && <Text style={text.body}>Open a trick and set a status to start your list.</Text>}
      {SECTIONS.map(({ status, title }) => {
        const items = all.filter((g) => g.status === status);
        if (!items.length) return null;
        return (
          <View key={status}>
            <Text style={[text.h2, { color: statusColor[status] }]}>{title}</Text>
            {items.map((g) => (
              <Link key={g.trickId} href={{ pathname: '/trick/[id]', params: { id: g.trickId } }} asChild>
                <Pressable>
                  <Card>
                    <Text style={[text.body, { fontWeight: '700' }]}>{trickById(g.trickId)?.name ?? g.trickId}</Text>
                    <Text style={text.muted}>
                      {g.attempts} attempts{g.landedAt ? ` · landed ${new Date(g.landedAt).toLocaleDateString()}` : ''}
                    </Text>
                    {g.howILandedIt ? <Text style={[text.body, { marginTop: 4, color: colors.muted }]}>“{g.howILandedIt}”</Text> : null}
                  </Card>
                </Pressable>
              </Link>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ screen: { padding: 16 } });
