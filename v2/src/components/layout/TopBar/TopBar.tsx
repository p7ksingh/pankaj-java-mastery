'use client'

import Link from 'next/link'
import styles from './TopBar.module.css'

interface TopBarProps {
  siteName: string
  showSubmit?: boolean
  onSubmitClick?: () => void
  onThemeToggle?: () => void
  onSearchChange?: (query: string) => void
}

export function TopBar({
  siteName,
  showSubmit = true,
  onSubmitClick,
  onThemeToggle,
  onSearchChange,
}: TopBarProps) {
  return (
    <nav className={styles.topbar} aria-label="Main">
      <div className={styles.left}>
        <Link href="/" className={styles.logoLink} title="Go to Home">
          <span className={styles.logo}>&#9749;</span>
          <span className={styles.brand}>{siteName}</span>
        </Link>
      </div>
      <div className={styles.right}>
        <div className={styles.search}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search questions..."
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        {showSubmit && (
          <button
            className={styles.submitBtn}
            onClick={onSubmitClick}
            aria-label="Submit your interview question"
          >
            <span className={styles.submitIcon}>&#128161;</span>
            <span className={styles.submitText}>Submit Yours Interview Question</span>
          </button>
        )}
        <button
          className={styles.themeBtn}
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          &#9789;
        </button>
      </div>
    </nav>
  )
}
