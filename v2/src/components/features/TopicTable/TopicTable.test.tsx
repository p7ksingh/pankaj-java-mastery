import { render, screen } from '@testing-library/react'
import { TopicTable } from './TopicTable'
import type { TopicSummary } from '@/types'

const mockTopics: TopicSummary[] = [
  { index: 0, slug: 'difference-between-jdk-jre-jvm', title: 'What is the difference between the JDK', questionCount: 1 },
  { index: 1, slug: 'what-happens-end-to-end', title: 'What happens end to end when a Java program runs', questionCount: 3 },
  { index: 2, slug: 'difference-between-equals', title: 'What is the difference between == and .equals', questionCount: 1 },
]

const baseProps = {
  topics: mockTopics,
  chapterSlug: 'core-java',
  chapterTitle: 'Core Java',
  chapterNumber: 1,
}

describe('TopicTable', () => {
  it('renders table headers', () => {
    render(<TopicTable {...baseProps} />)
    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('Topic')).toBeInTheDocument()
    expect(screen.getByText('Questions')).toBeInTheDocument()
  })

  it('renders a row for each topic', () => {
    render(<TopicTable {...baseProps} />)
    expect(screen.getByText('What is the difference between the JDK')).toBeInTheDocument()
    expect(screen.getByText('What happens end to end when a Java program runs')).toBeInTheDocument()
  })

  it('renders topic numbers starting from 1', () => {
    render(<TopicTable {...baseProps} />)
    const badges = document.querySelectorAll('tbody tr td:first-child')
    expect(badges[0]).toHaveTextContent('1')
    expect(badges[1]).toHaveTextContent('2')
    expect(badges[2]).toHaveTextContent('3')
  })

  it('renders question counts', () => {
    render(<TopicTable {...baseProps} />)
    const rows = document.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(3)
  })

  it('renders topic links with correct URL', () => {
    render(<TopicTable {...baseProps} />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/interview/core-java/difference-between-jdk-jre-jvm')
  })

  it('renders an empty table without crashing', () => {
    render(<TopicTable {...baseProps} topics={[]} />)
    expect(screen.getByText('#')).toBeInTheDocument()
  })
})
