'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './TagPicker.module.css'

interface TagPickerProps {
  label: string
  icon: React.ReactNode
  options: readonly string[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  allowCustom?: boolean
}

/**
 * Searchable dropdown tag picker with optional custom entry.
 * Used for topic and company selection in community write section.
 */
export function TagPicker({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder = 'Search...',
  allowCustom = true,
}: TagPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  )
  const showCustom = allowCustom && search.trim().length >= 2 && filtered.length === 0

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val)
      setOpen(false)
      setSearch('')
    },
    [onChange],
  )

  const handleCustom = useCallback(() => {
    if (search.trim().length >= 2) {
      onChange(search.trim())
      setOpen(false)
      setSearch('')
    }
  }, [search, onChange])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  return (
    <div className={styles.picker} ref={ref}>
      <button
        type="button"
        className={`${styles.btn} ${value ? styles.btnSelected : ''}`}
        onClick={() => setOpen(!open)}
      >
        {icon}
        <span>{value || label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <input
            ref={inputRef}
            type="text"
            className={styles.search}
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.options}>
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.option} ${opt === value ? styles.optionActive : ''}`}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          {showCustom && (
            <button type="button" className={styles.customBtn} onClick={handleCustom}>
              + Add &ldquo;{search.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  )
}
