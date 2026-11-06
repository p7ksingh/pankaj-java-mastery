'use client'

import { useEffect, useRef } from 'react'
import styles from './ProfileMenu.module.css'

interface ProfileMenuProps {
  isOpen: boolean
  onClose: () => void
  onAppearanceClick: () => void
}

export function ProfileMenu({ isOpen, onClose, onAppearanceClick }: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

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
      {/* User info */}
      <div className={styles.user}>
        <div className={styles.avatar} aria-hidden="true">PS</div>
        <div>
          <div className={styles.name}>Pankaj</div>
          <div className={styles.viewProfile}>View profile</div>
        </div>
      </div>
      <div className={styles.divider} />

      {/* Appearance */}
      <button
        className={styles.item}
        onClick={() => {
          onClose()
          onAppearanceClick()
        }}
        role="menuitem"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2m-10-10h2m16 0h2m-4.22-5.78l1.42-1.42M4.22 19.78l1.42-1.42m0-12.72L4.22 4.22m15.56 15.56l-1.42-1.42" />
        </svg>
        Appearance
      </button>

      {/* About */}
      <button className={styles.item} role="menuitem">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        About
      </button>

      <div className={styles.divider} />

      {/* Sign out */}
      <div className={styles.itemMuted}>
        Sign out
        <div className={styles.email}>p7ksingh@gmail.com</div>
      </div>
    </div>
  )
}
