import { useState, useCallback } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import { useFocusEffect } from 'expo-router'
import { getAllTemplates, type TemplateWithCount } from '../db/queries/templates'

export function useTemplates() {
  const db = useSQLiteContext()
  const [templates, setTemplates] = useState<TemplateWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const rows = await getAllTemplates(db)
    setTemplates(rows)
    setIsLoading(false)
  }, [db])

  useFocusEffect(load)

  return { templates, isLoading, reload: load }
}
