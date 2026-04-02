import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, PencilSimple, Check, X, Barbell } from 'phosphor-react-native'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { TemplateExerciseRow } from '../../components/workout/TemplateExerciseRow'
import { useTemplate } from '../../hooks/useTemplate'

export default function EditTemplateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const {
    template,
    exercises,
    isLoading,
    addExercise,
    removeExercise,
    moveExercise,
    renameTemplate,
    deleteTemplate,
  } = useTemplate(id)

  const [newExerciseName, setNewExerciseName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')

  async function handleAddExercise() {
    if (!newExerciseName.trim() || isAdding) return
    setIsAdding(true)
    try {
      await addExercise(newExerciseName.trim())
      setNewExerciseName('')
    } finally {
      setIsAdding(false)
    }
  }

  function startRenaming() {
    setRenameValue(template?.name ?? '')
    setIsRenaming(true)
  }

  async function handleRename() {
    if (!renameValue.trim()) return
    await renameTemplate(renameValue.trim())
    setIsRenaming(false)
  }

  function handleDeleteTemplate() {
    Alert.alert(
      'Delete Template',
      `"${template?.name}" will be permanently deleted. Past sessions are not affected.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTemplate()
            router.replace('/(tabs)')
          },
        },
      ]
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#B07545" />
      </SafeAreaView>
    )
  }

  if (!template) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-5">
        <Text className="text-base font-dm-sans text-text-secondary mb-4">
          Template not found.
        </Text>
        <Button label="Go back" onPress={() => router.replace('/(tabs)')} variant="secondary" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-6"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color="#2A1F14" />
        </TouchableOpacity>

        {isRenaming ? (
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Input
                value={renameValue}
                onChangeText={setRenameValue}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleRename}
              />
            </View>
            <TouchableOpacity
              onPress={handleRename}
              disabled={!renameValue.trim()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Check size={24} color="#B07545" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsRenaming(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={24} color="#9A8878" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center gap-3">
            <Text className="flex-1 text-3xl font-dm-sans-bold text-text-primary">
              {template.name}
            </Text>
            <TouchableOpacity
              onPress={startRenaming}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <PencilSimple size={22} color="#9A8878" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
        {/* Exercise list */}
        <View className="mt-4">
          {exercises.length === 0 ? (
            <View className="items-center py-8">
              <Barbell size={36} color="#C4B5A8" />
              <Text className="mt-3 text-base font-dm-sans text-text-placeholder text-center">
                No exercises yet.{'\n'}Add your first one below.
              </Text>
            </View>
          ) : (
            exercises.map((ex, index) => (
              <TemplateExerciseRow
                key={ex.id}
                exercise={ex}
                isFirst={index === 0}
                isLast={index === exercises.length - 1}
                onMoveUp={() => moveExercise(ex.id, 'up')}
                onMoveDown={() => moveExercise(ex.id, 'down')}
                onRemove={() => removeExercise(ex.id)}
              />
            ))
          )}
        </View>

        {/* Add exercise row */}
        <View className="flex-row items-center gap-3 mt-4">
          <View className="flex-1">
            <Input
              value={newExerciseName}
              onChangeText={setNewExerciseName}
              placeholder="Exercise name"
              returnKeyType="go"
              onSubmitEditing={handleAddExercise}
            />
          </View>
          <Button
            label={isAdding ? '...' : 'Add'}
            onPress={handleAddExercise}
            disabled={!newExerciseName.trim() || isAdding}
            variant="secondary"
          />
        </View>

        {/* Danger zone */}
        <View className="mt-12 mb-8 border-t border-divider pt-6">
          <Button
            label="Delete Template"
            onPress={handleDeleteTemplate}
            variant="destructive"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
