import type { HeadingInfo } from '@/hooks/useHeadingObserver'
import styles from './ArticleTOC.module.css'

interface TOCLinesProps {
  headings: HeadingInfo[]
  activeId: string | null
}

/**
 * Thin horizontal lines — one per heading.
 * Active heading line is wider and brighter.
 * Visible by default, fades out when parent wrapper is hovered.
 */
export function TOCLines({ headings, activeId }: TOCLinesProps) {
  return (
    <div className={styles.lines}>
      {headings.map((h) => (
        <div
          key={h.id}
          className={`${styles.line} ${h.id === activeId ? styles.lineActive : ''}`}
        />
      ))}
    </div>
  )
}
