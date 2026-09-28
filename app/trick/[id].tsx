import { Stack, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Manikin3D from '@/components/Manikin3D';
import { Button, Card, Chip, Difficulty, text } from '@/components/ui';
import { trickById } from '@/data/tricks';
import { useProgress } from '@/store/progress';
import { colors, statusColor } from '@/theme';
import type { GoalStatus } from '@/types';

const STATUSES: GoalStatus[] = ['wishlist', 'learning', 'landed', 'mastered'];

function TrickVideo({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => (p.loop = true));
  return <VideoView player={player} style={styles.video} nativeControls />;
}

export default function TrickScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trick = trickById(id);
  const { goals, setStatus, addAttempt, saveNotes } = useProgress();
  const goal = goals[id];
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useState<number | null>(null);
  const [notes, setNotes] = useState(goal?.howILandedIt ?? '');

  useEffect(() => setNotes(goal?.howILandedIt ?? ''), [goal?.howILandedIt]);

  if (!trick) return <Text style={[text.body, { padding: 16 }]}>Trick not found.</Text>;

  // Map each written step to a point of the animation so tapping a step freezes the manikin there.
  const scrub = step == null ? null : (step + 0.5) / trick.steps.length;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Stack.Screen options={{ title: trick.name }} />
      <View style={styles.between}>
        <Text style={text.h1}>{trick.name}</Text>
        <Difficulty level={trick.difficulty} />
      </View>
      <Text style={text.muted}>
        {trick.discipline} · approach {trick.approachEdge}
        {trick.aliases ? ` · aka ${trick.aliases.join(', ')}` : ''}
      </Text>

      <View style={{ marginTop: 12 }}>
        <Manikin3D poses={trick.poses} playing={playing} scrub={scrub} />
        <View style={styles.row}>
          <Button label={playing && step == null ? 'Pause' : 'Play'} onPress={() => { setStep(null); setPlaying(!(playing && step == null)); }} variant="ghost" />
          <Text style={[text.muted, { marginLeft: 10, flex: 1 }]}>Tap a step below to freeze the manikin on it.</Text>
        </View>
      </View>

      <Text style={text.body}>{trick.summary}</Text>

      <Text style={text.h2}>Step by step</Text>
      {trick.steps.map((s, i) => (
        <Card key={s.title} style={step === i ? { borderColor: colors.accent } : undefined}>
          <Text style={[text.body, { fontWeight: '700' }]} onPress={() => setStep(step === i ? null : i)}>
            {i + 1}. {s.title}
          </Text>
          {s.handle && <Text style={text.body}>🎯 Handle / cable: {s.handle}</Text>}
          {s.legs && <Text style={text.body}>🦵 Legs: {s.legs}</Text>}
          {s.body && <Text style={text.body}>🧍 Body: {s.body}</Text>}
          <Text style={[text.muted, { marginTop: 4 }]}>{s.detail}</Text>
        </Card>
      ))}

      <Text style={text.h2}>Common mistakes</Text>
      {trick.commonMistakes.map((m) => (
        <Text key={m} style={text.body}>• {m}</Text>
      ))}

      {trick.videoUrl && (
        <>
          <Text style={text.h2}>Video</Text>
          <TrickVideo url={trick.videoUrl} />
        </>
      )}

      <Text style={text.h2}>My progression</Text>
      <View style={styles.wrap}>
        {STATUSES.map((s) => (
          <Chip key={s} label={s} color={statusColor[s]} active={goal?.status === s} onPress={() => setStatus(trick.id, s)} />
        ))}
      </View>
      <Button label={`+1 attempt (${goal?.attempts ?? 0})`} onPress={() => addAttempt(trick.id)} />
      <TextInput
        multiline
        placeholder="How did you manage to land it? What made it click?"
        placeholderTextColor={colors.muted}
        value={notes}
        onChangeText={setNotes}
        onEndEditing={() => saveNotes(trick.id, notes)}
        style={styles.notes}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 16, paddingBottom: 48 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  video: { width: '100%', aspectRatio: 16 / 9, borderRadius: 12 },
  notes: { backgroundColor: colors.card, color: colors.text, borderRadius: 10, padding: 12, minHeight: 90, marginTop: 8, textAlignVertical: 'top' },
});
