import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  const defaultProps = {
    siteName: 'javabypankaj',
    siteUrl: 'https://www.javabypankaj.live',
    social: {
      linkedin: 'https://www.linkedin.com/in/p7ksingh/',
      github: 'https://github.com/p7ksingh',
    },
  }

  it('renders the footer element', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders the wordmark logo', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByText('javabypankaj')).toBeInTheDocument()
  })

  it('renders current year in copyright', () => {
    render(<Footer {...defaultProps} />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument()
  })

  it('renders share links', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on X')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on WhatsApp')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on Telegram')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on Email')).toBeInTheDocument()
  })

  it('renders copy link button', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByText('Copy link')).toBeInTheDocument()
  })

  it('renders social profile links', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
  })

  it('links social profiles to correct URLs', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByLabelText('GitHub')).toHaveAttribute('href', 'https://github.com/p7ksingh')
  })

  it('renders without optional social links', () => {
    render(<Footer {...defaultProps} social={{ linkedin: 'https://linkedin.com/in/test' }} />)
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.queryByLabelText('GitHub')).not.toBeInTheDocument()
  })
})
