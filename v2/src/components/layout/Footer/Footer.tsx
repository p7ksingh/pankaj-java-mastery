import { Logo } from '@/components/ui/Logo'
import { ShareLinks } from '@/components/ui/ShareLinks'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { CopyLinkButton } from '@/components/ui/CopyLinkButton'
import { buildSocialProfiles } from '@/lib/utils/share'
import styles from './Footer.module.css'

interface FooterProps {
  siteName: string
  siteUrl: string
  social: {
    linkedin?: string
    github?: string
    instagram?: string
  }
}

/**
 * Footer — Option D: single-row minimal bar.
 * Composition pattern: composes Logo, ShareLinks, CopyLinkButton, SocialLinks.
 * No hardcoded URLs, platforms, or icons — all driven by config/constants.
 */
export function Footer({ siteName, siteUrl, social }: FooterProps) {
  const socialProfiles = buildSocialProfiles(social)
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.bar}>
        {/* Wordmark */}
        <Logo size="footer" className={styles.wordmark} />

        {/* Copyright */}
        <span className={styles.copyright}>
          © {currentYear} {siteName}
        </span>

        {/* Spacer pushes actions right */}
        <span className={styles.spacer} />

        {/* Copy page link */}
        <CopyLinkButton textToCopy={siteUrl} />

        <span className={styles.divider} />

        {/* Share on platforms */}
        <ShareLinks url={siteUrl} title={`${siteName} — Crack Any Java Interview`} />

        <span className={styles.divider} />

        {/* Social profiles */}
        <SocialLinks profiles={socialProfiles} />
      </div>
    </footer>
  )
}
