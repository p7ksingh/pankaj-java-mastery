import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

const defaultProps = {
  siteName: 'javabypankaj',
  tagline: 'One platform. Every interview. Your entire career.',
  siteUrl: 'https://www.javabypankaj.live',
  social: {
    linkedin: 'https://linkedin.com/in/p7ksingh',
    github: 'https://github.com/p7ksingh',
  },
}

describe('Footer', () => {
  it('renders the site name', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByText('javabypankaj')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByText(defaultProps.tagline)).toBeInTheDocument()
  })

  it('renders share links', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByText('Share on LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Share on X')).toBeInTheDocument()
    expect(screen.getByText('Share on WhatsApp')).toBeInTheDocument()
  })

  it('renders share links with correct URLs using the site URL', () => {
    render(<Footer {...defaultProps} />)
    const linkedInLink = screen.getByText('Share on LinkedIn').closest('a')
    expect(linkedInLink?.href).toContain('javabypankaj.live')
  })

  it('renders inside a footer element', () => {
    const { container } = render(<Footer {...defaultProps} />)
    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('renders social links', () => {
    render(<Footer {...defaultProps} />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain(defaultProps.social.linkedin)
    expect(hrefs).toContain(defaultProps.social.github)
  })
})
