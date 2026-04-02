export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert'

export const EXPERIENCE_DEFAULTS: Record<ExperienceLevel, { sets: number; reps: number }> = {
  beginner:     { sets: 3, reps: 10 },
  intermediate: { sets: 4, reps: 8  },
  expert:       { sets: 4, reps: 6  },
}
