import { getChapterRating, MAX_RATING } from './chapterRatings'

describe('getChapterRating', () => {
  it('returns the configured rating for a known chapter', () => {
    expect(getChapterRating(1)).toBe(4) // Core Java
    expect(getChapterRating(3)).toBe(5) // Collections
    expect(getChapterRating(7)).toBe(3) // Spring & Spring Boot
  })

  it('returns the default rating for an unknown chapter', () => {
    expect(getChapterRating(99)).toBe(3)
    expect(getChapterRating(0)).toBe(3)
    expect(getChapterRating(-1)).toBe(3)
  })

  it('returns a value between 1 and MAX_RATING', () => {
    for (const num of [1, 2, 3, 4, 5, 6, 10, 17, 24, 99]) {
      const rating = getChapterRating(num)
      expect(rating).toBeGreaterThanOrEqual(1)
      expect(rating).toBeLessThanOrEqual(MAX_RATING)
    }
  })
})

describe('MAX_RATING', () => {
  it('is 5', () => {
    expect(MAX_RATING).toBe(5)
  })
})
