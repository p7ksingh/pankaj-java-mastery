'use client'

import { useState, useEffect, useCallback } from 'react'

export interface HeadingInfo {
  id: string
  text: string
}

/** Offset from viewport top to consider a heading "active" */
const SCROLL_OFFSET = 100

/**
 * Observes h3[id] headings inside a container and returns the currently
 * visible heading ID based on scroll position.
 *
 * Uses scroll event (throttled) instead of IntersectionObserver for
 * reliable active-heading detection — especially after click-to-scroll.
 *
 * @param containerSelector - CSS selector for the article container
 * @returns { headings, activeId, scrollTo } — heading list, active ID, and scroll function
 */
export function useHeadingObserver(containerSelector: string) {
  const [headings, setHeadings] = useState<HeadingInfo[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // Extract headings on mount
  useEffect(() => {
    const container = document.querySelector(containerSelector)
    if (!container) {
      return
    }

    const elements = container.querySelectorAll('h3[id]')
    const list: HeadingInfo[] = []
    elements.forEach((el) => {
      list.push({
        id: el.id,
        text: el.textContent ?? '',
      })
    })

    setHeadings(list)
    if (list.length > 0) {
      setActiveId(list[0].id)
    }
  }, [containerSelector])

  // Scroll-based active heading detection (throttled)
  useEffect(() => {
    if (headings.length === 0) {
      return
    }

    let ticking = false

    function updateActiveHeading() {
      let current = headings[0]?.id ?? null

      // Find the last heading whose top is above the offset line
      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= SCROLL_OFFSET) {
            current = heading.id
          } else {
            break
          }
        }
      }

      setActiveId(current)
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateActiveHeading)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial check
    updateActiveHeading()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [headings])

  // Scroll to a heading and immediately set it as active
  const scrollTo = useCallback((id: string) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return { headings, activeId, scrollTo }
}
