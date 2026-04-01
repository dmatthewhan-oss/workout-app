# Technical Design Document
## Workout Tracker — iOS App

**Version:** 1.0
**Last updated:** 2026-04-01
**Status:** Approved

---

## 1. Tech Stack

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Framework | Expo | SDK 52 | Fast iteration, QR code preview, iOS-first |
| Language | TypeScript | 5.x | Type safety, better IDE support |
| Navigation | Expo Router | v4 | File-based routing, modern Expo standard |
| Styling | NativeWind | v4 | Tailwind CSS for React Native |
| Database | expo-sqlite | v14 | Relational, on-device, cloud-migration ready |
| State | Zustand | v5 | Lightweight, minimal boilerplate |
| Font | @expo-google-fonts/dm-sans | latest | Design Brief approved |
| Icons | phosphor-react-native | latest | Warm/rounded style, matches DM Sans |
| Testing | Jest + React Native Testing Library | latest | Unit tests for business logic |

---

## 2. Data Models

All data lives in a SQLite database stored privately on the user's iPhone. No network requests, no accounts, no cloud.

### Why UUIDs?
Every record uses a UUID (e.g. `ex_a1b2c3`) as its ID rather than an auto-incrementing number. This costs nothing now and means data is cloud-sync-ready later — UUIDs are globally unique, so merging local and cloud records never produces ID collisions.

### Tables

```sql
-- A single movement (e.g. "Bench Press")
CREATE TABLE Exercise (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  created_at  INTEGER NOT NULL,   -- Unix timestamp (milliseconds)
  updated_at  INTEGER NOT NULL
);

-- A named collection of exercises (e.g. "Push Day")
CREATE TABLE WorkoutTemplate (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);

-- Joins WorkoutTemplate ↔ Exercise; stores planned set count and display order
CREATE TABLE TemplateExercise (
  id           TEXT PRIMARY KEY,
  template_id  TEXT NOT NULL REFERENCES WorkoutTemplate(id) ON DELETE CASCADE,
  exercise_id  TEXT NOT NULL REFERENCES Exercise(id) ON DELETE CASCADE,
  order_index  INTEGER NOT NULL,  -- 1, 2, 3... for display sequence
  default_sets INTEGER NOT NULL DEFAULT 3
);

-- One instance of doing a workout (one gym session)
CREATE TABLE WorkoutSession (
  id           TEXT PRIMARY KEY,
  template_id  TEXT NOT NULL REFERENCES WorkoutTemplate(id),
  started_at   INTEGER NOT NULL,
  completed_at INTEGER            -- NULL = session abandoned mid-workout
);

-- One individual set performed during a session
CREATE TABLE SetLog (
  id             TEXT PRIMARY KEY,
  session_id     TEXT NOT NULL REFERENCES WorkoutSession(id) ON DELETE CASCADE,
  exercise_id    TEXT NOT NULL REFERENCES Exercise(id),
  set_number     INTEGER NOT NULL,
  planned_reps   INTEGER,         -- pre-filled from last session's actuals
  planned_weight REAL,            -- pre-filled from last session's actuals
  actual_reps    INTEGER,         -- what the user actually did
  actual_weight  REAL,            -- what the user actually did
  completed_at   INTEGER          -- NULL = not yet checked off; timestamp = done
);

-- Simple key-value store for app settings
CREATE TABLE UserPreferences (
  key    TEXT PRIMARY KEY,        -- e.g. "experience_level", "onboarding_complete"
  value  TEXT NOT NULL
);
```

### Key Design Decisions

**`template_id` in `WorkoutSession` is frozen.** When a user edits a template (adds/removes exercises), that change does not affect past sessions. History is immutable.

**`planned_*` vs `actual_*` in `SetLog`.** Both are stored. This enables the progress view to show "you planned 135lbs, you did 145lbs" — a useful signal that the user is making progress beyond their own expectations.

**Derived values are never stored.** Total session volume (`SUM(actual_reps × actual_weight)`) is computed at query time, not stored. This avoids data becoming stale or inconsistent.

---

## 3. Screen Architecture

### Navigation Model

Two navigation types are combined:
- **Tab navigation** — persistent bottom bar between major sections. Always visible.
- **Stack navigation** — drilling deeper within a section (back arrow to return).
- **Modal** — active workout takes over the full screen. User can dismiss to check progress mid-session.

### Screen Map

```
App
│
├── Onboarding (first launch only)
│   ├── /onboarding/welcome            Welcome + app pitch (1 screen, dismissible)
│   ├── /onboarding/experience-level   Beginner / Intermediate / Expert selection
│   └── /onboarding/first-workout      Guided template builder
│
└── Main App
    ├── [Tab] Home  /
    │   ├── Workout template list
    │   ├── "Start Workout" button → opens /active-workout modal
    │   └── "New Template" → /template/create
    │
    ├── [Tab] Progress  /progress
    │   ├── Volume trend chart per template (week-over-week)
    │   └── Tap exercise → /progress/exercise/[id]
    │
    ├── /template/create               Create a new workout template
    ├── /template/[id]                 View / edit an existing template
    │   └── /template/[id]/add-exercise   Add exercise to this template
    │
    └── /active-workout  [MODAL]       Full-screen active workout session
        └── Exercise list, set rows, check-off, finish/abandon
```

### Active Workout Modal Behavior

- Launched via `router.push('/active-workout')` with modal presentation
- User can swipe down / tap X to minimize back to Home (session stays active in Zustand)
- A persistent banner on the Home screen shows the active session when minimized
- Tapping the banner re-opens the modal
- Session ends only when user taps "Finish Workout" or "Abandon"

---

## 4. Project Folder Structure

```
workout-app/
│
├── app/                          # Expo Router — file path = URL route
│   ├── _layout.tsx               # Root: font loading, DB init, modal config
│   ├── index.tsx                 # Entry point: redirect to onboarding or tabs
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── experience-level.tsx
│   │   └── first-workout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home screen
│   │   └── progress.tsx          # Progress dashboard
│   ├── template/
│   │   ├── create.tsx
│   │   ├── [id].tsx              # /template/abc123 — dynamic route
│   │   └── [id]/
│   │       └── add-exercise.tsx
│   ├── progress/
│   │   └── exercise/
│   │       └── [id].tsx          # /progress/exercise/abc123
│   └── active-workout.tsx        # Modal screen
│
├── components/
│   ├── ui/                       # Generic, reusable
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Checkbox.tsx
│   └── workout/                  # Domain-specific
│       ├── ExerciseRow.tsx       # One exercise in the active workout
│       ├── SetRow.tsx            # One set row with check-off
│       ├── TemplateCard.tsx      # Workout template card on Home
│       └── VolumeChart.tsx       # Volume trend chart on Progress
│
├── db/
│   ├── schema.ts                 # All CREATE TABLE statements
│   ├── migrations.ts             # Versioned schema changes
│   └── queries/
│       ├── exercises.ts          # CRUD for Exercise
│       ├── templates.ts          # CRUD for WorkoutTemplate + TemplateExercise
│       ├── sessions.ts           # Create/complete/abandon WorkoutSession
│       └── sets.ts               # SetLog reads, writes, pre-fill query
│
├── store/
│   └── activeWorkout.ts          # Zustand store — in-progress session only
│
├── hooks/
│   ├── useExercises.ts           # Read exercises from DB
│   ├── useTemplates.ts           # Read templates + their exercises
│   ├── useSessions.ts            # Read session history
│   └── useProgress.ts            # Volume calculations for Progress screen
│
├── utils/
│   └── volume.ts                 # Pure functions: volume calc, progress delta
│
├── constants/
│   ├── theme.ts                  # Design token re-exports
│   └── defaults.ts               # Experience level defaults for onboarding
│
├── docs/
│   ├── PRD.md
│   ├── DESIGN_BRIEF.md
│   └── TECHNICAL_DESIGN.md
│
├── assets/fonts/
├── tailwind.config.js            # NativeWind theme with Design Brief tokens
├── app.json
├── tsconfig.json
└── package.json
```

### Rules for This Structure

1. **Components never touch the database directly.** They call hooks; hooks call `db/queries/`.
2. **All SQL lives in `db/queries/`.** No raw SQL strings anywhere else.
3. **Zustand store is only for active session state.** Everything else is read from SQLite.
4. **`components/ui/`** contains only generic components with no workout domain knowledge.
5. **`utils/volume.ts`** contains only pure functions — no database calls, no side effects.

---

## 5. State Management

### What lives where

| Data | Where | Why |
|---|---|---|
| All exercises | SQLite | Persists across sessions |
| All templates | SQLite | Persists across sessions |
| All session history | SQLite | Persists across sessions |
| User preferences | SQLite (UserPreferences table) | Persists across sessions |
| Active workout in progress | Zustand | Temporary — only exists while session is open |

### Zustand Store: Active Workout

```typescript
interface ActiveWorkoutStore {
  // State
  sessionId: string | null
  templateId: string | null
  templateName: string | null
  startedAt: Date | null
  sets: SetLog[]           // all sets for this session, loaded at start
  isActive: boolean        // derived: sessionId !== null

  // Actions
  startSession: (templateId: string) => Promise<void>
  updateSetValues: (setLogId: string, reps: number, weight: number) => void
  completeSet: (setLogId: string) => Promise<void>
  uncompleteSet: (setLogId: string) => Promise<void>
  finishSession: () => Promise<void>
  abandonSession: () => Promise<void>
}
```

---

## 6. Pre-fill Logic

This is the core UX mechanic — how last session's data auto-populates the next session.

**When `startSession(templateId)` is called:**

1. Load `TemplateExercise` rows for this template, ordered by `order_index`
2. For each exercise, run:
   ```sql
   SELECT actual_reps, actual_weight
   FROM SetLog
   WHERE exercise_id = ? AND completed_at IS NOT NULL
   ORDER BY completed_at DESC
   LIMIT <default_sets>
   ```
3. Use those values as `planned_reps` / `planned_weight` for each new `SetLog` row
4. If no prior completed sets exist: use `constants/defaults.ts` based on `UserPreferences.experience_level`
5. Write all new `SetLog` rows to DB with `completed_at = null`
6. Load them into the Zustand store

**When a user checks off a set:**
- `actual_reps` and `actual_weight` are written to the DB (may differ from planned values if user adjusted them)
- `completed_at` is set to the current timestamp
- Zustand store is updated in-memory for immediate UI response

---

## 7. Volume Calculation

All calculation logic lives in `utils/volume.ts` as pure functions.

```typescript
// Total volume for a single session
function sessionVolume(sets: SetLog[]): number {
  return sets
    .filter(s => s.completed_at !== null)
    .reduce((sum, s) => sum + (s.actual_reps ?? 0) * (s.actual_weight ?? 0), 0)
}

// Week-over-week delta
function volumeDelta(current: number, previous: number): {
  absolute: number
  percent: number
} {
  const absolute = current - previous
  const percent = previous === 0 ? 0 : (absolute / previous) * 100
  return { absolute, percent }
}
```

---

## 8. Experience Level Defaults

Used only when no prior session history exists for an exercise (first session after onboarding).

```typescript
// constants/defaults.ts
export const EXPERIENCE_DEFAULTS = {
  beginner:     { sets: 3, reps: 10 },
  intermediate: { sets: 4, reps: 8  },
  expert:       { sets: 4, reps: 6  },
}
```

Weight is **always** left blank on first session. We cannot safely guess starting weights without a known exercise library — and since all exercises are user-created, there is no reference to draw from.

---

## 9. Database Migrations

Schema changes over time are versioned in `db/migrations.ts`. Each migration has a version number and runs only once.

```typescript
const MIGRATIONS = [
  {
    version: 1,
    up: `CREATE TABLE Exercise (...); CREATE TABLE WorkoutTemplate (...); ...`
  },
  // Future schema changes added here as version 2, 3, etc.
]
```

On app startup, the migration runner checks the current DB version and runs any pending migrations. This means schema updates never break existing user data.

---

## 10. iOS Permissions

This app requests **no iOS permissions** in MVP:
- No HealthKit (not reading or writing health data to Apple Health)
- No camera
- No notifications
- No location

All data is self-contained within the app's private SQLite file. This simplifies App Store review and eliminates permission-related UX friction.

---

## 11. Dependency List

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-sqlite": "~14.0.0",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^5.0.0",
    "phosphor-react-native": "^2.0.0",
    "@expo-google-fonts/dm-sans": "latest",
    "expo-font": "latest",
    "react-native-reanimated": "latest",
    "react-native-gesture-handler": "latest"
  },
  "devDependencies": {
    "@testing-library/react-native": "latest",
    "jest": "latest",
    "jest-expo": "latest",
    "typescript": "~5.3.0"
  }
}
```

---

## 12. Feature-to-Screen Mapping

Verifies all 5 PRD features are covered:

| PRD Feature | Screens | Key Components |
|---|---|---|
| 1. Onboarding | `/onboarding/*` (3 screens) | ExperienceLevelPicker, guided TemplateBuilder |
| 2. Exercise Management | `/template/[id]`, `/template/[id]/add-exercise` | ExerciseRow, Input |
| 3. Workout Template Builder | `/template/create`, `/template/[id]` | TemplateCard, ExerciseRow |
| 4. Active Workout Session | `/active-workout` (modal) | SetRow, Checkbox, ExerciseRow |
| 5. Progress Dashboard | `/progress`, `/progress/exercise/[id]` | VolumeChart, session history list |
