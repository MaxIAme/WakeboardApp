import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Card, Chip, text } from '@/components/ui';
import { SPOTS } from '@/data/mock';
import { colors } from '@/theme';
import type { Spot } from '@/types';

const LEVEL_COLOR = { beginner: colors.success, intermediate: colors.warn, pro: '#F87171' } as const;

/** Schematic view of the cable loop with modules placed along it. */
function ParkPlan({ spot }: { spot: Spot }) {
  return (
    <View style={styles.plan}>
      <View style={styles.loop} />
      {spot.modules.map((m) => {
        // Place modules around the rectangular cable loop.
        const angle = m.position * 2 * Math.PI;
        return (
          <View
            key={m.id}
            style={[styles.module, { left: `${50 + 40 * Math.cos(angle)}%`, top: `${50 + 35 * Math.sin(angle)}%`, backgroundColor: LEVEL_COLOR[m.level] }]}
          />
        );
      })}
    </View>
  );
}

export default function SpotsScreen() {
  const [selected, setSelected] = useState<Spot>(SPOTS[0]);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 30, longitude: 20, latitudeDelta: 100, longitudeDelta: 160 }}
        showsUserLocation
      >
        {SPOTS.map((s) => (
          <Marker key={s.id} coordinate={{ latitude: s.latitude, longitude: s.longitude }} title={s.name} onPress={() => setSelected(s)} />
        ))}
      </MapView>

      <Card>
        <Text style={text.h2}>{selected.name}</Text>
        <Text style={text.muted}>
          {selected.country} · {selected.kind}
        </Text>
        <ParkPlan spot={selected} />
        {selected.modules.map((m) => (
          <View key={m.id} style={styles.moduleRow}>
            <Chip label={m.level} color={LEVEL_COLOR[m.level]} />
            <Text style={text.body}>
              {m.name} ({m.type})
            </Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 16 },
  map: { height: 300, borderRadius: 16, marginBottom: 12 },
  plan: { height: 160, marginVertical: 10, backgroundColor: '#0E7490', borderRadius: 12 },
  loop: { position: 'absolute', left: '10%', right: '10%', top: '15%', bottom: '15%', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 40, borderStyle: 'dashed' },
  module: { position: 'absolute', width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: 4 },
  moduleRow: { flexDirection: 'row', alignItems: 'center' },
});
