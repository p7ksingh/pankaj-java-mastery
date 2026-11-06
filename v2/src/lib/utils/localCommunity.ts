/**
 * Local community question store.
 * Persists user-submitted questions in localStorage so they appear
 * immediately on the community page — even before the API processes them.
 */

const STORAGE_KEY = 'javabypankaj.communityLocal'

export interface LocalCommunityQuestion {
  question: string
  topic: string | null
  company: string | null
  timestamp: number
}

/** Read all locally posted questions. */
export function getLocalQuestions(): LocalCommunityQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Save a new locally posted question. */
export function addLocalQuestion(question: string, topic: string | null, company: string | null): void {
  try {
    const list = getLocalQuestions()
    list.unshift({ question, topic, company, timestamp: Date.now() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))

    // Notify other components in the same tab
    window.dispatchEvent(
      new CustomEvent('localStorageSync', { detail: { key: STORAGE_KEY, value: list } }),
    )
  } catch {
    // localStorage unavailable
  }
}
