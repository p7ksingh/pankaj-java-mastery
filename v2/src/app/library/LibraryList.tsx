'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useBookmarks } from '@/hooks/useBookmarks'
import { loadSearchIndex, type SearchEntry } from '@/lib/data/search'
import styles from './page.module.css'

/**
 * Library list — shows all bookmarked questions.
 * Resolves bookmark IDs against the search index for titles and URLs.
 * Client component because it reads from localStorage.
 */
export function LibraryList() {
  const { bookmarks, toggle } = useBookmarks()
  const [index, setIndex] = useState<SearchEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSearchIndex()
      .then(setIndex)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className={styles.loading}>Loading your library...</p>
  }

  // Resolve bookmark IDs to full question data
  const saved = bookmarks
    .map((id) => index.find((entry) => entry.id === id))
    .filter((entry): entry is SearchEntry => entry !== undefined)

  if (saved.length === 0) {
    return (
      <div className={styles.list}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className={styles.emptyTitle}>Your library is empty</p>
          <p className={styles.emptySub}>
            While reading any question, click the bookmark icon to save it here for quick access later.
          </p>
          <Link href="/" className={styles.emptyCta}>
            Browse questions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <p className={styles.count}><strong>{saved.length}</strong> saved question{saved.length !== 1 ? 's' : ''}</p>
      <div className={styles.list}>
        {saved.map((entry) => (
          <div key={entry.id} className={styles.item}>
            <Link href={entry.u} className={styles.itemInfo}>
              <div className={styles.itemTitle}>{entry.t}</div>
              <div className={styles.itemPath}>{entry.ch} › {entry.tp}</div>
            </Link>
            <button
              type="button"
              className={styles.itemRemove}
              onClick={() => toggle(entry.id)}
              title="Remove from library"
              aria-label="Remove from library"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
