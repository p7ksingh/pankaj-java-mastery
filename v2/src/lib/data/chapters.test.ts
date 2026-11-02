import { getAllChapters, getChapterBySlug, getChapterByNumber } from './chapters'

describe('getAllChapters', () => {
  it('returns an array of chapter summaries', () => {
    const chapters = getAllChapters()
    expect(Array.isArray(chapters)).toBe(true)
    expect(chapters.length).toBe(28)
  })

  it('returns chapters with required fields', () => {
    const chapters = getAllChapters()
    const first = chapters[0]
    expect(first.number).toBe(1)
    expect(first.slug).toBe('core-java')
    expect(first.title).toBe('Core Java')
    expect(first.topicCount).toBeGreaterThan(0)
    expect(first.questionCount).toBeGreaterThan(0)
  })

  it('returns chapters sorted by number', () => {
    const chapters = getAllChapters()
    for (let i = 1; i < chapters.length; i++) {
      expect(chapters[i].number).toBeGreaterThan(chapters[i - 1].number)
    }
  })
})

describe('getChapterBySlug', () => {
  it('returns a chapter when slug matches', () => {
    const chapter = getChapterBySlug('core-java')
    expect(chapter).not.toBeNull()
    expect(chapter?.title).toBe('Core Java')
    expect(chapter?.topics).toBeDefined()
    expect(chapter?.topics.length).toBeGreaterThan(0)
  })

  it('returns null when slug does not match', () => {
    expect(getChapterBySlug('nonexistent')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(getChapterBySlug('')).toBeNull()
  })

  it('includes topics with required fields', () => {
    const chapter = getChapterBySlug('core-java')
    const topic = chapter?.topics[0]
    expect(topic?.index).toBe(0)
    expect(topic?.slug).toBeTruthy()
    expect(topic?.title).toBeTruthy()
    expect(topic?.questionCount).toBeGreaterThan(0)
    expect(topic?.questionCount).toBeGreaterThan(0)
  })
})

describe('getChapterByNumber', () => {
  it('returns a chapter when number matches', () => {
    const chapter = getChapterByNumber(1)
    expect(chapter).not.toBeNull()
    expect(chapter?.slug).toBe('core-java')
  })

  it('returns null for number out of range', () => {
    expect(getChapterByNumber(0)).toBeNull()
    expect(getChapterByNumber(99)).toBeNull()
  })
})
