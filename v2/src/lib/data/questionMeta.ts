/**
 * Slim question metadata loader.
 * Loads question-meta.json (~607KB) instead of search-index.json (3.7MB).
 * Used by Library and Popular pages for title/URL lookups.
 */

export interface QuestionMeta {
  id: string
  t: string   // title
  u: string   // url
  ch: string  // chapter
  tp: string  // topic
  qn: number  // question number
}

let cached: QuestionMeta[] | null = null

/** Loads the slim question metadata. Caches after first load. */
export async function loadQuestionMeta(): Promise<QuestionMeta[]> {
  if (cached) {
    return cached
  }
  const response = await fetch('/question-meta.json')
  cached = await response.json()
  return cached!
}
