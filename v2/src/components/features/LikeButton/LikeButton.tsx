'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLikes } from '@/hooks/useLikes'
import { fetchLikeCounts, postLike, deleteLike } from '@/lib/api/likes'
import styles from './LikeButton.module.css'

interface LikeButtonProps {
  questionId: string
  /** Compact mode for card view (no pill shape, just icon). */
  compact?: boolean
}

/**
 * YouTube-style "I like this" thumbs-up button with aggregate count.
 *
 * Dual storage:
 * - localStorage → toggle state (did THIS user like it?)
 * - DynamoDB → aggregate count (how many users liked it?)
 *
 * Optimistic UI: toggle + count update happen immediately,
 * API call fires in background. If API fails, UI stays correct.
 */
export function LikeButton({ questionId, compact = false }: LikeButtonProps) {
  const { isLiked, toggle } = useLikes()
  const liked = isLiked(questionId)
  const [count, setCount] = useState<number | null>(null)

  // Fetch aggregate count on mount
  useEffect(() => {
    let cancelled = false
    fetchLikeCounts([questionId]).then((counts) => {
      if (!cancelled) {
        setCount(counts[questionId] ?? 0)
      }
    })
    return () => { cancelled = true }
  }, [questionId])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Optimistic: toggle local state + update count immediately
      toggle(questionId)

      if (liked) {
        // Unliking
        setCount((prev) => Math.max(0, (prev ?? 1) - 1))
        deleteLike(questionId) // fire-and-forget
      } else {
        // Liking
        setCount((prev) => (prev ?? 0) + 1)
        postLike(questionId) // fire-and-forget
      }
    },
    [questionId, liked, toggle],
  )

  const displayCount = count !== null && count > 0 ? formatCount(count) : null

  return (
    <button
      className={`${compact ? styles.compact : styles.pill} ${liked ? styles.liked : ''}`}
      onClick={handleClick}
      aria-label={liked ? 'Unlike this question' : 'I like this question'}
      aria-pressed={liked}
    >
      <span className={styles.tooltip}>{liked ? 'Liked' : 'I like this'}</span>
      {liked ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      )}
      {!compact && displayCount && (
        <span className={styles.count}>{displayCount}</span>
      )}
    </button>
  )
}

/** Format count: 1234 → "1.2K", 999 → "999" */
function formatCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return String(n)
}
