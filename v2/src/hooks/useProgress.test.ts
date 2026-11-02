import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress'

describe('useProgress', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts with no completed questions', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.completedCount).toBe(0)
  })

  it('marks a question as completed', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.toggle('Q1')
    })
    expect(result.current.isCompleted('Q1')).toBe(true)
    expect(result.current.completedCount).toBe(1)
  })

  it('unmarks a question on second toggle', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.toggle('Q1')
    })
    act(() => {
      result.current.toggle('Q1')
    })
    expect(result.current.isCompleted('Q1')).toBe(false)
    expect(result.current.completedCount).toBe(0)
  })

  it('tracks multiple questions', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.toggle('Q1')
    })
    act(() => {
      result.current.toggle('Q50')
    })
    act(() => {
      result.current.toggle('Q200')
    })
    expect(result.current.completedCount).toBe(3)
    expect(result.current.isCompleted('Q1')).toBe(true)
    expect(result.current.isCompleted('Q50')).toBe(true)
    expect(result.current.isCompleted('Q200')).toBe(true)
  })

  it('calculates percentage for a set of question IDs', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.toggle('Q1')
    })
    act(() => {
      result.current.toggle('Q2')
    })
    const pct = result.current.getPercentage(['Q1', 'Q2', 'Q3', 'Q4'])
    expect(pct).toBe(50)
  })

  it('returns 0 percentage for empty question list', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.getPercentage([])).toBe(0)
  })

  it('returns 0 when nothing is completed', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.getPercentage(['Q1', 'Q2'])).toBe(0)
  })

  it('returns 100 when all are completed', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.toggle('Q1')
    })
    act(() => {
      result.current.toggle('Q2')
    })
    expect(result.current.getPercentage(['Q1', 'Q2'])).toBe(100)
  })

  it('persists in localStorage', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.toggle('Q5')
    })
    const stored = JSON.parse(window.localStorage.getItem('javabypankaj.progress') || '[]')
    expect(stored).toContain('Q5')
  })

  it('reads saved progress on mount', () => {
    window.localStorage.setItem('javabypankaj.progress', JSON.stringify(['Q10', 'Q20']))
    const { result } = renderHook(() => useProgress())
    expect(result.current.isCompleted('Q10')).toBe(true)
    expect(result.current.isCompleted('Q20')).toBe(true)
    expect(result.current.completedCount).toBe(2)
  })

  it('clears all progress', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.toggle('Q1')
    })
    act(() => {
      result.current.toggle('Q2')
    })
    act(() => {
      result.current.clear()
    })
    expect(result.current.completedCount).toBe(0)
    expect(result.current.isCompleted('Q1')).toBe(false)
  })
})
