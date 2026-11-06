'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './CommunityPage.module.css'

const STORAGE_KEY = 'javabypankaj.communityLikes'

interface CommunityLikeButtonProps {
  questionKey: string
}

export function getLikedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveLikedSet(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // localStorage unavailable
  }
}

/**
 * Like button for community questions.
 * Toggles like state per question in localStorage.
 */
export function CommunityLikeButton({ questionKey }: CommunityLikeButtonProps) {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setLiked(getLikedSet().has(questionKey))
  }, [questionKey])

  const toggle = useCallback(() => {
    const set = getLikedSet()
    if (set.has(questionKey)) {
      set.delete(questionKey)
      setLiked(false)
    } else {
      set.add(questionKey)
      setLiked(true)
    }
    saveLikedSet(set)
  }, [questionKey])

  return (
    <button
      type="button"
      className={`${styles.qAct} ${liked ? styles.qActLiked : ''}`}
      onClick={toggle}
      aria-label={liked ? 'You were asked this too' : 'I was asked this too'}
      aria-pressed={liked}
    >
      <span className={styles.qActTooltip}>
        {liked ? 'You were asked this too' : 'I was asked this too'}
      </span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
      {liked ? 1 : 0}
    </button>
  )
}
