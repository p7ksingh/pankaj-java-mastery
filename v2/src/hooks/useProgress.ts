'use client'

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'javabypankaj.progress'

interface UseProgressReturn {
  completed: string[]
  completedCount: number
  isCompleted: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
  getPercentage: (questionIds: string[]) => number
}

/**
 * Tracks completed question IDs. Persisted in localStorage.
 * Provides toggle, check, count, clear and percentage calculation.
 */
export function useProgress(): UseProgressReturn {
  const [completed, setCompleted] = useLocalStorage<string[]>(STORAGE_KEY, [])

  const isCompleted = useCallback(
    (id: string): boolean => completed.includes(id),
    [completed],
  )

  const toggle = useCallback(
    (id: string) => {
      if (completed.includes(id)) {
        setCompleted(completed.filter((c) => c !== id))
      } else {
        setCompleted([...completed, id])
      }
    },
    [completed, setCompleted],
  )

  const clear = useCallback(() => {
    setCompleted([])
  }, [setCompleted])

  const getPercentage = useCallback(
    (questionIds: string[]): number => {
      if (questionIds.length === 0) {
        return 0
      }
      const done = questionIds.filter((id) => completed.includes(id)).length
      return Math.round((done / questionIds.length) * 100)
    },
    [completed],
  )

  return {
    completed,
    completedCount: completed.length,
    isCompleted,
    toggle,
    clear,
    getPercentage,
  }
}
