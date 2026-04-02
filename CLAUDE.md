# Claude Code Instructions

## Before Starting Any Work

**Always read these three files at the start of every session before writing any code or making any suggestions:**

1. `docs/PRD.md` — product requirements, user flows, feature definitions, and what is explicitly out of scope
2. `docs/DESIGN_BRIEF.md` — the full visual design system: colors, typography, spacing, component specs
3. `docs/TECHNICAL_DESIGN.md` — data models, screen architecture, navigation structure, tech stack

If a request conflicts with the PRD or Design Brief, flag the conflict to the user before proceeding.

---

## Current Build Status

**All foundation documents: approved and locked.**

| Document | Status |
|---|---|
| `docs/PRD.md` | Approved |
| `docs/DESIGN_BRIEF.md` | Approved |
| `docs/TECHNICAL_DESIGN.md` | Approved |

**Scaffolding: complete.** Expo project is set up with all dependencies, folder structure, NativeWind configured with Design Brief tokens, database schema, Zustand store, and placeholder screens.

**Features build order** (one at a time, phone-tested before moving on):
1. [x] Database initialization — wire SQLite schema on app startup
2. [x] Device boot test — app opens on phone with no errors ✅
3. [x] Feature 3: Workout Template Builder ✅
4. [ ] Feature 4: Active Workout Session ← **next**
5. [ ] Feature 1: Onboarding
6. [ ] Feature 5: Progress Dashboard
7. [ ] Feature 2: Exercise Management (polish)

---

## Pre-Device Testing Checklist

**Run through every item on this list before asking the user to open the app on their phone.** Skipping this caused 30+ back-and-forth debugging exchanges that could have been 3. Every item below is a real error we hit.

Verify each one by reading the file or checking node_modules:

- [ ] All required packages installed (see Known Gotchas #1)
- [ ] `babel.config.js` exists at project root with correct content (see #2)
- [ ] `metro.config.js` exists at project root with correct content (see #2)
- [ ] `app.json` has `"scheme"` field (see #2)
- [ ] No `crypto.randomUUID()` anywhere — use `generateId()` from `utils/uuid.ts` (see #3)
- [ ] All `SafeAreaView` imports come from `react-native-safe-area-context`, not `react-native` (see #4)
- [ ] `SafeAreaProvider` wraps the root layout in `app/_layout.tsx` (see #4)
- [ ] No `useFocusEffect(async () => ...)` — async function must be called inside a sync wrapper (see #5)
- [ ] Run `npx expo start` locally and check terminal output — no red errors, no crash stack traces
- [ ] Only then ask the user to scan the QR code

---

## Known Gotchas — Expo SDK 55 Stack

All of these were discovered the hard way. Do not repeat them.

### 1. Missing peer dependencies

`npx create-expo-app` does NOT install all required peer dependencies. Install these explicitly after scaffolding:

```bash
npm install expo-splash-screen react-native-svg react-native-worklets react-dom --legacy-peer-deps
```

| Package | Why it's needed |
|---|---|
| `expo-splash-screen` | Used in `app/_layout.tsx` — not auto-installed by scaffold |
| `react-native-svg` | Peer dep of `phosphor-react-native` (icon library) |
| `react-native-worklets` | Peer dep of `react-native-reanimated` v4 |
| `react-dom` | Required by Expo's dev error overlay even in native-only apps |

If `npm install` fails with `ERESOLVE`, add `--legacy-peer-deps`.

### 2. Required config files

Create all three at scaffold time. Missing any one causes crashes or silent style failures.

**`babel.config.js`** — `nativewind/babel` must be in `presets` (not `plugins`). It patches the JSX runtime so `className` props work. It also includes `react-native-worklets/plugin` internally — no separate entry needed:
```js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
  }
}
```

**`metro.config.js`** — required for NativeWind to process Tailwind classes. Without it, all `className` props are silently ignored and the app renders completely unstyled:
```js
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const config = getDefaultConfig(__dirname)
module.exports = withNativeWind(config, { input: './global.css' })
```

**`app.json`** — must include `"scheme"` for Expo Router deep linking. Without it, navigation throws a render error on first load:
```json
"scheme": "workout-tracker"
```

### 3. `crypto.randomUUID()` does not exist in Hermes

React Native uses the Hermes JS engine, which does not have `crypto` as a global. Calling `crypto.randomUUID()` crashes at runtime with `ReferenceError: Property 'crypto' doesn't exist`.

**Always use `generateId()` from `utils/uuid.ts` instead:**
```typescript
import { generateId } from '../utils/uuid'
const id = generateId()
```

Never write `crypto.randomUUID()` anywhere in this codebase.

### 4. SafeAreaView rules

**Always import `SafeAreaView` from `react-native-safe-area-context`, never from `react-native`.** The `react-native` version is deprecated and collapses its children to zero height — causing a blank screen with no error.

```typescript
// ✅ Correct
import { SafeAreaView } from 'react-native-safe-area-context'

// ❌ Wrong — blank screen, no error
import { SafeAreaView } from 'react-native'
```

**`SafeAreaProvider` must wrap the root layout** in `app/_layout.tsx`:
```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context'

return (
  <SafeAreaProvider>
    {/* rest of app */}
  </SafeAreaProvider>
)
```

### 5. `useFocusEffect` cannot receive an async function

Passing an async function to `useFocusEffect` causes a React warning and unreliable behavior (async functions return a Promise, not a cleanup function).

```typescript
// ❌ Wrong
useFocusEffect(useCallback(async () => {
  await loadData()
}, []))

// ✅ Correct — call the async function inside a sync wrapper
useFocusEffect(
  useCallback(() => {
    loadData()
  }, [loadData])
)
```

### 6. Expo Go compatibility

Expo SDK 55 may not be supported by the stable App Store version of Expo Go. If the phone shows "project requires newer version":
- Use the **iOS Simulator**: install Xcode, run `npx expo start --ios`
- Or join Expo Go beta via TestFlight (invitation link at expo.dev)

### 7. Multiple Metro servers

If `npx expo start` says "Port 8081 is running in another window" and switches to 8082, the phone may connect to whichever server it last used. To avoid confusion: always press Ctrl+C to kill the existing server before starting a new one. Run `npx expo start --clear` only from `~/workout-app`.

---

## Development Methodology

### Phase gates — do not skip
1. **PRD** → approved before any technical design ✅
2. **Technical Design** → approved before any code ✅
3. **Design Brief** → approved before any UI code ✅
4. **Features** → built one at a time using the Feature Spec Template below

### Feature Spec Template
Every feature request must include this before implementation begins. Do not write code for a feature that hasn't been specced:

```
Feature: [Name]

User story: As a [user type], I want to [action] so that [benefit].

This feature is done when:
- [Specific observable outcome 1]
- [Specific observable outcome 2]

Edge cases to handle:
- [What happens if data is empty?]
- [What happens if the user does X wrong?]

Not in scope:
- [Thing you are explicitly not building]
```

### Definition of Done (per feature)
A feature is not done until:
- [ ] Works on device without crashing
- [ ] Edge cases specified in the spec are handled
- [ ] Unit tests written and passing for core business logic
- [ ] Matches acceptance criteria in the spec
- [ ] Follows the Design Brief (colors, typography, spacing, components)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 55 |
| Language | TypeScript |
| Navigation | Expo Router v4 (file-based) |
| Styling | NativeWind v4 (Tailwind CSS) |
| Database | expo-sqlite v14 (on-device SQLite) |
| State | Zustand v5 (active workout session only) |
| Font | DM Sans via @expo-google-fonts/dm-sans |
| Icons | phosphor-react-native |
| Testing | Jest + React Native Testing Library |

---

## Project Structure

```
app/              Screens (file path = route, Expo Router)
  (tabs)/         Home + Progress tab screens
  onboarding/     First-time user flow
  template/       Create/edit workout templates
  progress/       Progress detail screens
  active-workout  Full-screen modal for live sessions
components/
  ui/             Generic: Button, Card, Input, Checkbox
  workout/        Domain: ExerciseRow, SetRow, TemplateCard, VolumeChart
db/
  schema.ts       All CREATE TABLE statements (6 tables)
  queries/        All SQL queries — never write SQL in components
store/
  activeWorkout   Zustand store for in-progress session state only
hooks/            Bridge between db/queries and screens
utils/
  volume.ts       Pure functions: sessionVolume(), volumeDelta()
constants/
  defaults.ts     Experience level defaults (sets/reps for first session)
  theme.ts        Design token re-exports
docs/             PRD, Design Brief, Technical Design
```

---

## Design Rules

- **Always use Design Brief color tokens** — never hardcode hex values in component files
- Use NativeWind class names that map to `tailwind.config.js` tokens (e.g. `bg-accent`, `text-text-primary`)
- **Font:** DM Sans (`DMSans_400Regular`, `DMSans_500Medium`, `DMSans_600SemiBold`, `DMSans_700Bold`)
- Every new screen must follow the color palette, type scale, spacing, and component specs in `docs/DESIGN_BRIEF.md`
- Light mode only (MVP)
- Components never touch the database directly — always go through hooks

---

## Git & GitHub

After every change or set of changes, automatically commit and push to GitHub:

```bash
git add <changed files>
git commit -m "<descriptive message>"
git push origin main
```

- Always push to `origin main` after committing
- Use descriptive commit messages so individual changes are easy to identify and revert if needed

---

## Project Context

- **App:** iOS workout tracker (Expo / React Native)
- **Platform:** iOS 16+, light mode only, iPhone only (no iPad)
- **Storage:** On-device SQLite only — no backend, no accounts, no cloud sync (MVP)
- **Users:** Regular gym-goers who do weight training. Not beginners needing coaching.
- **North star:** Simplicity. If a feature adds complexity without directly serving the core workout tracking loop, it does not belong in MVP.
