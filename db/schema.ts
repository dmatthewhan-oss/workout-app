export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS Exercise (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    created_at  INTEGER NOT NULL,
    updated_at  INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS WorkoutTemplate (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    created_at  INTEGER NOT NULL,
    updated_at  INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS TemplateExercise (
    id           TEXT PRIMARY KEY,
    template_id  TEXT NOT NULL REFERENCES WorkoutTemplate(id) ON DELETE CASCADE,
    exercise_id  TEXT NOT NULL REFERENCES Exercise(id) ON DELETE CASCADE,
    order_index  INTEGER NOT NULL,
    default_sets INTEGER NOT NULL DEFAULT 3
  );

  CREATE TABLE IF NOT EXISTS WorkoutSession (
    id           TEXT PRIMARY KEY,
    template_id  TEXT NOT NULL REFERENCES WorkoutTemplate(id),
    started_at   INTEGER NOT NULL,
    completed_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS SetLog (
    id             TEXT PRIMARY KEY,
    session_id     TEXT NOT NULL REFERENCES WorkoutSession(id) ON DELETE CASCADE,
    exercise_id    TEXT NOT NULL REFERENCES Exercise(id),
    set_number     INTEGER NOT NULL,
    planned_reps   INTEGER,
    planned_weight REAL,
    actual_reps    INTEGER,
    actual_weight  REAL,
    completed_at   INTEGER
  );

  CREATE TABLE IF NOT EXISTS UserPreferences (
    key    TEXT PRIMARY KEY,
    value  TEXT NOT NULL
  );
`
