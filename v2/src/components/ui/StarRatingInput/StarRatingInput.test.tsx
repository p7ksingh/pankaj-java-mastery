import { render, screen, fireEvent } from '@testing-library/react'
import { StarRatingInput } from './StarRatingInput'

describe('StarRatingInput', () => {
  it('renders 5 star buttons by default', () => {
    render(<StarRatingInput value={null} onChange={jest.fn()} />)
    const stars = screen.getAllByRole('radio')
    expect(stars).toHaveLength(5)
  })

  it('renders a custom number of stars when max is set', () => {
    render(<StarRatingInput value={null} onChange={jest.fn()} max={3} />)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('shows "Rate this question" tooltip when unrated', () => {
    render(<StarRatingInput value={null} onChange={jest.fn()} label="Rate this question" />)
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('title', 'Rate this question')
  })

  it('shows "Your rating: X/5" tooltip when rated', () => {
    render(<StarRatingInput value={4} onChange={jest.fn()} />)
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('title', 'Your rating: 4/5')
  })

  it('shows the numeric label when a value is set', () => {
    render(<StarRatingInput value={3} onChange={jest.fn()} />)
    expect(screen.getByText('3.0')).toBeInTheDocument()
  })

  it('does not show numeric label when unrated', () => {
    render(<StarRatingInput value={null} onChange={jest.fn()} />)
    expect(screen.queryByText(/\.0/)).not.toBeInTheDocument()
  })

  it('calls onChange with the star value when clicked', () => {
    const onChange = jest.fn()
    render(<StarRatingInput value={null} onChange={onChange} />)
    const stars = screen.getAllByRole('radio')
    fireEvent.click(stars[2]) // 3rd star
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('each star has a title tooltip with its value', () => {
    render(<StarRatingInput value={null} onChange={jest.fn()} />)
    expect(screen.getByTitle('1 star')).toBeInTheDocument()
    expect(screen.getByTitle('2 stars')).toBeInTheDocument()
    expect(screen.getByTitle('3 stars')).toBeInTheDocument()
    expect(screen.getByTitle('4 stars')).toBeInTheDocument()
    expect(screen.getByTitle('5 stars')).toBeInTheDocument()
  })

  it('marks the correct star as checked', () => {
    render(<StarRatingInput value={2} onChange={jest.fn()} />)
    const stars = screen.getAllByRole('radio')
    expect(stars[1]).toHaveAttribute('aria-checked', 'true')
    expect(stars[0]).toHaveAttribute('aria-checked', 'false')
    expect(stars[2]).toHaveAttribute('aria-checked', 'false')
  })

  it('sets aria-label on the radiogroup', () => {
    render(<StarRatingInput value={null} onChange={jest.fn()} label="Rate Q1" />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Rate Q1')
  })
})
