import { getQuestionsByTopic, getQuestionById, getQuestionIdsForTopic } from './questions'

describe('getQuestionsByTopic', () => {
  it('returns questions for a valid topic', () => {
    const questions = getQuestionsByTopic(1, 'jdk-jre-jvm')
    expect(questions.length).toBeGreaterThan(0)
    expect(questions[0].id).toBe('Q1')
  })

  it('returns questions sorted by question number', () => {
    const questions = getQuestionsByTopic(1, 'keywords-final')
    for (let i = 1; i < questions.length; i++) {
      expect(questions[i].questionNumber).toBeGreaterThanOrEqual(questions[i - 1].questionNumber)
    }
  })

  it('returns empty array for nonexistent topic', () => {
    expect(getQuestionsByTopic(1, 'nonexistent-topic')).toEqual([])
  })

  it('returns empty array for nonexistent chapter', () => {
    expect(getQuestionsByTopic(99, 'anything')).toEqual([])
  })

  it('returns summaries with required fields', () => {
    const questions = getQuestionsByTopic(1, 'jdk-jre-jvm')
    const q = questions[0]
    expect(q.id).toBeTruthy()
    expect(q.slug).toBeTruthy()
    expect(q.title).toBeTruthy()
    expect(q.shortTitle).toBeTruthy()
    expect(q.chapterNumber).toBe(1)
    expect(q.chapterSlug).toBe('core-java')
  })
})

describe('getQuestionById', () => {
  it('returns a question with sections for a valid ID', () => {
    const q = getQuestionById(1, 'jdk-jre-jvm', 'Q1')
    expect(q).not.toBeNull()
    expect(q?.id).toBe('Q1')
    expect(q?.sections).toBeDefined()
    expect(Object.keys(q?.sections || {})).toContain('s1_definition')
  })

  it('returns null for nonexistent question ID', () => {
    expect(getQuestionById(1, 'jdk-jre-jvm', 'Q9999')).toBeNull()
  })

  it('returns null for nonexistent topic', () => {
    expect(getQuestionById(1, 'nonexistent', 'Q1')).toBeNull()
  })
})

describe('getQuestionIdsForTopic', () => {
  it('returns an array of question IDs', () => {
    const ids = getQuestionIdsForTopic(1, 'jdk-jre-jvm')
    expect(ids).toContain('Q1')
  })

  it('returns empty array for nonexistent topic', () => {
    expect(getQuestionIdsForTopic(1, 'nonexistent')).toEqual([])
  })
})
