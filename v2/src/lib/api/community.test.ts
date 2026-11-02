import { submitQuestion, getCommunityQuestions } from './community'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('submitQuestion', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('sends POST with question data', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ msg: 'Saved' }),
    })

    const result = await submitQuestion({
      question: 'What is HashMap?',
      email: 'test@example.com',
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Saved')
  })

  it('returns success even on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await submitQuestion({
      question: 'Test',
      email: 'test@test.com',
    })

    expect(result.success).toBe(true)
  })
})

describe('getCommunityQuestions', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('returns questions from the API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { question: 'What is Spring Boot?', company: 'Infosys', name: 'Rahul' },
        ]),
    })

    const questions = await getCommunityQuestions()
    expect(questions).toHaveLength(1)
    expect(questions[0].question).toBe('What is Spring Boot?')
  })

  it('returns empty array on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Offline'))
    const questions = await getCommunityQuestions()
    expect(questions).toEqual([])
  })

  it('returns empty array on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })
    const questions = await getCommunityQuestions()
    expect(questions).toEqual([])
  })
})
