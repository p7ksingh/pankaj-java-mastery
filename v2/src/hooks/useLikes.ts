'use client'

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { postLike, deleteLike } from '@/lib/api/likes'

const STORAGE_KEY = 'javabypankaj.likes'

interface UseLikesReturn {
  /** All liked question IDs (this user's local state). */
  likes: string[]
  /** Check if this user liked a question. */
  isLiked: (id: string) => boolean
  /** Toggle like: updates localStorage + fires API call (optimistic). */
  toggle: (id: string) => void
  /** Clear all local likes. */
  clear: () => void
  /** Total count of questions this user liked. */
  count: number
  /** Count likes within a set of question IDs. */
  getLikeCount: (questionIds: string[]) => number
}

/**
 * Manages liked question IDs.
 *
 * Dual storage:
 * - localStorage: which questions THIS user liked (toggle state for UI)
 * - DynamoDB (via API): aggregate like count across all users
 *
 * On toggle: optimistic UI (localStorage updates immediately),
 * then fire-and-forget API call to increment/decrement backend count.
 * If API fails, the user still sees their like toggled (graceful degradation).
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
        // Unlike: remove from localStorage, decrement backend
        setLikes(likes.filter((l) => l !== id))
        deleteLike(id) // fire-and-forget
      } else {
        // Like: add to localStorage, increment backend
        setLikes([...likes, id])
        postLike(id) // fire-and-forget
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
