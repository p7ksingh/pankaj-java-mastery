import type { HeadingInfo } from '@/hooks/useHeadingObserver'
import styles from './ArticleTOC.module.css'

interface TOCCardProps {
  headings: HeadingInfo[]
  activeId: string | null
  onScrollTo: (id: string) => void
}

/** Max characters before truncating with "..." */
const MAX_TEXT_LENGTH = 32

function truncate(text: string): string {
  return text.length > MAX_TEXT_LENGTH
    ? text.substring(0, MAX_TEXT_LENGTH) + '...'
    : text
}

/**
 * Text TOC card — shows heading titles in a floating card.
 * Active heading has a green dot and green text.
 * Hidden by default, appears when parent wrapper is hovered.
 */
export function TOCCard({ headings, activeId, onScrollTo }: TOCCardProps) {
  return (
    <nav className={styles.card} aria-label="Table of contents">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`${styles.cardItem} ${h.id === activeId ? styles.cardItemActive : ''}`}
          onClick={(e) => {
            e.preventDefault()
            onScrollTo(h.id)
          }}
        >
          <span className={styles.cardDot} />
          <span className={styles.cardText}>{truncate(h.text)}</span>
        </a>
      ))}
    </nav>
  )
}
