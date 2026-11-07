import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import styles from '../privacy/page.module.css'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of use for javabypankaj.live — free Java interview preparation resource.',
  alternates: { canonical: '/terms/' },
}

export default function TermsPage() {
  const lastUpdated = 'November 5, 2026'

  return (
    <main className={styles.page}>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]} />
      <h1 className={styles.title}>Terms of Service</h1>
      <p className={styles.updated}>Last updated: {lastUpdated}</p>

      <article className={styles.content}>
        <section>
          <h2>The short version</h2>
          <p>
            javabypankaj.live is a free, open educational resource. Use it to prepare for interviews.
            Don&apos;t abuse the community features. That&apos;s it.
          </p>
        </section>

        <section>
          <h2>Content</h2>
          <p>
            All interview questions, answers, code examples, and explanations on this site are created
            for educational purposes. While we strive for accuracy, we make no warranty that the content
            is error-free or suitable for any particular interview.
          </p>
          <p>
            You may use the content for your personal interview preparation. You may not republish,
            scrape, or redistribute the content in bulk without permission.
          </p>
        </section>

        <section>
          <h2>Community submissions</h2>
          <p>
            When you submit a question to the community section, you grant us permission to display it
            on the site. We may edit submissions for clarity or reject them if they are spam, offensive,
            or off-topic.
          </p>
          <p>
            Do not submit content that is illegal, abusive, contains personal information about others,
            or infringes on intellectual property rights.
          </p>
        </section>

        <section>
          <h2>Likes and engagement</h2>
          <p>
            The like feature is for genuine engagement. Automated scripts, bots, or any attempt to
            artificially inflate like counts is prohibited and may result in rate limiting.
          </p>
        </section>

        <section>
          <h2>Free of charge</h2>
          <p>
            This site is free and will remain free. There are no paywalls, no premium tiers, and no
            login required. The &quot;Buy me a coffee&quot; option is a voluntary donation, not a purchase.
          </p>
        </section>

        <section>
          <h2>No warranty</h2>
          <p>
            This site is provided &quot;as is&quot; without warranty of any kind. We are not responsible
            for the outcome of any interview you attend, regardless of how much of our content you studied.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            We may update these terms. The date at the top will reflect the latest revision.
            Continued use of the site constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms? Email: <strong>hello@javabypankaj.live</strong>
          </p>
        </section>
      </article>
    </main>
  )
}
