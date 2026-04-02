import { useState, useEffect, useCallback } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import {
  getTemplateById,
  getTemplateExercises,
  renameTemplate as renameTemplateQuery,
  deleteTemplate as deleteTemplateQuery,
  addExerciseToTemplate,
  removeExerciseFromTemplate,
  reorderExercise,
  type WorkoutTemplate,
  type TemplateExercise,
} from '../db/queries/templates'
import { upsertExerciseByName } from '../db/queries/exercises'

export function useTemplate(id: string) {
  const db = useSQLiteContext()
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null)
  const [exercises, setExercises] = useState<TemplateExercise[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    const [tmpl, exs] = await Promise.all([
      getTemplateById(db, id),
      getTemplateExercises(db, id),
    ])
    setTemplate(tmpl)
    setExercises(exs)
    setIsLoading(false)
  }, [db, id])

  useEffect(() => {
    load()
  }, [load])

  const addExercise = useCallback(
    async (name: string) => {
      const exercise = await upsertExerciseByName(db, name.trim())
      await addExerciseToTemplate(db, id, exercise.id)
      const updated = await getTemplateExercises(db, id)
      setExercises(updated)
    },
    [db, id]
  )

  const removeExercise = useCallback(
    async (templateExerciseId: string) => {
      await removeExerciseFromTemplate(db, templateExerciseId)
      const updated = await getTemplateExercises(db, id)
      setExercises(updated)
    },
    [db, id]
  )

  const moveExercise = useCallback(
    async (templateExerciseId: string, direction: 'up' | 'down') => {
      await reorderExercise(db, templateExerciseId, direction)
      const updated = await getTemplateExercises(db, id)
      setExercises(updated)
    },
    [db, id]
  )

  const renameTemplate = useCallback(
    async (name: string) => {
      await renameTemplateQuery(db, id, name.trim())
      const updated = await getTemplateById(db, id)
      setTemplate(updated)
    },
    [db, id]
  )

  const deleteTemplate = useCallback(async () => {
    await deleteTemplateQuery(db, id)
  }, [db, id])

  return {
    template,
    exercises,
    isLoading,
    addExercise,
    removeExercise,
    moveExercise,
    renameTemplate,
    deleteTemplate,
  }
}
