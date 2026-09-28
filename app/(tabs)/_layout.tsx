import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';
import { colors } from '@/theme';

const icon = (glyph: string) => ({ color }: { color: ColorValue }) => <Text style={{ color, fontSize: 18 }}>{glyph}</Text>;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Tricks', tabBarIcon: icon('🏄') }} />
      <Tabs.Screen name="progress" options={{ title: 'My List', tabBarIcon: icon('✅') }} />
      <Tabs.Screen name="spots" options={{ title: 'Spots', tabBarIcon: icon('🗺️') }} />
      <Tabs.Screen name="contests" options={{ title: 'Contests', tabBarIcon: icon('🏆') }} />
      <Tabs.Screen name="market" options={{ title: 'Market', tabBarIcon: icon('🛒') }} />
    </Tabs>
  );
}
