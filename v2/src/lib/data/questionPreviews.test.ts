import { getQuestionPreviewsByTopic } from './questions'

describe('getQuestionPreviewsByTopic', () => {
  it('returns previews with keyPoints and oneliner for a known topic', () => {
    const previews = getQuestionPreviewsByTopic(1, 'jdk-jre-jvm')
    expect(previews.length).toBeGreaterThan(0)

    const first = previews[0]
    expect(first.id).toBeTruthy()
    expect(first.shortTitle).toBeTruthy()
    expect(first.topicSlug).toBe('jdk-jre-jvm')
    expect(first.topicTitle).toBeTruthy()
    expect(Array.isArray(first.keyPoints)).toBe(true)
    expect(typeof first.oneliner).toBe('string')
  })

  it('returns previews sorted by questionNumber', () => {
    const previews = getQuestionPreviewsByTopic(1, 'jdk-jre-jvm')
    for (let i = 1; i < previews.length; i++) {
      expect(previews[i].questionNumber).toBeGreaterThan(previews[i - 1].questionNumber)
    }
  })

  it('returns an empty array for a nonexistent topic', () => {
    expect(getQuestionPreviewsByTopic(1, 'nonexistent-topic')).toEqual([])
  })

  it('returns an empty array for a nonexistent chapter', () => {
    expect(getQuestionPreviewsByTopic(99, 'jdk-jre-jvm')).toEqual([])
  })

  it('includes chapterSlug and chapterTitle in each preview', () => {
    const previews = getQuestionPreviewsByTopic(1, 'jdk-jre-jvm')
    for (const p of previews) {
      expect(p.chapterSlug).toBe('core-java')
      expect(p.chapterTitle).toBe('Core Java')
    }
  })

  it('has a non-empty oneliner for questions with s1_definition', () => {
    const previews = getQuestionPreviewsByTopic(1, 'jdk-jre-jvm')
    // Q1 is known to have an oneliner
    const q1 = previews.find((p) => p.id === 'Q1')
    expect(q1).toBeDefined()
    expect(q1?.oneliner.length).toBeGreaterThan(0)
  })
})
