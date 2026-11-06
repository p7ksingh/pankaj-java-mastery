'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Reads and writes a value to localStorage with SSR safety.
 * Syncs across tabs via the storage event, and across components
 * in the same tab via a custom event.
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

  // Listen for changes from other tabs (storage event)
  // and from other components in the same tab (custom event)
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch { /* ignore */ }
      }
    }

    function handleCustom(e: Event) {
      const detail = (e as CustomEvent).detail
      if (detail?.key === key) {
        setStoredValue(detail.value)
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('localStorageSync', handleCustom)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('localStorageSync', handleCustom)
    }
  }, [key])

  const setValue = useCallback((value: T) => {
    setStoredValue(value)
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      // Notify other components in the same tab
      window.dispatchEvent(
        new CustomEvent('localStorageSync', { detail: { key, value } }),
      )
    } catch {
      // localStorage full or unavailable
    }
  }, [key])

  return [storedValue, setValue]
}
