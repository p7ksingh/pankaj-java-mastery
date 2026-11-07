import type { Metadata } from 'next'
import Image from 'next/image'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { StructuredData } from '@/components/seo/StructuredData'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About',
  description: 'About javabypankaj.live — free Java interview prep built by Pankaj Singh. 2,466 questions from Core Java to System Design.',
}

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About javabypankaj',
          description: 'Free Java interview preparation platform with 2,466 questions.',
          url: 'https://www.javabypankaj.live/about/',
          mainEntity: {
            '@type': 'Person',
            name: 'Pankaj Singh',
            url: 'https://www.javabypankaj.live',
            sameAs: [
              'https://github.com/p7ksingh',
              'https://www.linkedin.com/in/p7ksingh',
            ],
            jobTitle: 'Software Engineer',
            knowsAbout: ['Java', 'Spring Boot', 'Microservices', 'System Design', 'Data Structures'],
          },
        }}
      />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
      />

      <article className={styles.article}>
        <h1 className={styles.title}>About javabypankaj</h1>

        <div className={styles.story}>
          <p>
            I built this because I had the same problem. Every time an interview came up, I was all over the place. Five YouTube channels, three blogs, random Medium articles, half finished notes. Nothing covered everything. Nothing had a structure. I never actually got good at any one source because I kept jumping between all of them.
          </p>
          <p>
            Every engineer goes through this. You use one site for Core Java, a different one for Spring, something else for System Design. Then the interviewer asks a follow up and you go blank because you never went deep enough in any single place.
          </p>
          <p>
            javabypankaj is the one resource I wish I had when I started. It covers fresher to architect level. Core Java to System Design. Short answers when you need quick recall. Long answers with real code, edge cases, and comparison tables when they push you deeper. One place for your whole career.
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>2,466</span>
            <span className={styles.statLabel}>Questions</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>23</span>
            <span className={styles.statLabel}>Chapters</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>20,000+</span>
            <span className={styles.statLabel}>Sub-topics</span>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>What makes this different</h2>
        <ul className={styles.list}>
          <li>Every answer has production-level code you can run, not pseudocode</li>
          <li>Banking domain examples throughout, so the code feels real, not academic</li>
          <li>8+ sub-questions per topic covering what, why, how, edge cases, and common mistakes</li>
          <li>Comparison tables for every A vs B question interviewers love to ask</li>
          <li>Wrong code vs correct code sections so you learn from mistakes</li>
          <li>Fresher to architect level, all in one place</li>
        </ul>

        <h2 className={styles.sectionTitle}>About me</h2>
        <div className={styles.author}>
          <Image src="/pankaj-singh.jpg" alt="Pankaj Singh" width={44} height={44} className={styles.authorAvatar} style={{ objectFit: 'cover' }} />
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>Pankaj Singh</div>
            <div className={styles.authorRole}>Software Engineer</div>
          </div>
        </div>
        <p className={styles.text}>
          I build and maintain this project by myself. No team, no company, no funding. Just one engineer who wanted to solve a real problem.
        </p>

        <div className={styles.links}>
          <a href="https://github.com/p7ksingh" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/p7ksingh" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            LinkedIn
          </a>
          <a href="https://buymeacoffee.com/pksingh.w" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>
            Buy me a coffee
          </a>
        </div>

        <div className={styles.principles}>
          <h2 className={styles.sectionTitle}>Principles</h2>
          <div className={styles.principle}>
            <span className={styles.principleLabel}>Free forever</span>
            <span className={styles.principleText}>No ads. No paywall. No login required. Just the content.</span>
          </div>
          <div className={styles.principle}>
            <span className={styles.principleLabel}>One resource</span>
            <span className={styles.principleText}>Stop jumping between five sites. Everything is here.</span>
          </div>
          <div className={styles.principle}>
            <span className={styles.principleLabel}>Interview ready</span>
            <span className={styles.principleText}>Every answer is written to be spoken in an interview, not just read.</span>
          </div>
        </div>
      </article>
    </main>
  )
}
