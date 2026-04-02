/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Base
        background: '#FFFFFF',
        surface: '#FFFFFF',
        'surface-subtle': '#FAF8F4',
        border: '#E8DDD0',
        divider: '#F0E8DF',
        // Text
        'text-primary': '#2A1F14',
        'text-secondary': '#9A8878',
        'text-placeholder': '#C4B5A8',
        // Accent (caramel / burnt sugar)
        accent: '#B07545',
        'accent-light': '#F5E9DA',
        // Success (muted sage green)
        success: '#6B8F71',
        'success-light': '#E8F2EA',
        // Destructive
        destructive: '#C0392B',
        'destructive-light': '#FBEAEA',
      },
      fontFamily: {
        'dm-sans': ['DMSans_400Regular'],
        'dm-sans-medium': ['DMSans_500Medium'],
        'dm-sans-semibold': ['DMSans_600SemiBold'],
        'dm-sans-bold': ['DMSans_700Bold'],
      },
    },
  },
  plugins: [],
}
