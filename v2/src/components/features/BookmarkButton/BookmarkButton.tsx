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
      aria-label={active ? 'Remove from saved' : 'Save this question'}
      aria-pressed={active}
    >
      <span className={styles.tooltip}>{active ? 'Saved' : 'Save'}</span>
      {active ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          <line x1="12" y1="8" x2="12" y2="14" />
          <line x1="9" y1="11" x2="15" y2="11" />
        </svg>
      )}
    </button>
  )
}
