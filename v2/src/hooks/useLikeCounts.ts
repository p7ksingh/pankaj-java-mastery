'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchLikeCounts } from '@/lib/api/likes'

/**
 * Fetches aggregate like counts from the backend for a set of question IDs.
 * Returns a map of questionId → likeCount.
 *
 * Usage:
 *   const { counts, refresh } = useLikeCounts(['Q1', 'Q2', 'Q3'])
 *   // counts['Q1'] → 42
 *
 * - Fetches once on mount (deduped by IDs)
 * - Call refresh() after a like/unlike to get updated count
 * - Returns 0 for questions with no likes yet
 */
export function useLikeCounts(questionIds: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const prevIdsRef = useRef('')

  const load = useCallback(async () => {
    if (questionIds.length === 0) {
      return
    }
    const result = await fetchLikeCounts(questionIds)
    setCounts(result)
  }, [questionIds])

  // Fetch on mount and when IDs change
  useEffect(() => {
    const key = questionIds.sort().join(',')
    if (key === prevIdsRef.current) {
      return
    }
    prevIdsRef.current = key
    load()
  }, [questionIds, load])

  return { counts, refresh: load }
}
