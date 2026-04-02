import { Tabs } from 'expo-router'
import { House, ChartLine } from 'phosphor-react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B07545',
        tabBarInactiveTintColor: '#9A8878',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8DDD0',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: 'DMSans_500Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <ChartLine size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
