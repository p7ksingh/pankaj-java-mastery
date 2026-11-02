import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { PageHeader } from '@/components/layout/PageHeader'
import { SearchResults } from '@/components/features/SearchResults'

export const metadata: Metadata = {
  title: 'Search | javabypankaj',
  description: 'Search across 2500+ Java interview questions.',
}

export default function SearchPage() {
  return (
    <main>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Search' },
        ]}
      />
      <PageHeader title="Search" />
      <SearchResults initialQuery="" />
    </main>
  )
}
