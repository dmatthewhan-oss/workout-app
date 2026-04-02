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
1. [ ] Database initialization — wire SQLite schema on app startup
2. [ ] Feature 3: Workout Template Builder
3. [ ] Feature 4: Active Workout Session
4. [ ] Feature 1: Onboarding
5. [ ] Feature 5: Progress Dashboard
6. [ ] Feature 2: Exercise Management (polish)

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
