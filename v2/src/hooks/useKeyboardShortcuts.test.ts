import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  it('calls onSearch when Cmd+K is pressed', () => {
    const onSearch = jest.fn()
    renderHook(() => useKeyboardShortcuts({ onSearch }))

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    document.dispatchEvent(event)

    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('calls onSearch when Ctrl+K is pressed', () => {
    const onSearch = jest.fn()
    renderHook(() => useKeyboardShortcuts({ onSearch }))

    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
    document.dispatchEvent(event)

    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('does not call onSearch on plain K press', () => {
    const onSearch = jest.fn()
    renderHook(() => useKeyboardShortcuts({ onSearch }))

    const event = new KeyboardEvent('keydown', { key: 'k' })
    document.dispatchEvent(event)

    expect(onSearch).not.toHaveBeenCalled()
  })

  it('calls onEscape when Escape is pressed', () => {
    const onEscape = jest.fn()
    renderHook(() => useKeyboardShortcuts({ onEscape }))

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)

    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('does not throw when handlers are not provided', () => {
    renderHook(() => useKeyboardShortcuts({}))

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    expect(() => document.dispatchEvent(event)).not.toThrow()
  })
})
