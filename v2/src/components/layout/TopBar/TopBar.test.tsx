import { render, screen } from '@testing-library/react'
import { TopBar } from './TopBar'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock ThemeContext
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ mode: 'light', isDark: false, setMode: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

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

  it('renders the search icon button', () => {
    render(<TopBar siteName="javabypankaj" />)
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('renders the hamburger menu button', () => {
    render(<TopBar siteName="javabypankaj" />)
    expect(screen.getByRole('button', { name: /open sidebar/i })).toBeInTheDocument()
  })

  it('renders the profile button', () => {
    render(<TopBar siteName="javabypankaj" />)
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument()
  })

  it('renders inside a nav element', () => {
    render(<TopBar siteName="javabypankaj" />)
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
  })
})
