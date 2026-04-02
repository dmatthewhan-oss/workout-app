import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Plus, Barbell } from 'phosphor-react-native'
import { TemplateCard } from '../../components/workout/TemplateCard'
import { Button } from '../../components/ui/Button'
import { useTemplates } from '../../hooks/useTemplates'

export default function HomeScreen() {
  const { templates, isLoading } = useTemplates()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 32, paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-dm-sans-bold text-text-primary">My Workouts</Text>
          <TouchableOpacity
            onPress={() => router.push('/template/create')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Plus size={28} color="#B07545" />
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {isLoading && (
          <View className="items-center py-16">
            <ActivityIndicator color="#B07545" />
          </View>
        )}

        {/* Empty state */}
        {!isLoading && templates.length === 0 && (
          <View className="items-center py-16 px-4">
            <Barbell size={48} color="#C4B5A8" />
            <Text className="mt-4 text-lg font-dm-sans-semibold text-text-primary text-center">
              No workouts yet
            </Text>
            <Text className="mt-2 text-base font-dm-sans text-text-secondary text-center">
              Create your first template to get started.
            </Text>
            <View className="mt-6 w-full">
              <Button
                label="Create Template"
                onPress={() => router.push('/template/create')}
                fullWidth
              />
            </View>
          </View>
        )}

        {/* Template list */}
        {!isLoading && templates.length > 0 && (
          <View>
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPress={() => router.push(`/template/${template.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
