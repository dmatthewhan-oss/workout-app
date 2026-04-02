import { useState } from 'react'
import { TextInput } from 'react-native'

interface InputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  autoFocus?: boolean
  onSubmitEditing?: () => void
  returnKeyType?: 'done' | 'next' | 'go'
}

export function Input({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  onSubmitEditing,
  returnKeyType = 'done',
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#C4B5A8"
      autoFocus={autoFocus}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`
        bg-surface-subtle h-12 rounded-xl px-4
        font-dm-sans text-base text-text-primary
        border ${isFocused ? 'border-accent' : 'border-border'}
      `}
    />
  )
}
