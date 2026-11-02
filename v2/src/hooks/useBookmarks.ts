'use client'

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'javabypankaj.bookmarks'

interface UseBookmarksReturn {
  bookmarks: string[]
  isBookmarked: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
  count: number
}

/**
 * Manages bookmarked question IDs. Persisted in localStorage.
 * Returns the list, a check function, toggle, clear and count.
 */
export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>(STORAGE_KEY, [])

  const isBookmarked = useCallback(
    (id: string): boolean => bookmarks.includes(id),
    [bookmarks],
  )

  const toggle = useCallback(
    (id: string) => {
      if (bookmarks.includes(id)) {
        setBookmarks(bookmarks.filter((b) => b !== id))
      } else {
        setBookmarks([...bookmarks, id])
      }
    },
    [bookmarks, setBookmarks],
  )

  const clear = useCallback(() => {
    setBookmarks([])
  }, [setBookmarks])

  return {
    bookmarks,
    isBookmarked,
    toggle,
    clear,
    count: bookmarks.length,
  }
}
