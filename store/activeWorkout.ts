import { create } from 'zustand'

interface SetLog {
  id: string
  session_id: string
  exercise_id: string
  set_number: number
  planned_reps: number | null
  planned_weight: number | null
  actual_reps: number | null
  actual_weight: number | null
  completed_at: number | null
}

interface ActiveWorkoutStore {
  sessionId: string | null
  templateId: string | null
  templateName: string | null
  startedAt: Date | null
  sets: SetLog[]
  isActive: boolean

  setSession: (sessionId: string, templateId: string, templateName: string, sets: SetLog[]) => void
  updateSetValues: (setLogId: string, reps: number, weight: number) => void
  markSetComplete: (setLogId: string) => void
  unmarkSetComplete: (setLogId: string) => void
  clearSession: () => void
}

export const useActiveWorkout = create<ActiveWorkoutStore>((set, get) => ({
  sessionId: null,
  templateId: null,
  templateName: null,
  startedAt: null,
  sets: [],
  isActive: false,

  setSession: (sessionId, templateId, templateName, sets) =>
    set({ sessionId, templateId, templateName, sets, startedAt: new Date(), isActive: true }),

  updateSetValues: (setLogId, reps, weight) =>
    set(state => ({
      sets: state.sets.map(s =>
        s.id === setLogId ? { ...s, actual_reps: reps, actual_weight: weight } : s
      ),
    })),

  markSetComplete: (setLogId) =>
    set(state => ({
      sets: state.sets.map(s =>
        s.id === setLogId ? { ...s, completed_at: Date.now() } : s
      ),
    })),

  unmarkSetComplete: (setLogId) =>
    set(state => ({
      sets: state.sets.map(s =>
        s.id === setLogId ? { ...s, completed_at: null } : s
      ),
    })),

  clearSession: () =>
    set({ sessionId: null, templateId: null, templateName: null, startedAt: null, sets: [], isActive: false }),
}))
