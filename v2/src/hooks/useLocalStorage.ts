'use client'

import { useState, useEffect } from 'react'

/**
 * Reads and writes a value to localStorage with SSR safety.
 * Returns the stored value on mount, falls back to initialValue on server.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Read from localStorage after mount (client only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item))
      }
    } catch {
      // localStorage unavailable or corrupt value
    }
  }, [key])

  const setValue = (value: T) => {
    setStoredValue(value)
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage full or unavailable
    }
  }

  return [storedValue, setValue]
}
