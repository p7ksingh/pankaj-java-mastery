import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CommunityQuestionList } from '@/components/features/CommunityPage'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Community Questions | javabypankaj',
  description: 'Real interview questions shared by developers. Share your own and help others prepare.',
}

export default function CommunityPage() {
  return (
    <main className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Community' },
        ]}
      />
      <CommunityQuestionList />
    </main>
  )
}
