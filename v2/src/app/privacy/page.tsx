import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Privacy Policy | javabypankaj',
  description: 'How javabypankaj.live handles your data — what we collect, why, and your rights.',
  alternates: { canonical: '/privacy/' },
}

export default function PrivacyPage() {
  const lastUpdated = 'November 5, 2026'

  return (
    <main className={styles.page}>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: {lastUpdated}</p>

      <article className={styles.content}>
        <section>
          <h2>What we collect</h2>
          <p>
            We collect the minimum data needed to run this site. Here is the complete list — nothing hidden.
          </p>

          <h3>Email address (optional)</h3>
          <p>
            If you subscribe to updates, we store your email address in our database (AWS DynamoDB, Sydney region).
            We use it only to send you content updates. We never sell, share, or give your email to anyone.
          </p>

          <h3>Browser storage (localStorage)</h3>
          <p>
            We store your preferences and progress locally in your browser. This data never leaves your device
            and is never sent to our servers. It includes:
          </p>
          <ul>
            <li>Liked questions (so you see which ones you liked)</li>
            <li>Bookmarked questions (your library)</li>
            <li>Completed questions (your progress)</li>
            <li>Sidebar open/closed preference</li>
            <li>Subscribe popup dismissed timestamp</li>
          </ul>
          <p>You can clear this data anytime by clearing your browser storage.</p>

          <h3>Like counts</h3>
          <p>
            When you like a question, we increment an anonymous counter in our database. We do not track
            which user liked which question on the server — only the total count is stored. Your personal
            like state is stored in your browser only.
          </p>

          <h3>Community questions</h3>
          <p>
            If you submit a question to the community section, we store the question text, optional name,
            optional company, and optional email. Email is used only if we need to contact you about your
            submission and is never displayed publicly.
          </p>
        </section>

        <section>
          <h2>What we do NOT collect</h2>
          <ul>
            <li>No cookies (we use localStorage, not cookies)</li>
            <li>No tracking pixels or fingerprinting</li>
            <li>No personal profiles or accounts</li>
            <li>No payment information</li>
            <li>No location data</li>
          </ul>
        </section>

        <section>
          <h2>Third-party services</h2>
          <ul>
            <li><strong>AWS (Amazon Web Services)</strong> — hosts our database (DynamoDB) and API (Lambda) in the ap-southeast-2 (Sydney) region.</li>
            <li><strong>Typesense Cloud</strong> — powers the search feature. Your search queries are sent to Typesense servers to return results. Typesense does not store personal data.</li>
            <li><strong>GitHub Pages / Vercel</strong> — hosts the static website files.</li>
          </ul>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Unsubscribe</strong> — click the unsubscribe link in any email, or visit <a href="/unsubscribe">/unsubscribe</a>.</li>
            <li><strong>Delete your data</strong> — email us and we will delete your email from our database within 48 hours.</li>
            <li><strong>Clear local data</strong> — clear your browser&apos;s localStorage to remove all preferences, progress, and bookmarks.</li>
          </ul>
          <p>
            These rights apply regardless of where you live — GDPR (EU), CCPA (California),
            Indian IT Act, or any other jurisdiction.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For any privacy questions, email: <strong>privacy@javabypankaj.live</strong>
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            If we change this policy, we will update the date at the top. We will never start collecting
            more data without updating this page first.
          </p>
        </section>
      </article>
    </main>
  )
}
