import { render, screen } from '@testing-library/react'
import { AnswerSection } from './AnswerSection'

describe('AnswerSection', () => {
  it('renders a string section with label and content', () => {
    render(<AnswerSection sectionKey="s2_technical" content="The JVM loads bytecode." />)
    expect(screen.getByText('Technical Deep Dive')).toBeInTheDocument()
    expect(screen.getByText(/JVM loads bytecode/)).toBeInTheDocument()
  })

  it('renders a structured section with oneliner and profdef', () => {
    render(
      <AnswerSection
        sectionKey="s1_definition"
        content={{
          profdef: 'The JVM is the runtime engine.',
          analogy: 'Think of it as a cash machine.',
          oneliner: 'JDK builds, JRE runs, JVM executes.',
          raw: 'Full text here.',
        }}
      />,
    )
    expect(screen.getByText('Definition')).toBeInTheDocument()
    expect(screen.getByText('JDK builds, JRE runs, JVM executes.')).toBeInTheDocument()
    expect(screen.getByText(/JVM is the runtime engine/)).toBeInTheDocument()
    expect(screen.getByText(/cash machine/)).toBeInTheDocument()
  })

  it('renders empty content without crashing', () => {
    render(<AnswerSection sectionKey="s2_technical" content="" />)
    expect(screen.getByText('Technical Deep Dive')).toBeInTheDocument()
  })

  it('converts bold markdown to strong tags', () => {
    const { container } = render(
      <AnswerSection sectionKey="s2_technical" content="This is **bold** text." />,
    )
    expect(container.querySelector('strong')).toHaveTextContent('bold')
  })

  it('converts inline code to code tags', () => {
    const { container } = render(
      <AnswerSection sectionKey="s4d_java" content="Use `HashMap` here." />,
    )
    expect(container.querySelector('code')).toHaveTextContent('HashMap')
  })

  it('falls back label for unknown section key', () => {
    render(<AnswerSection sectionKey="s99_unknown_key" content="Content." />)
    expect(screen.getByText('Unknown key')).toBeInTheDocument()
  })
})
