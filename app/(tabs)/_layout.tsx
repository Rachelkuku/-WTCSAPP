import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { View, Text, StyleSheet, Platform } from 'react-native';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconsName;
  outlineName: IoniconsName;
  label: string;
  focused: boolean;
}

function NavItem({ name, outlineName, label, focused }: TabIconProps) {
  return (
    <View style={navStyles.item}>
      <View style={[navStyles.indicator, focused && navStyles.indicatorActive]}>
        <Ionicons
          name={focused ? name : outlineName}
          size={22}
          color={focused ? MD3.primary : MD3.onSurfaceVariant}
        />
      </View>
      <Text style={[navStyles.label, focused && navStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const navStyles = StyleSheet.create({
  item: { alignItems: 'center', justifyContent: 'center', paddingTop: 8 },
  indicator: {
    width: 56,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  indicatorActive: { backgroundColor: MD3.primaryContainer },
  label: { fontSize: 11, fontWeight: '500', color: MD3.onSurfaceVariant },
  labelActive: { color: MD3.primary, fontWeight: '700' },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: MD3.surface,
          borderTopColor: MD3.outlineVariant,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 80 : 64,
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
          elevation: 8,
          shadowColor: MD3.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavItem name="home" outlineName="home-outline" label="홈" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="apply/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavItem name="document-text" outlineName="document-text-outline" label="신청·공지" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="membership/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavItem name="gift" outlineName="gift-outline" label="혜택" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="community/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavItem name="people" outlineName="people-outline" label="커뮤니티" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="my/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavItem name="person" outlineName="person-outline" label="마이" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
