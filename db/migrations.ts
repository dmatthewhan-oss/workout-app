import { type SQLiteDatabase } from 'expo-sqlite'
import { CREATE_TABLES } from './schema'

const MIGRATIONS: Array<{ version: number; up: string }> = [
  {
    version: 1,
    up: CREATE_TABLES,
  },
]

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;')
  await db.execAsync('PRAGMA foreign_keys = ON;')

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;')
  const currentVersion = result?.user_version ?? 0

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      await db.execAsync(migration.up)
      await db.execAsync(`PRAGMA user_version = ${migration.version};`)
    }
  }
}
