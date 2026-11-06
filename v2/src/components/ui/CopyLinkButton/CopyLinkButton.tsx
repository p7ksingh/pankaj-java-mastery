'use client'

import { useState, useCallback } from 'react'
import { SvgIcon } from '@/components/ui/SvgIcon'
import { COPY_LINK_ICON } from '@/lib/constants/share'
import styles from './CopyLinkButton.module.css'

interface CopyLinkButtonProps {
  /** Text to copy. Defaults to current page URL at runtime. */
  textToCopy?: string
  label?: string
  copiedLabel?: string
  className?: string
}

const COPIED_RESET_MS = 2000

/**
 * Copy-to-clipboard button with transient "Copied!" feedback.
 * Single Responsibility: only handles copy + visual feedback.
 * Reusable anywhere — not coupled to Footer.
 */
export function CopyLinkButton({
  textToCopy,
  label = 'Copy link',
  copiedLabel = 'Copied!',
  className,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const text = textToCopy ?? (typeof window !== 'undefined' ? window.location.href : '')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), COPIED_RESET_MS)
  }, [textToCopy])

  return (
    <button
      className={`${styles.copyBtn} ${copied ? styles.copied : ''} ${className ?? ''}`}
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
    >
      <SvgIcon icon={COPY_LINK_ICON} size={14} />
      <span>{copied ? copiedLabel : label}</span>
    </button>
  )
}
