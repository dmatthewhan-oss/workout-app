import { type SQLiteDatabase } from 'expo-sqlite'

export interface Exercise {
  id: string
  name: string
  created_at: number
  updated_at: number
}

export async function upsertExerciseByName(
  db: SQLiteDatabase,
  name: string
): Promise<Exercise> {
  const existing = await db.getFirstAsync<Exercise>(
    'SELECT id, name, created_at, updated_at FROM Exercise WHERE LOWER(name) = LOWER(?) LIMIT 1',
    [name]
  )
  if (existing) return existing

  const id = crypto.randomUUID()
  const now = Date.now()
  await db.runAsync(
    'INSERT INTO Exercise (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)',
    [id, name, now, now]
  )
  return { id, name, created_at: now, updated_at: now }
}

export async function getExerciseById(
  db: SQLiteDatabase,
  id: string
): Promise<Exercise | null> {
  return db.getFirstAsync<Exercise>(
    'SELECT id, name, created_at, updated_at FROM Exercise WHERE id = ?',
    [id]
  )
}
