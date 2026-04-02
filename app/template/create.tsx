import { useState } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { ArrowLeft } from 'phosphor-react-native'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { createTemplate } from '../../db/queries/templates'

export default function CreateTemplateScreen() {
  const db = useSQLiteContext()
  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  async function handleCreate() {
    if (!name.trim() || isCreating) return
    setIsCreating(true)
    try {
      const id = await createTemplate(db, name.trim())
      router.replace(`/template/${id}`)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
      <View className="flex-1 px-5 pt-4">
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-8"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color="#2A1F14" />
        </TouchableOpacity>

        <Text className="text-3xl font-dm-sans-bold text-text-primary mb-2">
          New Template
        </Text>
        <Text className="text-base font-dm-sans text-text-secondary mb-8">
          Give your workout a name to get started.
        </Text>

        <Input
          value={name}
          onChangeText={setName}
          placeholder="e.g. Push Day, Full Body..."
          autoFocus
          returnKeyType="go"
          onSubmitEditing={handleCreate}
        />

        <View className="mt-4">
          <Button
            label={isCreating ? 'Creating...' : 'Continue'}
            onPress={handleCreate}
            disabled={!name.trim() || isCreating}
            fullWidth
          />
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
