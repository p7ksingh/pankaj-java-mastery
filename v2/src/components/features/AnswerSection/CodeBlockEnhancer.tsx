'use client'

import { useEffect, useRef } from 'react'
import styles from './AnswerSection.module.css'

interface CodeBlockEnhancerProps {
  html: string
  className: string
}

/**
 * Renders HTML content with two enhancements:
 * 1. Copy button in every .code-header and .diagram-header.
 * 2. Sentence highlighting on hover over <p> paragraphs.
 */
export function CodeBlockEnhancer({ html, className }: CodeBlockEnhancerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const overlaysRef = useRef<HTMLDivElement[]>([])

  // --- Copy buttons in code/diagram headers ---
  useEffect(() => {
    if (!ref.current) {
      return
    }

    const headers = ref.current.querySelectorAll('.code-header, .diagram-header')
    const cleanups: (() => void)[] = []

    headers.forEach((header) => {
      const block = header.parentElement
      if (!block) {
        return
      }

      const pre = block.querySelector('pre')
      if (!pre) {
        return
      }

      const btn = document.createElement('button')
      btn.className = styles.copyBtn
      btn.type = 'button'
      btn.setAttribute('aria-label', 'Copy code')
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'

      const handleClick = async () => {
        const code = pre.querySelector('code')
        const text = code ? code.textContent || '' : pre.textContent || ''
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          const ta = document.createElement('textarea')
          ta.value = text
          ta.style.position = 'fixed'
          ta.style.opacity = '0'
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        }
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        btn.classList.add(styles.copyBtnDone)
        setTimeout(() => {
          btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
          btn.classList.remove(styles.copyBtnDone)
        }, 1500)
      }

      btn.addEventListener('click', handleClick)
      header.appendChild(btn)

      cleanups.push(() => {
        btn.removeEventListener('click', handleClick)
        if (header.contains(btn)) {
          header.removeChild(btn)
        }
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [html])

  // --- Sentence highlighting on hover ---
  useEffect(() => {
    if (!ref.current) {
      return
    }
    const el = ref.current

    el.style.position = 'relative'
    let rafId = 0
    let lastKey = ''

    function clearOverlays() {
      for (const div of overlaysRef.current) {
        if (div.parentNode) {
          div.parentNode.removeChild(div)
        }
      }
      overlaysRef.current = []
      lastKey = ''
    }

    function getTextOffset(p: HTMLElement, targetNode: Node, targetOffset: number): number {
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT)
      let offset = 0
      let node = walker.nextNode()
      while (node) {
        if (node === targetNode) {
          return offset + targetOffset
        }
        offset += (node.textContent || '').length
        node = walker.nextNode()
      }
      return -1
    }

    function findSentenceBounds(text: string, cursor: number): [number, number] {
      let start = 0
      let end = text.length

      for (let i = cursor - 1; i >= 0; i--) {
        const ch = text[i]
        const next = text[i + 1]
        if ((ch === '.' || ch === '!' || ch === '?') && next === ' ') {
          start = i + 2
          break
        }
      }

      for (let i = cursor; i < text.length; i++) {
        const ch = text[i]
        const next = text[i + 1]
        if ((ch === '.' || ch === '!' || ch === '?') && (next === ' ' || next === undefined)) {
          end = i + 1
          break
        }
      }

      return [start, end]
    }

    function createRangeFromOffsets(p: HTMLElement, start: number, end: number): Range | null {
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT)
      const range = document.createRange()
      let offset = 0
      let startSet = false
      let node = walker.nextNode()

      while (node) {
        const len = (node.textContent || '').length
        if (!startSet && offset + len > start) {
          range.setStart(node, start - offset)
          startSet = true
        }
        if (startSet && offset + len >= end) {
          range.setEnd(node, Math.min(end - offset, len))
          return range
        }
        offset += len
        node = walker.nextNode()
      }
      return startSet ? range : null
    }

    function handleMouseMove(e: MouseEvent) {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const target = e.target as HTMLElement
        if (!el.contains(target)) {
          clearOverlays()
          return
        }

        const p = target.closest('p')
        if (!p || !el.contains(p) || target.closest('pre') || target.closest('table')) {
          clearOverlays()
          return
        }

        let caretRange: Range | null = null
        if (document.caretRangeFromPoint) {
          caretRange = document.caretRangeFromPoint(e.clientX, e.clientY)
        }
        if (!caretRange || caretRange.startContainer.nodeType !== Node.TEXT_NODE) {
          return
        }

        const globalOffset = getTextOffset(p, caretRange.startContainer, caretRange.startOffset)
        if (globalOffset < 0) {
          clearOverlays()
          return
        }

        const fullText = p.textContent || ''
        const [sentStart, sentEnd] = findSentenceBounds(fullText, globalOffset)

        if (sentEnd - sentStart < 5) {
          return
        }

        const key = `${sentStart}-${sentEnd}`
        if (key === lastKey) {
          return
        }

        clearOverlays()
        lastKey = key

        const sentenceRange = createRangeFromOffsets(p, sentStart, sentEnd)
        if (!sentenceRange) {
          return
        }

        const rects = sentenceRange.getClientRects()
        const elRect = el.getBoundingClientRect()

        for (const rect of rects) {
          if (rect.width < 2) {
            continue
          }
          const overlay = document.createElement('div')
          overlay.className = styles.sentenceHL
          overlay.style.position = 'absolute'
          overlay.style.top = (rect.top - elRect.top + el.scrollTop) + 'px'
          overlay.style.left = (rect.left - elRect.left) + 'px'
          overlay.style.width = rect.width + 'px'
          overlay.style.height = rect.height + 'px'
          overlay.style.pointerEvents = 'none'
          el.appendChild(overlay)
          overlaysRef.current.push(overlay)
        }
      })
    }

    function handleMouseLeave() {
      cancelAnimationFrame(rafId)
      clearOverlays()
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(rafId)
      clearOverlays()
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [html])

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
