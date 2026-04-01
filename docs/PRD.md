# Product Requirements Document
## Workout Tracker — iOS App

**Version:** 1.0 (MVP)
**Last updated:** 2026-04-01
**Status:** Approved

---

## 1. Problem Statement

Gym-goers — especially beginners — are overwhelmed by existing workout apps. Apps like Hevy are bloated with features, hide core functionality behind paywalls, and create more cognitive load than the workouts themselves. Users need a simple, distraction-free way to track their workouts in real time and see their progress grow over time.

---

## 2. Target User

**Primary:** Regular gym-goers who do weight training (sets, reps, weight). The core user already goes to the gym consistently and wants a simple, reliable way to track their lifts — not a product that teaches them how to work out.

**Not the primary target:** Complete beginners who need motivation tools, exercise tutorial videos, guided programs, or hand-holding through workouts. Those users have different needs that are out of scope for this app.

**What they care about:**
- Tracking their lifts quickly while at the gym, without interrupting their flow
- Seeing that they are getting stronger over time (volume progress)
- Zero friction, zero distractions, zero cost

**What they don't want:**
- Subscriptions or paywalls
- Ads
- Features they don't use
- Social or community features

---

## 3. Target Platform

- **iOS only** (MVP)
- **Minimum iOS version:** iOS 16 (covers ~95%+ of active iPhones; going higher meaningfully excludes users with no feature benefit)
- **Device:** iPhone (no iPad optimization required for MVP)
- **Data storage:** On-device only. No accounts, no login, no cloud sync.

---

## 4. Core Concepts

Before the features, three key concepts underpin the entire app:

| Concept | Definition |
|---|---|
| **Exercise** | A single movement (e.g., Tricep Pushdown). Has a name, optional description, and tracks sets × reps × weight (or duration for bodyweight/cardio exercises). |
| **Workout Template** | A named collection of exercises (e.g., "Full Body", "Push Day"). Created once, reused every session. |
| **Workout Session** | A single instance of running a workout template at the gym. Captures the actual sets/reps/weight performed that day. |

---

## 5. User Flows

### Flow 1: First-Time User (Onboarding)

**Goal:** Get a new user from download → first workout template ready in under 5 minutes.

**Steps:**
1. User opens app for the first time
2. Brief welcome screen explains the app's purpose (1 screen, dismissible)
3. User selects their **experience level**: Beginner / Intermediate / Expert
4. App prompts: "Build your first workout" — user gives it a name (e.g., "Full Body")
5. User adds exercises to the workout:
   - Types a name (e.g., "Tricep Pushdown")
   - Adds optional description
   - Sets number of sets and reps (or duration)
   - App **pre-fills recommended values** based on experience level (user can override)
6. User saves the workout template
7. App lands on the home screen with the new workout ready to start

**Recommended starting values by experience level (examples — these should be tunable):**

| Experience | Sets | Reps | Notes |
|---|---|---|---|
| Beginner | 3 | 8–10 | Light weight, form focus |
| Intermediate | 4 | 8–12 | Moderate weight |
| Expert | 4–5 | 6–12 | User typically knows their numbers |

> Weight recommendations are exercise-specific and require a reference list in the technical design. For MVP, we can default to "no weight pre-filled" and let users enter their own on first session.

---

### Flow 2: Returning User (Active Workout Session)

**Goal:** Minimum friction from "open app" to "logging first set."

**Steps:**
1. User opens app → sees their saved workout templates on the home screen
2. Taps a workout (e.g., "Push Day")
3. App loads all exercises in that workout, each **pre-filled with values from the last session**
4. User works through exercises top-to-bottom:
   - For each set: user can adjust weight/reps if needed, then taps a **checkmark to mark set complete**
   - Once all sets in an exercise are checked, the exercise is marked **complete** (visual indicator)
5. When all exercises are complete, the session ends
6. App saves this session to history and uses it to pre-fill the next session

**Key UX principles for this flow:**
- One-handed use. Large tap targets.
- Current set/exercise always visible without scrolling
- No confirmation dialogs, no pop-ups during the workout

---

## 6. MVP Features (5 total)

### Feature 1: Onboarding
First-time experience that guides users to create their first workout template before they reach the gym.

**Done when:**
- New users see onboarding on first launch only
- Experience level selection (Beginner / Intermediate / Expert) is stored and used for recommendations
- User can create at least one exercise and one workout template during onboarding
- Recommended values are pre-filled based on experience level
- Onboarding takes under 5 minutes to complete
- Returning users never see onboarding again

**Edge cases:**
- User quits mid-onboarding → resumes or skips to home screen on reopen
- User wants to skip onboarding entirely → allowed, lands on empty home screen with prompt to create first workout

---

### Feature 2: Exercise Management
Create and manage individual exercises.

**Done when:**
- User can create an exercise with: name (required), description (optional), type (sets/reps with weight OR sets/duration)
- User can edit any exercise
- User can delete an exercise (with confirmation — this affects workout templates)
- Exercise history (all past sessions) is viewable per exercise

**Edge cases:**
- Deleting an exercise that exists in a workout template: warn the user, confirm before removing
- Duplicate exercise names: warn but don't block

---

### Feature 3: Workout Template Builder
Create and manage named workout templates as collections of exercises.

**Done when:**
- User can create a workout template with a name
- User can add/remove/reorder exercises within a template
- User can edit a template at any time (changes apply to future sessions, not past ones)
- User can delete a template
- Templates are visible on the home screen

**Edge cases:**
- Template with no exercises: prompt to add at least one before saving
- Renaming a template: updates everywhere, preserves session history

---

### Feature 4: Active Workout Session
The real-time gym experience — running a workout template.

**Done when:**
- User taps a workout template to start a session
- All exercises load pre-filled with last session's values (or onboarding recommendations if first session)
- User can adjust any set's weight/reps before or after checking it off
- Each set has a checkmark; tapping it marks the set complete (tapping again unchecks it)
- When all sets in an exercise are complete, the exercise collapses or shows a completion state
- When all exercises are complete, session auto-saves
- User can end a session early (partial session saved)
- Session timestamp and all values are saved to history

**Edge cases:**
- Phone locks mid-session: app resumes to exact state when reopened
- User accidentally marks wrong set: can uncheck and re-enter
- User wants to add an ad-hoc exercise mid-session: allowed (appears at the bottom, saved to session but not to the template automatically)

---

### Feature 5: Progress Dashboard
Simple, clear view of progress over time.

**Done when:**
- User can view **total volume** (sets × reps × weight) per workout session over time
- Chart shows volume trend week over week for each workout template
- User can tap into any individual exercise to see its history (weight/reps per session over time)
- Personal best (highest single-session volume) is highlighted per exercise
- Dashboard is accessible from the main navigation

**Edge cases:**
- First session: show the data point, no trend line yet
- Duration-based exercises: tracked separately (no volume calculation — show reps/duration over time instead)
- Deleted exercises: their historical data is preserved in the dashboard

---

## 7. Success Metrics

| Metric | Type | Definition |
|---|---|---|
| Weekly Active Users (WAU) | Primary | Users who complete at least 1 workout session in a given week |
| Sets completed per session | Secondary | Indicates actual in-gym usage, not just opens |
| New exercises created per user per week | Secondary | Indicates new users setting up or experienced users expanding programs |

---

## 8. Non-Goals (MVP)

These are explicitly out of scope for v1:

- User accounts, login, or cloud sync
- Social or sharing features
- Pre-built exercise library (all exercises are user-created)
- AI-generated workout plans
- Rest timers or countdowns
- Nutrition or calorie tracking
- Apple Health / HealthKit integration
- Android version
- Ads or monetization of any kind
- Subscription or paywall features

---

## 9. Backend Decision

**Local-only.** All data stored on-device. No backend, no API, no accounts required for MVP.

**Important constraint for technical design:** Data schema should be designed with future cloud sync in mind (e.g., using UUIDs for all records, clean separation of templates vs. sessions). This prevents a painful migration if a backend is added post-MVP.
