'use client'

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'javabypankaj.spaced'

// Review intervals in days: after adding, review at 1, 3, 7 days
const INTERVALS = [1, 3, 7]
const MAX_REVIEWS = INTERVALS.length
const MS_PER_DAY = 86_400_000

interface ReviewItem {
  addedAt: number
  reviewCount: number
  lastReviewedAt: number | null
}

type ReviewMap = Record<string, ReviewItem>

interface UseSpacedRepetitionReturn {
  dueCount: number
  getDueItems: () => string[]
  addForReview: (id: string) => void
  removeFromReview: (id: string) => void
  markReviewed: (id: string) => void
  isInReview: (id: string) => boolean
  isLearned: (id: string) => boolean
}

/**
 * Spaced repetition for question review. Schedule: 1, 3, 7 days.
 * After 3 reviews, question is marked as learned.
 */
export function useSpacedRepetition(): UseSpacedRepetitionReturn {
  const [items, setItems] = useLocalStorage<ReviewMap>(STORAGE_KEY, {})

  const getDueItems = useCallback((): string[] => {
    const now = Date.now()
    const due: string[] = []

    for (const [id, item] of Object.entries(items)) {
      if (item.reviewCount >= MAX_REVIEWS) {
        continue
      }
      const interval = INTERVALS[item.reviewCount] * MS_PER_DAY
      const baseTime = item.lastReviewedAt || item.addedAt
      if (now >= baseTime + interval) {
        due.push(id)
      }
    }

    return due
  }, [items])

  const addForReview = useCallback(
    (id: string) => {
      if (items[id]) {
        return
      }
      setItems({
        ...items,
        [id]: { addedAt: Date.now(), reviewCount: 0, lastReviewedAt: null },
      })
    },
    [items, setItems],
  )

  const removeFromReview = useCallback(
    (id: string) => {
      const next = { ...items }
      delete next[id]
      setItems(next)
    },
    [items, setItems],
  )

  const markReviewed = useCallback(
    (id: string) => {
      const item = items[id]
      if (!item || item.reviewCount >= MAX_REVIEWS) {
        return
      }
      setItems({
        ...items,
        [id]: {
          ...item,
          reviewCount: item.reviewCount + 1,
          lastReviewedAt: Date.now(),
        },
      })
    },
    [items, setItems],
  )

  const isInReview = useCallback(
    (id: string): boolean => id in items,
    [items],
  )

  const isLearned = useCallback(
    (id: string): boolean => {
      const item = items[id]
      return item ? item.reviewCount >= MAX_REVIEWS : false
    },
    [items],
  )

  const dueCount = getDueItems().length

  return {
    dueCount,
    getDueItems,
    addForReview,
    removeFromReview,
    markReviewed,
    isInReview,
    isLearned,
  }
}
