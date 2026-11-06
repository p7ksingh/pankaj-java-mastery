import { API_ENDPOINTS } from '@/lib/constants/api'

const QUEUE_KEY = 'javabypankaj.submissionQueue'

interface QueuedSubmission {
  question: string
  timestamp: number
}

/**
 * Reads the pending submission queue from localStorage.
 */
function getQueue(): QueuedSubmission[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Writes the queue back to localStorage.
 */
function saveQueue(queue: QueuedSubmission[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch {
    // localStorage unavailable
  }
}

/**
 * Adds a submission to the localStorage queue.
 * Called immediately on user submit (before API call).
 */
export function enqueue(question: string): void {
  const queue = getQueue()
  queue.push({ question, timestamp: Date.now() })
  saveQueue(queue)
}

/**
 * Removes a submission from the queue (after successful POST).
 */
function dequeue(timestamp: number): void {
  const queue = getQueue().filter((s) => s.timestamp !== timestamp)
  saveQueue(queue)
}

/**
 * Attempts to POST a single submission to the API.
 * Returns true on success, false on failure.
 */
async function postSubmission(sub: QueuedSubmission): Promise<boolean> {
  const endpoint = API_ENDPOINTS.questions
  if (!endpoint) {
    return false
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: sub.question.trim(),
        company: '',
        topic: '',
        name: '',
        email: '',
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Flushes all pending submissions in the queue.
 * Called on page load and after new submissions.
 * Each successful POST removes the item from the queue.
 * Failed POSTs stay in the queue for next retry.
 */
export async function flushQueue(): Promise<void> {
  const queue = getQueue()
  if (queue.length === 0) {
    return
  }

  for (const sub of queue) {
    const ok = await postSubmission(sub)
    if (ok) {
      dequeue(sub.timestamp)
    }
  }
}

/**
 * Returns the number of pending (unsent) submissions.
 */
export function pendingCount(): number {
  return getQueue().length
}
