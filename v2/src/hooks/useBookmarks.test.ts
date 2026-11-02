import { renderHook, act } from '@testing-library/react'
import { useBookmarks } from './useBookmarks'

describe('useBookmarks', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts with no bookmarks', () => {
    const { result } = renderHook(() => useBookmarks())
    expect(result.current.count).toBe(0)
  })

  it('adds a bookmark', () => {
    const { result } = renderHook(() => useBookmarks())
    act(() => {
      result.current.toggle('Q1')
    })
    expect(result.current.isBookmarked('Q1')).toBe(true)
    expect(result.current.count).toBe(1)
  })

  it('removes a bookmark on second toggle', () => {
    const { result } = renderHook(() => useBookmarks())
    act(() => {
      result.current.toggle('Q1')
    })
    act(() => {
      result.current.toggle('Q1')
    })
    expect(result.current.isBookmarked('Q1')).toBe(false)
    expect(result.current.count).toBe(0)
  })

  it('handles multiple bookmarks', () => {
    const { result } = renderHook(() => useBookmarks())
    act(() => {
      result.current.toggle('Q1')
    })
    act(() => {
      result.current.toggle('Q100')
    })
    act(() => {
      result.current.toggle('Q500')
    })
    expect(result.current.count).toBe(3)
    expect(result.current.isBookmarked('Q1')).toBe(true)
    expect(result.current.isBookmarked('Q100')).toBe(true)
    expect(result.current.isBookmarked('Q500')).toBe(true)
  })

  it('returns false for unbookmarked question', () => {
    const { result } = renderHook(() => useBookmarks())
    expect(result.current.isBookmarked('Q999')).toBe(false)
  })

  it('clears all bookmarks', () => {
    const { result } = renderHook(() => useBookmarks())
    act(() => {
      result.current.toggle('Q1')
    })
    act(() => {
      result.current.toggle('Q2')
    })
    act(() => {
      result.current.clear()
    })
    expect(result.current.count).toBe(0)
    expect(result.current.isBookmarked('Q1')).toBe(false)
  })

  it('persists bookmarks in localStorage', () => {
    const { result } = renderHook(() => useBookmarks())
    act(() => {
      result.current.toggle('Q1')
    })
    const stored = JSON.parse(window.localStorage.getItem('javabypankaj.bookmarks') || '[]')
    expect(stored).toContain('Q1')
  })

  it('reads saved bookmarks on mount', () => {
    window.localStorage.setItem('javabypankaj.bookmarks', JSON.stringify(['Q5', 'Q10']))
    const { result } = renderHook(() => useBookmarks())
    expect(result.current.isBookmarked('Q5')).toBe(true)
    expect(result.current.isBookmarked('Q10')).toBe(true)
    expect(result.current.count).toBe(2)
  })

  it('returns bookmarked IDs as an array', () => {
    const { result } = renderHook(() => useBookmarks())
    act(() => {
      result.current.toggle('Q1')
    })
    act(() => {
      result.current.toggle('Q2')
    })
    expect(result.current.bookmarks).toContain('Q1')
    expect(result.current.bookmarks).toContain('Q2')
  })
})
