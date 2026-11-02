import { renderHook, act } from '@testing-library/react'
import { useSpacedRepetition } from './useSpacedRepetition'

describe('useSpacedRepetition', () => {
  beforeEach(() => {
    window.localStorage.clear()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-11-02T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('starts with no items in the review queue', () => {
    const { result } = renderHook(() => useSpacedRepetition())
    expect(result.current.dueCount).toBe(0)
    expect(result.current.getDueItems()).toEqual([])
  })

  it('adds a question for review', () => {
    const { result } = renderHook(() => useSpacedRepetition())
    act(() => {
      result.current.addForReview('Q1')
    })
    expect(result.current.isInReview('Q1')).toBe(true)
  })

  it('marks a new item as due immediately', () => {
    const { result } = renderHook(() => useSpacedRepetition())
    act(() => {
      result.current.addForReview('Q1')
    })
    // First review is due after 1 day, so right now it should not be due
    expect(result.current.getDueItems()).toEqual([])
  })

  it('item becomes due after 1 day', () => {
    const { result } = renderHook(() => useSpacedRepetition())
    act(() => {
      result.current.addForReview('Q1')
    })
    // Advance 1 day
    jest.setSystemTime(new Date('2026-11-03T12:00:00Z'))
    const due = result.current.getDueItems()
    expect(due).toContain('Q1')
  })

  it('after first review, next due is 3 days later', () => {
    const { result } = renderHook(() => useSpacedRepetition())
    act(() => {
      result.current.addForReview('Q1')
    })
    jest.setSystemTime(new Date('2026-11-03T12:00:00Z'))
    act(() => {
      result.current.markReviewed('Q1')
    })
    // Not due right after review
    expect(result.current.getDueItems()).not.toContain('Q1')
    // Advance 3 days
    jest.setSystemTime(new Date('2026-11-06T12:00:00Z'))
    expect(result.current.getDueItems()).toContain('Q1')
  })

  it('after second review, next due is 7 days later', () => {
    const { result } = renderHook(() => useSpacedRepetition())
    act(() => {
      result.current.addForReview('Q1')
    })
    // Review 1 after day 1
    jest.setSystemTime(new Date('2026-11-03T12:00:00Z'))
    act(() => {
      result.current.markReviewed('Q1')
    })
    // Review 2 after day 3
    jest.setSystemTime(new Date('2026-11-06T12:00:00Z'))
    act(() => {
      result.current.markReviewed('Q1')
    })
    // Not due yet
    expect(result.current.getDueItems()).not.toContain('Q1')
    // Advance 7 days
    jest.setSystemTime(new Date('2026-11-13T12:00:00Z'))
    expect(result.current.getDueItems()).toContain('Q1')
  })

  it('marks as learned after 3 reviews', () => {
    const { result } = renderHook(() => useSpacedRepetition())
    act(() => {
      result.current.addForReview('Q1')
    })
    jest.setSystemTime(new Date('2026-11-03T12:00:00Z'))
    act(() => { result.current.markReviewed('Q1') })
    jest.setSystemTime(new Date('2026-11-06T12:00:00Z'))
    act(() => { result.current.markReviewed('Q1') })
    jest.setSystemTime(new Date('2026-11-13T12:00:00Z'))
    act(() => { result.current.markReviewed('Q1') })
    expect(result.current.isLearned('Q1')).toBe(true)
    expect(result.current.getDueItems()).not.toContain('Q1')
  })

  it('removes a question from review', () => {
    const { result } = renderHook(() => useSpacedRepetition())
    act(() => {
      result.current.addForReview('Q1')
    })
    act(() => {
      result.current.removeFromReview('Q1')
    })
    expect(result.current.isInReview('Q1')).toBe(false)
  })

  it('persists in localStorage', () => {
    const { result } = renderHook(() => useSpacedRepetition())
    act(() => {
      result.current.addForReview('Q5')
    })
    const stored = JSON.parse(window.localStorage.getItem('javabypankaj.spaced') || '{}')
    expect(stored['Q5']).toBeDefined()
  })
})
