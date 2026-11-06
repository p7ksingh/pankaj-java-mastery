import { render, screen } from '@testing-library/react'
import { ShareLinks } from './ShareLinks'

describe('ShareLinks', () => {
  const defaultProps = {
    url: 'https://www.javabypankaj.live',
    title: 'javabypankaj',
  }

  it('renders all share platform links', () => {
    render(<ShareLinks {...defaultProps} />)
    expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on X')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on WhatsApp')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on Telegram')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on Email')).toBeInTheDocument()
  })

  it('renders links with correct href', () => {
    render(<ShareLinks {...defaultProps} />)
    const linkedin = screen.getByLabelText('Share on LinkedIn')
    expect(linkedin).toHaveAttribute('href')
    expect(linkedin.getAttribute('href')).toContain('linkedin.com')
  })

  it('opens links in new tab', () => {
    render(<ShareLinks {...defaultProps} />)
    const linkedin = screen.getByLabelText('Share on LinkedIn')
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders a subset of platforms when specified', () => {
    render(<ShareLinks {...defaultProps} platforms={['linkedin', 'x']} />)
    expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on X')).toBeInTheDocument()
    expect(screen.queryByLabelText('Share on WhatsApp')).not.toBeInTheDocument()
  })

  it('has correct aria role and label', () => {
    render(<ShareLinks {...defaultProps} />)
    expect(screen.getByRole('group', { name: 'Share this page' })).toBeInTheDocument()
  })
})
