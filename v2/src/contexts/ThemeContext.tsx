'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

export type ThemeMode = 'auto' | 'light' | 'dark'

interface ThemeContextValue {
  mode: ThemeMode
  /** Whether the resolved (effective) theme is dark */
  isDark: boolean
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  isDark: false,
  setMode: () => {},
})

const STORAGE_KEY = 'javabypankaj.theme'
const DARK_CLASS = 'dark'

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') {
    return true
  }
  if (mode === 'light') {
    return false
  }
  // Auto: follow system preference
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

function readStoredMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'auto' || raw === 'light' || raw === 'dark') {
      return raw
    }
  } catch {
    // localStorage unavailable
  }
  return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light')
  const [isDark, setIsDark] = useState(false)

  // Read stored preference on mount
  useEffect(() => {
    const stored = readStoredMode()
    setModeState(stored)
    setIsDark(resolveIsDark(stored))
  }, [])

  // Apply dark class on <html> whenever isDark changes
  useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add(DARK_CLASS)
    } else {
      html.classList.remove(DARK_CLASS)
    }
  }, [isDark])

  // Listen for system preference changes when mode is 'auto'
  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    function handler(e: MediaQueryListEvent) {
      setIsDark(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    setIsDark(resolveIsDark(newMode))
    try {
      localStorage.setItem(STORAGE_KEY, newMode)
    } catch {
      // localStorage unavailable
    }
  }, [])

  const value = useMemo(() => ({ mode, isDark, setMode }), [mode, isDark, setMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
