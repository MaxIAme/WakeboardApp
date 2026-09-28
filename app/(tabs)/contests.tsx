import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, text } from '@/components/ui';
import { CONTESTS, SPOTS } from '@/data/mock';
import { trickById } from '@/data/tricks';
import { colors } from '@/theme';
import type { Contest } from '@/types';

export default function ContestsScreen() {
  const [mode, setMode] = useState<Contest['mode'] | null>(null);
  const contests = CONTESTS.filter((c) => !mode || c.mode === mode);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Card>
        <Text style={text.h2}>Challenge a rider</Text>
        <Text style={text.body}>Pick a trick, film your best attempt and send the challenge. The other rider has 7 days to answer with a video.</Text>
        <Button label="New challenge" onPress={() => Alert.alert('Coming soon', 'Challenges need an account (Supabase auth).')} />
      </Card>

      <View style={styles.row}>
        <Chip label="virtual" color={colors.accent} active={mode === 'virtual'} onPress={() => setMode(mode === 'virtual' ? null : 'virtual')} />
        <Chip label="live" color={colors.warn} active={mode === 'live'} onPress={() => setMode(mode === 'live' ? null : 'live')} />
      </View>

      {contests.map((c) => (
        <Card key={c.id}>
          <Text style={text.h2}>{c.title}</Text>
          <Text style={text.muted}>
            {c.mode === 'live' ? `📍 ${SPOTS.find((s) => s.id === c.spotId)?.name ?? 'TBA'}` : '📹 Video submissions'} ·{' '}
            {new Date(c.startsAt).toLocaleDateString()} → {new Date(c.endsAt).toLocaleDateString()}
          </Text>
          <Text style={[text.body, { marginTop: 6 }]}>Tricks: {c.trickIds.map((id) => trickById(id)?.name ?? id).join(', ')}</Text>
          <Text style={text.muted}>{c.participants} riders registered</Text>
          <Button label={c.mode === 'virtual' ? 'Submit a video' : 'Register'} variant="ghost" onPress={() => Alert.alert('Coming soon')} />
        </Card>
      ))}

      <Button label="Organize a contest" onPress={() => Alert.alert('Coming soon', 'Organizer flow: format, judges, heats, live scoring.')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ screen: { padding: 16 }, row: { flexDirection: 'row', marginVertical: 8 } });
