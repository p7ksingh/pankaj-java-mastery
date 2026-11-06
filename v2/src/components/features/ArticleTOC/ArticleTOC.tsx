'use client'

import { useHeadingObserver } from '@/hooks/useHeadingObserver'
import { TOCLines } from './TOCLines'
import { TOCCard } from './TOCCard'
import styles from './ArticleTOC.module.css'

interface ArticleTOCProps {
  /** CSS selector for the article container holding h3[id] headings */
  containerSelector: string
}

/**
 * Medium-style article Table of Contents.
 * Desktop only (hidden on mobile via CSS).
 *
 * Default: thin lines on the right edge showing section progress.
 * Hover: lines fade out, text card fades in showing heading titles.
 *
 * Composition: ArticleTOC orchestrates TOCLines + TOCCard.
 * Data: useHeadingObserver hook extracts headings and tracks active section.
 */
export function ArticleTOC({ containerSelector }: ArticleTOCProps) {
  const { headings, activeId, scrollTo } = useHeadingObserver(containerSelector)

  // Don't render if fewer than 3 headings (not worth showing TOC)
  if (headings.length < 3) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <TOCLines headings={headings} activeId={activeId} />
      <TOCCard headings={headings} activeId={activeId} onScrollTo={scrollTo} />
    </div>
  )
}
