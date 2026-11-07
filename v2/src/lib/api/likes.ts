/**
 * Likes API client.
 *
 * Backend stores aggregate like counts per question in DynamoDB.
 * Frontend stores which questions THIS user liked in localStorage.
 *
 * Pattern:
 * - POST /likes   → increment count (user liked)
 * - DELETE /likes  → decrement count (user unliked)
 * - GET /likes?ids=Q1,Q2 → batch fetch counts
 */

const ENDPOINT = process.env.NEXT_PUBLIC_LIKES_API || ''

/** Increment like count for a question. Returns new count. */
export async function postLike(questionId: string): Promise<number> {
  if (!ENDPOINT) {
    return 0
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId }),
    })
    if (!res.ok) {
      return 0
    }
    const data = await res.json()
    return data.likeCount ?? 0
  } catch {
    return 0
  }
}

/** Decrement like count for a question. Returns new count. */
export async function deleteLike(questionId: string): Promise<number> {
  if (!ENDPOINT) {
    return 0
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId }),
    })
    if (!res.ok) {
      return 0
    }
    const data = await res.json()
    return data.likeCount ?? 0
  } catch {
    return 0
  }
}

/**
 * Batch fetch like counts for multiple questions.
 * Returns a map of questionId → likeCount.
 * Max 100 IDs per call (DynamoDB BatchGet limit).
 */
export async function fetchLikeCounts(
  questionIds: string[],
): Promise<Record<string, number>> {
  if (!ENDPOINT || questionIds.length === 0) {
    return {}
  }
  try {
    const ids = questionIds.slice(0, 100).join(',')
    const res = await fetch(`${ENDPOINT}?ids=${encodeURIComponent(ids)}`)
    if (!res.ok) {
      return {}
    }
    const data = await res.json()
    return data.counts ?? {}
  } catch {
    return {}
  }
}

/**
 * Fetch top-liked questions (for Popular page).
 * Returns array sorted by most liked.
 */
export async function fetchTopLiked(
  limit: number = 50,
): Promise<Array<{ questionId: string; likeCount: number }>> {
  if (!ENDPOINT) {
    return []
  }
  try {
    const res = await fetch(`${ENDPOINT}?top=${limit}`)
    if (!res.ok) {
      return []
    }
    const data = await res.json()
    return data.items ?? []
  } catch {
    return []
  }
}
