'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import styles from './ShareButton.module.css'

interface ShareButtonProps {
  url: string
  title: string
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 1500)
    } catch {
      // Fallback handled silently
    }
  }, [fullUrl])

  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className={styles.container}>
      <Button variant="outline" size="sm" onClick={() => setShowMenu(!showMenu)}>
        Share
      </Button>
      {showMenu && (
        <div className={styles.menu}>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.menuItem}
          >
            LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.menuItem}
          >
            X
          </a>
          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.menuItem}
          >
            WhatsApp
          </a>
          <button className={styles.menuItem} onClick={handleCopyLink}>
            {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  )
}
