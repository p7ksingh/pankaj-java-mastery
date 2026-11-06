'use client'

import { useLikes } from '@/hooks/useLikes'
import styles from './LikeButton.module.css'

interface LikeButtonProps {
  questionId: string
  /** Compact mode for card view (no pill shape, just icon). */
  compact?: boolean
}

/**
 * YouTube-style "I like this" thumbs-up button.
 * Pill shape with icon + count on the reading page.
 * Compact icon-only mode on QuestionCard.
 * Hover shows tooltip "I like this".
 */
export function LikeButton({ questionId, compact = false }: LikeButtonProps) {
  const { isLiked, toggle } = useLikes()
  const liked = isLiked(questionId)

  return (
    <button
      className={`${compact ? styles.compact : styles.pill} ${liked ? styles.liked : ''}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(questionId)
      }}
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
    </button>
  )
}
