'use client'

import { useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'javabypankaj.theme'
const DARK_CLASS = 'dark'

/**
 * Manages dark/light mode. Reads preference from localStorage on mount.
 * Applies the dark class to document.body. Returns current state and toggle.
 */
export function useDarkMode(): { isDark: boolean; toggle: () => void } {
  const [isDark, setIsDark] = useLocalStorage(STORAGE_KEY, false)

  // Sync the class on body whenever isDark changes
  useEffect(() => {
    if (isDark) {
      document.body.classList.add(DARK_CLASS)
    } else {
      document.body.classList.remove(DARK_CLASS)
    }
  }, [isDark])

  const toggle = useCallback(() => {
    setIsDark(!isDark)
  }, [isDark, setIsDark])

  return { isDark, toggle }
}
