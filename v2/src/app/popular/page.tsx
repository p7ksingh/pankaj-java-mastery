import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { PageHeader } from '@/components/layout/PageHeader'
import { PopularList } from './PopularList'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Popular Questions',
  description: 'Most liked Java interview questions — ranked by the community.',
}

export const dynamic = 'force-static'

export default function PopularPage() {
  return (
    <main className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Popular' },
        ]}
      />
      <PageHeader title="Popular Questions" />
      <PopularList />
    </main>
  )
}
