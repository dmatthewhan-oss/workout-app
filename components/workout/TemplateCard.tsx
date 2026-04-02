import { TouchableOpacity, View, Text } from 'react-native'
import { ArrowRight } from 'phosphor-react-native'
import { type TemplateWithCount } from '../../db/queries/templates'

interface TemplateCardProps {
  template: TemplateWithCount
  onPress: () => void
}

export function TemplateCard({ template, onPress }: TemplateCardProps) {
  const exerciseLabel =
    template.exercise_count === 1 ? '1 exercise' : `${template.exercise_count} exercises`

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-surface border border-border rounded-2xl p-5 flex-row items-center mb-3"
      style={{
        shadowColor: '#2A1F14',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-1">
        <Text className="text-lg font-dm-sans-semibold text-text-primary">{template.name}</Text>
        <Text className="mt-1 text-sm font-dm-sans text-text-secondary">{exerciseLabel}</Text>
      </View>
      <ArrowRight size={20} color="#9A8878" />
    </TouchableOpacity>
  )
}
