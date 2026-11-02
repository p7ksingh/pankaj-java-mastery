'use client'

import { useEffect } from 'react'

interface ShortcutHandlers {
  onSearch?: () => void
  onEscape?: () => void
}

/**
 * Registers global keyboard shortcuts. Cmd/Ctrl+K triggers search.
 * Escape triggers close. Cleans up on unmount.
 */
export function useKeyboardShortcuts({ onSearch, onEscape }: ShortcutHandlers): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onSearch?.()
        return
      }
      if (e.key === 'Escape') {
        onEscape?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSearch, onEscape])
}
