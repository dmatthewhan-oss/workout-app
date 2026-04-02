import { Redirect } from 'expo-router'

// Entry point: always redirect to tabs for now.
// Once onboarding is built, this will check UserPreferences
// and redirect to /onboarding/welcome on first launch.
export default function Index() {
  return <Redirect href="/(tabs)" />
}
