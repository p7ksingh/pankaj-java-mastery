import { SvgIcon } from '@/components/ui/SvgIcon'
import { SOCIAL_ICONS } from '@/lib/constants/share'
import type { SocialProfile } from '@/lib/types/share'
import styles from './SocialLinks.module.css'

interface SocialLinksProps {
  /** Social profiles to render (order preserved) */
  profiles: readonly SocialProfile[]
  className?: string
}

/**
 * Renders social profile icon links.
 * Decoupled from data source — receives profiles as props (Dependency Inversion).
 * Open/Closed: new profiles are added by passing them in, no component change.
 */
export function SocialLinks({ profiles, className }: SocialLinksProps) {
  return (
    <div className={`${styles.socialLinks} ${className ?? ''}`} role="group" aria-label="Social profiles">
      {profiles.map((profile) => {
        const icon = SOCIAL_ICONS.get(profile.id) ?? profile.icon
        return (
          <a
            key={profile.id}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label={profile.label}
            title={profile.label}
          >
            <SvgIcon icon={icon} size={16} />
          </a>
        )
      })}
    </div>
  )
}
