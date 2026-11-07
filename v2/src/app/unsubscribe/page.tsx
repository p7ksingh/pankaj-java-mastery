import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { UnsubscribeForm } from './UnsubscribeForm'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from javabypankaj email notifications.',
}

export default function UnsubscribePage() {
  return (
    <main className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Unsubscribe' },
        ]}
      />
      <UnsubscribeForm />
    </main>
  )
}
