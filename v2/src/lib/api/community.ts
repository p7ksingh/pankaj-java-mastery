import { API_ENDPOINTS } from '@/lib/constants/api'

export interface QuestionSubmission {
  question: string
  email: string
  company?: string
  topic?: string
  name?: string
}

export interface CommunityQuestion {
  question: string
  company?: string
  topic?: string
  name?: string
  date?: string
}

export interface SubmitResult {
  success: boolean
  message: string
}

/** Submits a user-contributed interview question to the API. */
export async function submitQuestion(data: QuestionSubmission): Promise<SubmitResult> {
  const endpoint = API_ENDPOINTS.questions
  if (!endpoint) {
    return { success: false, message: 'API not configured.' }
  }
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    return { success: true, message: result.msg || 'Submitted successfully.' }
  } catch {
    return { success: true, message: 'Submitted. Thank you.' }
  }
}

/** Fetches community-submitted questions from the API. */
export async function getCommunityQuestions(): Promise<CommunityQuestion[]> {
  const endpoint = API_ENDPOINTS.questions
  if (!endpoint) {
    return []
  }
  try {
    const response = await fetch(endpoint)
    if (!response.ok) {
      return []
    }
    const data = await response.json()
    return Array.isArray(data) ? data : data.questions || []
  } catch {
    return []
  }
}
