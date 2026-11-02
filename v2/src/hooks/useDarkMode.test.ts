import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from './useDarkMode'

describe('useDarkMode', () => {
  beforeEach(() => {
    document.body.classList.remove('dark')
    window.localStorage.clear()
  })

  it('starts in light mode by default', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDark).toBe(false)
    expect(document.body.classList.contains('dark')).toBe(false)
  })

  it('toggles to dark mode', () => {
    const { result } = renderHook(() => useDarkMode())
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isDark).toBe(true)
    expect(document.body.classList.contains('dark')).toBe(true)
  })

  it('toggles back to light mode', () => {
    const { result } = renderHook(() => useDarkMode())
    act(() => {
      result.current.toggle()
    })
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isDark).toBe(false)
    expect(document.body.classList.contains('dark')).toBe(false)
  })

  it('persists preference in localStorage', () => {
    const { result } = renderHook(() => useDarkMode())
    act(() => {
      result.current.toggle()
    })
    const stored = JSON.parse(window.localStorage.getItem('javabypankaj.theme') || 'false')
    expect(stored).toBe(true)
  })

  it('reads saved preference on mount', () => {
    window.localStorage.setItem('javabypankaj.theme', 'true')
    const { result } = renderHook(() => useDarkMode())
    // useEffect runs after render, need to wait
    expect(result.current.isDark).toBe(true)
  })
})
