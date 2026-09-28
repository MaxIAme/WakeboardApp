import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, text } from '@/components/ui';
import { LISTINGS } from '@/data/mock';
import { colors } from '@/theme';

export default function MarketScreen() {
  return (
    <FlatList
      contentContainerStyle={styles.screen}
      data={LISTINGS}
      keyExtractor={(l) => l.id}
      ListHeaderComponent={<Button label="Sell my gear" onPress={() => Alert.alert('Coming soon', 'Photo upload + listing form.')} />}
      renderItem={({ item }) => (
        <Card style={item.sponsored ? { borderColor: colors.warn } : undefined}>
          {item.sponsored && <Text style={[text.muted, { color: colors.warn }]}>Sponsored</Text>}
          <View style={styles.between}>
            <Text style={[text.body, { fontWeight: '700', flex: 1 }]}>{item.title}</Text>
            <Text style={[text.h2, { marginTop: 0 }]}>{item.priceEur} €</Text>
          </View>
          <View style={styles.row}>
            <Chip label={item.category} color={colors.accent} />
            <Chip label={item.condition} />
            <Text style={text.muted}>📍 {item.location}</Text>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { padding: 16 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
});
