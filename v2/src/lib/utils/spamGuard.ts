const RATE_LIMIT_KEY = 'javabypankaj.submissions'
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_PER_WINDOW = 5 // 5 submissions per hour
const MIN_LENGTH = 20
const MAX_LENGTH = 500

export interface ValidationResult {
  valid: boolean
  error: string | null
}

/**
 * Validates a question submission against spam rules.
 * Returns { valid, error } where error is a user-friendly message.
 */
export function validateSubmission(question: string, honeypot: string): ValidationResult {
  const trimmed = question.trim()

  if (honeypot.length > 0) {
    return { valid: false, error: 'Submission rejected.' }
  }

  if (trimmed.length < MIN_LENGTH) {
    return { valid: false, error: `Question must be at least ${MIN_LENGTH} characters.` }
  }

  if (trimmed.length > MAX_LENGTH) {
    return { valid: false, error: `Question must be under ${MAX_LENGTH} characters.` }
  }

  const remaining = getRemainingSubmissions()
  if (remaining <= 0) {
    return { valid: false, error: `You've reached the limit of ${MAX_PER_WINDOW} questions per hour. Try again later.` }
  }

  return { valid: true, error: null }
}

/**
 * Returns how many submissions the user has left in the current window.
 */
function getRemainingSubmissions(): number {
  const timestamps = getTimestamps()
  const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS
  const recentCount = timestamps.filter((t) => t > cutoff).length
  return MAX_PER_WINDOW - recentCount
}

/**
 * Reads submission timestamps from localStorage.
 */
function getTimestamps(): number[] {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Records the current time as a submission timestamp.
 * Cleans up timestamps older than the rate limit window.
 */
export function recordSubmission(): void {
  try {
    const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS
    const timestamps = getTimestamps().filter((t) => t > cutoff)
    timestamps.push(Date.now())
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps))
  } catch {
    // localStorage unavailable
  }
}

export { MIN_LENGTH, MAX_LENGTH }
