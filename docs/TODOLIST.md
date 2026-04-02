# Workout App — Todo List

*Last updated: 2026-04-01*

This is the running reference for everything we're building. Open this anytime to recall what's done and what's next.

---

## Foundation (One-Time Setup)

All setup work is complete. You don't need to revisit these.

- [x] Product requirements document (PRD) — what we're building and why
- [x] Design brief — colors, fonts, spacing, visual style
- [x] Technical design — database structure, screen architecture
- [x] Expo project scaffolded — app installs, opens, and runs on your phone
- [x] SQLite database initialized — all tables created on first launch, migrations versioned
- [x] App opens on device with no errors or crashes

---

## Features (Build One at a Time)

> **Currently building: Feature 4 — Active Workout Session**

---

### [x] Feature 3: Workout Template Builder ✅
**What it does:** Lets you create, name, and manage your workout templates (e.g., "Push Day", "Full Body"). You can add exercises to a template, reorder them, rename the template, and delete it. Templates appear on the home screen, ready to start.

**Completed:** 2026-04-01

---

### [ ] Feature 4: Active Workout Session ← NEXT
**What it does:** The live gym experience. Tap a template on the home screen to start a session. Each exercise shows up with your numbers pre-filled from your last session. You tap a checkmark to mark each set done as you complete it. When everything's checked off, the session saves automatically. You can also end early and it saves what you've done.

**Key behaviors:**
- Sets pre-fill from your last session (or sensible defaults on first run)
- Checkmark per set — tap to complete, tap again to undo
- Session saves even if you close the app mid-workout
- You can add an extra exercise on the fly without changing your template

---

### [ ] Feature 1: Onboarding
**What it does:** The first-time experience. New users see a welcome screen, pick their experience level (Beginner / Intermediate / Expert), and build their first workout template before they ever reach the gym. Returning users skip straight to home.

**Key behaviors:**
- Shown once on first launch only
- Experience level is saved and used to suggest default sets/reps
- Skippable — user lands on home screen if they skip

---

### [ ] Feature 5: Progress Dashboard
**What it does:** Shows how you're getting stronger over time. The Progress tab displays a chart of total workout volume (sets × reps × weight) week over week. You can tap into any individual exercise to see how your weight and reps have changed across sessions. Personal bests are highlighted.

**Key behaviors:**
- Volume chart per workout template, week over week
- Drill down into individual exercise history
- Personal best (highest single-session volume) shown per exercise

---

### [ ] Feature 2: Exercise Management (Polish)
**What it does:** Full CRUD control over individual exercises outside of templates. Create exercises with a name and optional description, set the type (sets/reps with weight, or duration-based), edit them, delete them (with a warning if they're in any template), and view their full history across all past sessions.

**Note:** Basic exercise creation already works inside the Template Builder. This feature adds the standalone management screen and full history view.

---

## Deferred (Post-MVP)

These were intentionally cut from the MVP. Do not build these now.

- Pre-built exercise library
- Rest timers
- Cloud sync / accounts
- Social or sharing features
- Apple Health integration
- Android version
- AI-generated workout plans
