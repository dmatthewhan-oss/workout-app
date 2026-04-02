import { View, Text, TouchableOpacity } from 'react-native'
import { ArrowUp, ArrowDown, X } from 'phosphor-react-native'
import { type TemplateExercise } from '../../db/queries/templates'

interface TemplateExerciseRowProps {
  exercise: TemplateExercise
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}

export function TemplateExerciseRow({
  exercise,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
}: TemplateExerciseRowProps) {
  return (
    <View className="flex-row items-center py-3 border-b border-divider">
      <TouchableOpacity
        onPress={onMoveUp}
        disabled={isFirst}
        className={`p-1 ${isFirst ? 'opacity-30' : ''}`}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
      >
        <ArrowUp size={20} color="#9A8878" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onMoveDown}
        disabled={isLast}
        className={`p-1 ml-1 ${isLast ? 'opacity-30' : ''}`}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
      >
        <ArrowDown size={20} color="#9A8878" />
      </TouchableOpacity>

      <Text className="flex-1 mx-3 text-base font-dm-sans-medium text-text-primary">
        {exercise.exercise_name}
      </Text>

      <TouchableOpacity
        onPress={onRemove}
        className="p-1"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <X size={20} color="#9A8878" />
      </TouchableOpacity>
    </View>
  )
}
