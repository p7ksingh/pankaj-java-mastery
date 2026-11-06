import { render, screen } from '@testing-library/react'
import { QuestionCard } from './QuestionCard'
import type { QuestionPreview } from '@/types'

jest.mock('@/hooks/useLikes', () => ({
  useLikes: () => ({
    isLiked: () => false,
    toggle: jest.fn(),
  }),
}))

const mockQuestion: QuestionPreview = {
  id: 'Q1',
  slug: 'what-is-jdk',
  questionNumber: 1,
  title: 'What is the difference between JDK, JRE, and JVM?',
  shortTitle: 'What is the difference between JDK, JRE, and JVM?',
  chapterNumber: 1,
  chapterSlug: 'core-java',
  chapterTitle: 'Core Java',
  topicSlug: 'jdk-jre-jvm',
  topicTitle: 'JDK, JRE & JVM',
  keyPoints: ['JDK = JRE + dev tools', 'JRE = JVM + libraries', 'Platform independence'],
  oneliner: 'JDK builds it, JRE runs it, JVM executes it.',
}

describe('QuestionCard', () => {
  it('renders the short title', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        chapterSlug="core-java"
        topicSlug="jdk-jre-jvm"
      />,
    )
    expect(screen.getByText(mockQuestion.shortTitle)).toBeInTheDocument()
  })

  it('renders the oneliner preview', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        chapterSlug="core-java"
        topicSlug="jdk-jre-jvm"
      />,
    )
    expect(screen.getByText(mockQuestion.oneliner)).toBeInTheDocument()
  })

  it('renders the Read Answer link', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        chapterSlug="core-java"
        topicSlug="jdk-jre-jvm"
      />,
    )
    expect(screen.getByText('Read Answer')).toBeInTheDocument()
  })

  it('links to the correct reading page URL', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        chapterSlug="core-java"
        topicSlug="jdk-jre-jvm"
      />,
    )
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toContain('/interview/core-java/jdk-jre-jvm/Q1')
  })

  it('renders a like button', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        chapterSlug="core-java"
        topicSlug="jdk-jre-jvm"
      />,
    )
    expect(screen.getByLabelText(/like this question/i)).toBeInTheDocument()
  })

  it('handles a question with no oneliner gracefully', () => {
    const noOneliner = { ...mockQuestion, oneliner: '' }
    render(
      <QuestionCard
        question={noOneliner}
        chapterSlug="core-java"
        topicSlug="jdk-jre-jvm"
      />,
    )
    expect(screen.getByText(noOneliner.shortTitle)).toBeInTheDocument()
    expect(screen.getByText('Read Answer')).toBeInTheDocument()
  })
})
