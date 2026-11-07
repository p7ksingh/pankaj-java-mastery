import { Logo } from '@/components/ui/Logo'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { CoffeeButton } from '@/components/ui/CoffeeButton'
import { buildSocialProfiles } from '@/lib/utils/share'
import Link from 'next/link'
import styles from './Footer.module.css'

interface FooterProps {
  siteName: string
  social: {
    linkedin?: string
    github?: string
    instagram?: string
  }
}

/**
 * Footer — minimal identity bar: wordmark, copyright, social profiles.
 * Share actions live on the reading page (page-specific), not in the global footer.
 */
export function Footer({ siteName, social }: FooterProps) {
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

        {/* Buy me a coffee — opens SupportModal */}
        <CoffeeButton />

        {/* Social profiles */}
        <SocialLinks profiles={socialProfiles} />

        <span className={styles.legalLinks}>
          <Link href="/privacy/" className={styles.legalLink}>Privacy</Link>
          <Link href="/terms/" className={styles.legalLink}>Terms</Link>
        </span>
      </div>
    </footer>
  )
}
