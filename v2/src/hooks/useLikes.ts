'use client'

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'javabypankaj.likes'

interface UseLikesReturn {
  /** All liked question IDs. */
  likes: string[]
  /** Check if a question is liked. */
  isLiked: (id: string) => boolean
  /** Toggle like state for a question. */
  toggle: (id: string) => void
  /** Clear all likes. */
  clear: () => void
  /** Total like count. */
  count: number
  /** Count likes within a set of question IDs. */
  getLikeCount: (questionIds: string[]) => number
}

/**
 * Manages liked question IDs. Persisted in localStorage.
 * Follows the same pattern as useBookmarks.
 * Returns the list, a check function, toggle, clear, count, and getLikeCount.
 */
export function useLikes(): UseLikesReturn {
  const [likes, setLikes] = useLocalStorage<string[]>(STORAGE_KEY, [])

  const isLiked = useCallback(
    (id: string): boolean => likes.includes(id),
    [likes],
  )

  const toggle = useCallback(
    (id: string) => {
      if (likes.includes(id)) {
        setLikes(likes.filter((l) => l !== id))
      } else {
        setLikes([...likes, id])
      }
    },
    [likes, setLikes],
  )

  const clear = useCallback(() => {
    setLikes([])
  }, [setLikes])

  const getLikeCount = useCallback(
    (questionIds: string[]): number => {
      return questionIds.filter((id) => likes.includes(id)).length
    },
    [likes],
  )

  return {
    likes,
    isLiked,
    toggle,
    clear,
    count: likes.length,
    getLikeCount,
  }
}
