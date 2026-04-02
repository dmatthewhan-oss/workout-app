import { TouchableOpacity, Text } from 'react-native'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'destructive'
  disabled?: boolean
  fullWidth?: boolean
}

const variantClasses = {
  primary: {
    container: 'bg-accent',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-accent-light',
    text: 'text-accent',
  },
  destructive: {
    container: 'bg-destructive-light',
    text: 'text-destructive',
  },
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const styles = variantClasses[variant]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`
        ${styles.container}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40' : ''}
        h-[52px] rounded-xl items-center justify-center px-6
      `}
      activeOpacity={0.75}
    >
      <Text className={`${styles.text} text-base font-dm-sans-semibold`}>{label}</Text>
    </TouchableOpacity>
  )
}
