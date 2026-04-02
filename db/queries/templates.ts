import { type SQLiteDatabase } from 'expo-sqlite'
import { generateId } from '../../utils/uuid'

export interface WorkoutTemplate {
  id: string
  name: string
  created_at: number
  updated_at: number
}

export interface TemplateWithCount extends WorkoutTemplate {
  exercise_count: number
}

export interface TemplateExercise {
  id: string
  template_id: string
  exercise_id: string
  exercise_name: string
  order_index: number
  default_sets: number
}

export async function getAllTemplates(db: SQLiteDatabase): Promise<TemplateWithCount[]> {
  return db.getAllAsync<TemplateWithCount>(
    `SELECT wt.id, wt.name, wt.created_at, wt.updated_at, COUNT(te.id) AS exercise_count
     FROM WorkoutTemplate wt
     LEFT JOIN TemplateExercise te ON te.template_id = wt.id
     GROUP BY wt.id
     ORDER BY wt.created_at DESC`
  )
}

export async function getTemplateById(
  db: SQLiteDatabase,
  id: string
): Promise<WorkoutTemplate | null> {
  return db.getFirstAsync<WorkoutTemplate>(
    'SELECT id, name, created_at, updated_at FROM WorkoutTemplate WHERE id = ?',
    [id]
  )
}

export async function getTemplateExercises(
  db: SQLiteDatabase,
  templateId: string
): Promise<TemplateExercise[]> {
  return db.getAllAsync<TemplateExercise>(
    `SELECT te.id, te.template_id, te.exercise_id, e.name AS exercise_name,
            te.order_index, te.default_sets
     FROM TemplateExercise te
     JOIN Exercise e ON e.id = te.exercise_id
     WHERE te.template_id = ?
     ORDER BY te.order_index ASC`,
    [templateId]
  )
}

export async function createTemplate(db: SQLiteDatabase, name: string): Promise<string> {
  const id = generateId()
  const now = Date.now()
  await db.runAsync(
    'INSERT INTO WorkoutTemplate (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)',
    [id, name, now, now]
  )
  return id
}

export async function renameTemplate(
  db: SQLiteDatabase,
  id: string,
  name: string
): Promise<void> {
  await db.runAsync(
    'UPDATE WorkoutTemplate SET name = ?, updated_at = ? WHERE id = ?',
    [name, Date.now(), id]
  )
}

export async function deleteTemplate(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM WorkoutTemplate WHERE id = ?', [id])
}

export async function addExerciseToTemplate(
  db: SQLiteDatabase,
  templateId: string,
  exerciseId: string
): Promise<void> {
  const result = await db.getFirstAsync<{ max_idx: number }>(
    'SELECT COALESCE(MAX(order_index), 0) AS max_idx FROM TemplateExercise WHERE template_id = ?',
    [templateId]
  )
  const nextIndex = (result?.max_idx ?? 0) + 1
  await db.runAsync(
    'INSERT INTO TemplateExercise (id, template_id, exercise_id, order_index, default_sets) VALUES (?, ?, ?, ?, ?)',
    [generateId(), templateId, exerciseId, nextIndex, 3]
  )
}

export async function removeExerciseFromTemplate(
  db: SQLiteDatabase,
  templateExerciseId: string
): Promise<void> {
  const row = await db.getFirstAsync<{ template_id: string; order_index: number }>(
    'SELECT template_id, order_index FROM TemplateExercise WHERE id = ?',
    [templateExerciseId]
  )
  if (!row) return

  await db.runAsync('DELETE FROM TemplateExercise WHERE id = ?', [templateExerciseId])
  await db.runAsync(
    'UPDATE TemplateExercise SET order_index = order_index - 1 WHERE template_id = ? AND order_index > ?',
    [row.template_id, row.order_index]
  )
}

export async function reorderExercise(
  db: SQLiteDatabase,
  templateExerciseId: string,
  direction: 'up' | 'down'
): Promise<void> {
  const current = await db.getFirstAsync<{ id: string; template_id: string; order_index: number }>(
    'SELECT id, template_id, order_index FROM TemplateExercise WHERE id = ?',
    [templateExerciseId]
  )
  if (!current) return

  const adjacentIndex = direction === 'up' ? current.order_index - 1 : current.order_index + 1
  const adjacent = await db.getFirstAsync<{ id: string; order_index: number }>(
    'SELECT id, order_index FROM TemplateExercise WHERE template_id = ? AND order_index = ?',
    [current.template_id, adjacentIndex]
  )
  if (!adjacent) return

  await db.runAsync('UPDATE TemplateExercise SET order_index = ? WHERE id = ?', [
    adjacentIndex,
    current.id,
  ])
  await db.runAsync('UPDATE TemplateExercise SET order_index = ? WHERE id = ?', [
    current.order_index,
    adjacent.id,
  ])
}
