import { render, screen } from '@testing-library/react'
import { SocialLinks } from './SocialLinks'
import type { SocialProfile } from '@/lib/types/share'

const mockProfiles: SocialProfile[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/test',
    icon: { paths: ['M0 0'], type: 'fill' },
  },
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/test',
    icon: { paths: ['M0 0'], type: 'fill' },
  },
]

describe('SocialLinks', () => {
  it('renders all profiles', () => {
    render(<SocialLinks profiles={mockProfiles} />)
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
  })

  it('links to correct URLs', () => {
    render(<SocialLinks profiles={mockProfiles} />)
    expect(screen.getByLabelText('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/in/test')
    expect(screen.getByLabelText('GitHub')).toHaveAttribute('href', 'https://github.com/test')
  })

  it('opens links in new tab', () => {
    render(<SocialLinks profiles={mockProfiles} />)
    expect(screen.getByLabelText('LinkedIn')).toHaveAttribute('target', '_blank')
  })

  it('renders empty when no profiles provided', () => {
    render(<SocialLinks profiles={[]} />)
    const group = screen.getByRole('group')
    expect(group.children).toHaveLength(0)
  })

  it('has correct aria role and label', () => {
    render(<SocialLinks profiles={mockProfiles} />)
    expect(screen.getByRole('group', { name: 'Social profiles' })).toBeInTheDocument()
  })
})
