import { render, screen } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders a single item without a link', () => {
    render(<Breadcrumb items={[{ label: 'Home' }]} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders links for all items except the last', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Core Java', href: '/interview/core-java' },
          { label: 'Collections' },
        ]}
      />,
    )
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveTextContent('Home')
    expect(links[1]).toHaveTextContent('Core Java')
    expect(screen.getByText('Collections')).toBeInTheDocument()
  })

  it('renders separators between items', () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'OOP' },
        ]}
      />,
    )
    const separators = container.querySelectorAll('[class*="separator"]')
    expect(separators).toHaveLength(1)
  })

  it('renders inside a nav element with aria-label', () => {
    render(<Breadcrumb items={[{ label: 'Home' }]} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('renders an empty list without crashing', () => {
    const { container } = render(<Breadcrumb items={[]} />)
    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('marks the last item as current with aria-current', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Core Java' },
        ]}
      />,
    )
    expect(screen.getByText('Core Java')).toHaveAttribute('aria-current', 'page')
  })
})
