import { render, screen } from '@testing-library/react'
import { ChapterSidebar } from './ChapterSidebar'
import type { Chapter, ChapterSummary } from '@/types'

jest.mock('@/hooks/useUserProgress', () => ({
  useUserProgress: () => ({
    isComplete: () => false,
    toggleComplete: jest.fn(),
    getTopicProgress: () => ({ completed: 0, total: 0, percentage: 0, isComplete: false, likeCount: 0 }),
    getChapterProgress: () => ({
      completedQuestions: 0,
      totalQuestions: 0,
      percentage: 0,
      isComplete: false,
      completedTopics: 0,
      totalTopics: 0,
      likeCount: 0,
    }),
  }),
}))

jest.mock('@/hooks/useLikes', () => ({
  useLikes: () => ({
    likes: [],
    isLiked: () => false,
    toggle: jest.fn(),
    clear: jest.fn(),
    count: 0,
    getLikeCount: () => 0,
  }),
}))

const mockChapter: Chapter = {
  number: 1,
  slug: 'core-java',
  title: 'Core Java',
  topicCount: 3,
  questionCount: 18,
  topics: [
    { index: 0, slug: 'jdk-jre-jvm', title: 'JDK, JRE & JVM', questionCount: 4 },
    { index: 1, slug: 'variables-scope', title: 'Variables & Scope', questionCount: 6 },
    { index: 2, slug: 'primitives', title: 'Primitive Types', questionCount: 8 },
  ],
}

const mockAllChapters: ChapterSummary[] = [
  { number: 1, slug: 'core-java', title: 'Core Java', topicCount: 3, questionCount: 18 },
  { number: 2, slug: 'oop', title: 'OOP', topicCount: 5, questionCount: 32 },
]

describe('ChapterSidebar', () => {
  it('renders the chapter title in the hero section', () => {
    render(
      <ChapterSidebar chapter={mockChapter} allChapters={mockAllChapters} activeTopicSlug="jdk-jre-jvm" />,
    )
    expect(screen.getAllByText('Core Java').length).toBeGreaterThanOrEqual(1)
  })

  it('renders topic and question count pills', () => {
    render(
      <ChapterSidebar chapter={mockChapter} allChapters={mockAllChapters} activeTopicSlug="jdk-jre-jvm" />,
    )
    expect(screen.getByText('3 topics')).toBeInTheDocument()
    expect(screen.getByText('18 questions')).toBeInTheDocument()
  })

  it('renders all topics as links', () => {
    render(
      <ChapterSidebar chapter={mockChapter} allChapters={mockAllChapters} activeTopicSlug="jdk-jre-jvm" />,
    )
    expect(screen.getByText('JDK, JRE & JVM')).toBeInTheDocument()
    expect(screen.getByText('Variables & Scope')).toBeInTheDocument()
    expect(screen.getByText('Primitive Types')).toBeInTheDocument()
  })

  it('marks the active topic with aria-current', () => {
    render(
      <ChapterSidebar chapter={mockChapter} allChapters={mockAllChapters} activeTopicSlug="jdk-jre-jvm" />,
    )
    const activeLink = screen.getByText('JDK, JRE & JVM').closest('a')
    expect(activeLink).toHaveAttribute('aria-current', 'true')
  })

  it('renders other chapters in the nav', () => {
    render(
      <ChapterSidebar chapter={mockChapter} allChapters={mockAllChapters} activeTopicSlug="jdk-jre-jvm" />,
    )
    expect(screen.getByText('OOP')).toBeInTheDocument()
  })

  it('renders navigation landmarks', () => {
    render(
      <ChapterSidebar chapter={mockChapter} allChapters={mockAllChapters} activeTopicSlug="jdk-jre-jvm" />,
    )
    expect(screen.getByLabelText('Core Java navigation')).toBeInTheDocument()
    expect(screen.getByLabelText('Topics in this chapter')).toBeInTheDocument()
    expect(screen.getByLabelText('All chapters')).toBeInTheDocument()
  })

  it('renders topic links with correct hrefs', () => {
    render(
      <ChapterSidebar chapter={mockChapter} allChapters={mockAllChapters} activeTopicSlug="jdk-jre-jvm" />,
    )
    const topicLink = screen.getByText('Variables & Scope').closest('a')
    expect(topicLink?.getAttribute('href')).toContain('/interview/core-java/variables-scope')
  })
})
