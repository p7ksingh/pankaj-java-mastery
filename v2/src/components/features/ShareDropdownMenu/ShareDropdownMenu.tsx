'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { SvgIcon } from '@/components/ui/SvgIcon'
import { SHARE_PLATFORMS, COPY_LINK_ICON } from '@/lib/constants/share'
import styles from './ShareDropdownMenu.module.css'

interface ShareDropdownMenuProps {
  onClose: () => void
}

/**
 * Global share dropdown — appears in the topbar.
 * Uses the current page URL and document title.
 * Shares include title + URL so platforms show rich previews.
 * OG tags on each page provide the preview image automatically.
 */
export function ShareDropdownMenu({ onClose }: ShareDropdownMenuProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUrl(window.location.href)
    setTitle(document.title)
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          !(e.target as HTMLElement).closest('[data-share-trigger]')) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onClose()
      }, 1500)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onClose()
      }, 1500)
    }
  }, [url, onClose])

  return (
    <div className={styles.menu} ref={menuRef} role="menu" aria-label="Share options">
      <button className={styles.item} onClick={handleCopy} role="menuitem">
        <SvgIcon icon={COPY_LINK_ICON} size={18} />
        <span>{copied ? 'Copied!' : 'Copy link'}</span>
      </button>

      <div className={styles.sep} />

      {SHARE_PLATFORMS.map((platform) => (
        <a
          key={platform.id}
          href={url ? platform.buildUrl(url, title) : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.item}
          role="menuitem"
          onClick={onClose}
        >
          <SvgIcon icon={platform.icon} size={18} />
          <span>Share on {platform.label}</span>
        </a>
      ))}
    </div>
  )
}
