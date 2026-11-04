import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllChapters, getChapterBySlug } from '@/lib/data/chapters'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { PageHeader } from '@/components/layout/PageHeader'
import { TopicTable } from '@/components/features/TopicTable'
import { StructuredData } from '@/components/seo/StructuredData'

interface PageProps {
  params: Promise<{ chapter: string }>
}

export async function generateStaticParams() {
  const chapters = getAllChapters()
  return chapters.map((c) => ({ chapter: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: slug } = await params
  const chapter = getChapterBySlug(slug)
  if (!chapter) {
    return { title: 'Chapter Not Found' }
  }
  return {
    title: `${chapter.title} Interview Questions`,
    description: `${chapter.questionCount} real ${chapter.title} interview questions with code, diagrams and ready-to-speak answers.`,
    alternates: { canonical: `/interview/${slug}/` },
    openGraph: {
      title: `${chapter.title} Interview Questions | javabypankaj`,
      description: `${chapter.questionCount} real ${chapter.title} interview questions with code, diagrams and ready-to-speak answers.`,
    },
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { chapter: slug } = await params
  const chapter = getChapterBySlug(slug)

  if (!chapter) {
    notFound()
  }

  const chPad = String(chapter.number).padStart(2, '0')

  return (
    <main>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.javabypankaj.live/' },
            { '@type': 'ListItem', position: 2, name: chapter.title },
          ],
        }}
      />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: chapter.title },
        ]}
      />
      <PageHeader
        title={chapter.title}
        stats={[
          { label: '', value: `Ch ${chPad}` },
          { label: 'Topics', value: chapter.topicCount },
          { label: 'Qs', value: chapter.questionCount },
        ]}
      />
      <TopicTable
        topics={chapter.topics}
        chapterSlug={chapter.slug}
        chapterTitle={chapter.title}
        chapterNumber={chapter.number}
      />
    </main>
  )
}
