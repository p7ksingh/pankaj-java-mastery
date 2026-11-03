'use client'

import { useBookmarks } from '@/hooks/useBookmarks'
import styles from './BookmarkButton.module.css'

interface BookmarkButtonProps {
  questionId: string
}

export function BookmarkButton({ questionId }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks()
  const active = isBookmarked(questionId)

  return (
    <button
      className={`${styles.button} ${active ? styles.active : ''}`}
      onClick={() => toggle(questionId)}
      aria-label={active ? 'Remove bookmark' : 'Bookmark this question'}
      aria-pressed={active}
    >
      {active ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  )
}
