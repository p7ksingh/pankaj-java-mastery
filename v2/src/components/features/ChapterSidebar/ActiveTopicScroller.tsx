'use client'

import { useEffect, useRef } from 'react'

interface ActiveTopicScrollerProps {
  children: React.ReactNode
}

/**
 * Wraps the active topic list item and scrolls it into view on mount.
 * Uses scrollIntoView with block: 'nearest' to avoid jarring jumps
 * when the active item is already visible.
 */
export function ActiveTopicScroller({ children }: ActiveTopicScrollerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && typeof ref.current.scrollIntoView === 'function') {
      ref.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
