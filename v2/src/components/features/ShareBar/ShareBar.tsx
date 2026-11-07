'use client'

import { CopyLinkButton } from '@/components/ui/CopyLinkButton'
import { SvgIcon } from '@/components/ui/SvgIcon'
import { SHARE_PLATFORMS } from '@/lib/constants/share'
import styles from './ShareBar.module.css'

interface ShareBarProps {
  /** Page title for share intent */
  title: string
}

/**
 * Share bar — appears on the reading page after the article.
 * Gold standard: share actions belong on the content page, not in the global footer.
 * Renders: "Share" label, copy link, and all configured share platforms.
 */
export function ShareBar({ title }: ShareBarProps) {
  const url = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className={styles.shareBar} role="group" aria-label="Share this article">
      <span className={styles.label}>Share</span>
      <CopyLinkButton className={styles.copyBtn} />
      <span className={styles.divider} />
      {SHARE_PLATFORMS.map((platform) => (
        <a
          key={platform.id}
          href={platform.buildUrl(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
          aria-label={`Share on ${platform.label}`}
          title={`Share on ${platform.label}`}
        >
          <SvgIcon icon={platform.icon} size={16} />
        </a>
      ))}
    </div>
  )
}
