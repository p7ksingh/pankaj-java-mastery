'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useBookmarks } from '@/hooks/useBookmarks'
import styles from './ProfileMenu.module.css'

interface ProfileMenuProps {
  isOpen: boolean
  onClose: () => void
  onAppearanceClick: () => void
  onSupportClick: () => void
}

/**
 * Profile dropdown menu — gold standard.
 * Tight spacing, every link works, live data from localStorage.
 * Groups: personal → settings → social → support.
 */
export function ProfileMenu({ isOpen, onClose, onAppearanceClick, onSupportClick }: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { count: savedCount } = useBookmarks()

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-profile-trigger]')
      ) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.menu} ref={menuRef} role="menu" aria-label="Profile menu">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatar} aria-hidden="true">PS</div>
        <div>
          <div className={styles.name}>Pankaj Singh</div>
          <div className={styles.site}>javabypankaj.live</div>
        </div>
      </div>

      <div className={styles.sep} />

      {/* Personal */}
      <div className={styles.group}>
        <Link href="/library" className={styles.item} onClick={onClose} role="menuitem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Your Library
          {savedCount > 0 && <span className={styles.badge}>{savedCount} saved</span>}
        </Link>
        <Link href="/" className={styles.item} onClick={onClose} role="menuitem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Your Progress
        </Link>
      </div>

      <div className={styles.sep} />

      {/* Settings */}
      <div className={styles.group}>
        <button
          className={styles.item}
          onClick={() => {
            onClose()
            onAppearanceClick()
          }}
          role="menuitem"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
          </svg>
          Appearance
        </button>
      </div>

      <div className={styles.sep} />

      {/* Social */}
      <div className={styles.group}>
        <a href="https://github.com/p7ksingh" target="_blank" rel="noopener noreferrer" className={styles.item} onClick={onClose} role="menuitem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/p7ksingh" target="_blank" rel="noopener noreferrer" className={styles.item} onClick={onClose} role="menuitem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          LinkedIn
        </a>
      </div>

      <div className={styles.sep} />

      {/* Support + About */}
      <div className={styles.group}>
        <button className={styles.item} onClick={() => { onClose(); onSupportClick() }} role="menuitem">
          <span className={styles.coffeeEmoji}>☕</span>
          Support this project
        </button>
        <Link href="/" className={styles.item} onClick={onClose} role="menuitem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          About
        </Link>
      </div>
    </div>
  )
}
