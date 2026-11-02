import { render, screen } from '@testing-library/react'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  it('renders the site name', () => {
    render(<TopBar siteName="javabypankaj" />)
    expect(screen.getByText('javabypankaj')).toBeInTheDocument()
  })

  it('renders the logo link pointing to home', () => {
    render(<TopBar siteName="javabypankaj" />)
    const link = screen.getByRole('link', { name: /javabypankaj/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders the search input', () => {
    render(<TopBar siteName="javabypankaj" />)
    expect(screen.getByPlaceholderText('Search questions...')).toBeInTheDocument()
  })

  it('renders the submit button when showSubmit is true', () => {
    render(<TopBar siteName="javabypankaj" showSubmit />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('hides the submit button when showSubmit is false', () => {
    render(<TopBar siteName="javabypankaj" showSubmit={false} />)
    expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument()
  })

  it('renders the dark mode toggle', () => {
    render(<TopBar siteName="javabypankaj" />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('renders inside a nav element', () => {
    render(<TopBar siteName="javabypankaj" />)
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
  })
})
