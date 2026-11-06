'use client'

import { useEffect, useRef } from 'react'
import { useTheme, type ThemeMode } from '@/contexts/ThemeContext'
import styles from './AppearanceModal.module.css'

interface AppearanceModalProps {
  isOpen: boolean
  onClose: () => void
}

const OPTIONS: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
  {
    mode: 'auto',
    label: 'Auto (follow system settings)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2m-10-10h2m16 0h2m-4.22-5.78l1.42-1.42M4.22 19.78l1.42-1.42m0-12.72L4.22 4.22m15.56 15.56l-1.42-1.42" />
      </svg>
    ),
  },
  {
    mode: 'light',
    label: 'Light',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2m0 18v2m-10-11h2m18 0h2" />
        <path d="M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42" />
        <path d="M18.36 5.64l1.42-1.42M4.22 19.78l1.42-1.42" />
      </svg>
    ),
  },
  {
    mode: 'dark',
    label: 'Dark',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
]

export function AppearanceModal({ isOpen, onClose }: AppearanceModalProps) {
  const { mode, setMode } = useTheme()
  const modalRef = useRef<HTMLDivElement>(null)

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

  // Trap focus inside modal when open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstBtn = modalRef.current.querySelector('button')
      firstBtn?.focus()
    }
  }, [isOpen])

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Appearance settings"
    >
      <div className={styles.modal} ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className={styles.title}>Appearance</div>
        <div className={styles.options}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.mode}
              className={`${styles.option} ${mode === opt.mode ? styles.optionSelected : ''}`}
              onClick={() => setMode(opt.mode)}
              aria-pressed={mode === opt.mode}
            >
              <span className={styles.optionIcon}>{opt.icon}</span>
              <span className={styles.optionText}>{opt.label}</span>
              <span className={styles.check} aria-hidden="true">✓</span>
            </button>
          ))}
        </div>
        <div className={styles.footer}>
          <button className={styles.doneBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
