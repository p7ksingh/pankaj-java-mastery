import { Logo } from '@/components/ui/Logo'
import styles from './Footer.module.css'

interface FooterProps {
  siteName: string
  tagline: string
  siteUrl: string
  social: {
    linkedin?: string
    github?: string
    instagram?: string
  }
}

export function Footer({ siteName, tagline, siteUrl, social }: FooterProps) {
  const encodedUrl = encodeURIComponent(siteUrl)

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandGroup}>
          <Logo size={44} className={styles.logo} />
          <div>
            <div className={styles.name}>{siteName}</div>
            <div className={styles.tagline}>{tagline}</div>
          </div>
        </div>
        <div className={styles.links}>
          <div className={styles.column}>
            <div className={styles.heading}>Share</div>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Share on LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Share on X
            </a>
            <a
              href={`https://wa.me/?text=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Share on WhatsApp
            </a>
          </div>
          <div className={styles.column}>
            <div className={styles.heading}>Connect</div>
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
                LinkedIn
              </a>
            )}
            {social.github && (
              <a href={social.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
