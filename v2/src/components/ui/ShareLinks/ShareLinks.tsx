import { SvgIcon } from '@/components/ui/SvgIcon'
import { SHARE_PLATFORMS } from '@/lib/constants/share'
import type { SharePlatformId } from '@/lib/types/share'
import styles from './ShareLinks.module.css'

interface ShareLinksProps {
  /** The URL to share */
  url: string
  /** Optional title for platforms that support it */
  title?: string
  /** Subset of platforms to show. Defaults to all. */
  platforms?: readonly SharePlatformId[]
  className?: string
}

/**
 * Renders share icons for each configured platform.
 * Open/Closed: adding a platform to SHARE_PLATFORMS auto-renders it.
 * Single Responsibility: only renders share links, delegates URL building to config.
 */
export function ShareLinks({ url, title, platforms, className }: ShareLinksProps) {
  const visiblePlatforms = platforms
    ? SHARE_PLATFORMS.filter((p) => platforms.includes(p.id))
    : SHARE_PLATFORMS

  return (
    <div className={`${styles.shareLinks} ${className ?? ''}`} role="group" aria-label="Share this page">
      {visiblePlatforms.map((platform) => (
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
