import { View, Text, SafeAreaView } from 'react-native'

export default function ProgressScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-8">
        <Text className="text-3xl font-dm-sans-bold text-text-primary">
          Progress
        </Text>
        <Text className="mt-2 text-base font-dm-sans text-text-secondary">
          Placeholder — volume charts will appear here
        </Text>
      </View>
    </SafeAreaView>
  )
}
