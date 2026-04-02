interface SetLog {
  actual_reps: number | null
  actual_weight: number | null
  completed_at: number | null
}

/** Total volume for a session: SUM(actual_reps × actual_weight) for completed sets */
export function sessionVolume(sets: SetLog[]): number {
  return sets
    .filter(s => s.completed_at !== null)
    .reduce((sum, s) => sum + (s.actual_reps ?? 0) * (s.actual_weight ?? 0), 0)
}

/** Week-over-week delta between two session volumes */
export function volumeDelta(
  current: number,
  previous: number
): { absolute: number; percent: number } {
  const absolute = current - previous
  const percent = previous === 0 ? 0 : (absolute / previous) * 100
  return { absolute, percent }
}
