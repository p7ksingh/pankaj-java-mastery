import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its text content', () => {
    render(<Badge>01</Badge>)
    expect(screen.getByText('01')).toBeInTheDocument()
  })

  it('pads single digit numbers with zero', () => {
    render(<Badge>{String(1).padStart(2, '0')}</Badge>)
    expect(screen.getByText('01')).toBeInTheDocument()
  })

  it('renders a question ID', () => {
    render(<Badge variant="question">Q1</Badge>)
    expect(screen.getByText('Q1')).toBeInTheDocument()
  })

  it('applies default variant class', () => {
    const { container } = render(<Badge>01</Badge>)
    expect(container.firstChild).toHaveClass('chapter')
  })

  it('applies question variant class', () => {
    const { container } = render(<Badge variant="question">Q1</Badge>)
    expect(container.firstChild).toHaveClass('question')
  })

  it('renders empty string without crashing', () => {
    const { container } = render(<Badge>{''}</Badge>)
    expect(container.firstChild).toBeInTheDocument()
  })
})
