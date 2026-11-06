'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { ChapterSummary } from '@/types'
import styles from './CollapsibleChapterNav.module.css'

interface CollapsibleChapterNavProps {
  allChapters: ChapterSummary[]
  currentChapterNumber: number
}

/**
 * Collapsible "Other Chapters" navigation section.
 * Starts collapsed by default. Toggle button switches
 * between "Show" and "Hide" labels.
 */
export function CollapsibleChapterNav({ allChapters, currentChapterNumber }: CollapsibleChapterNavProps) {
  const [collapsed, setCollapsed] = useState(true)

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  return (
    <nav className={styles.chNav} aria-label="All chapters">
      <div className={styles.chNavHeader}>
        <span className={styles.chNavTitle}>Other Chapters</span>
        <button
          type="button"
          className={styles.chNavToggle}
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls="ch-nav-list"
        >
          {collapsed ? 'Show' : 'Hide'}
        </button>
      </div>
      <div
        id="ch-nav-list"
        className={`${styles.chNavList} ${collapsed ? styles.chNavListCollapsed : ''}`}
        aria-hidden={collapsed}
      >
        {allChapters.map((ch) => {
          const padded = String(ch.number).padStart(2, '0')
          const isActive = ch.number === currentChapterNumber
          return (
            <Link
              key={ch.number}
              href={`/interview/${ch.slug}/`}
              className={`${styles.chNavItem} ${isActive ? styles.chNavItemActive : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={styles.chNavNum}>{padded}</span>
              <span className={styles.chNavName} title={ch.title}>{ch.title}</span>
              <span className={styles.chNavQCount}>{ch.questionCount}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
