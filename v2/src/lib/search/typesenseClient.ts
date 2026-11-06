import Typesense from 'typesense'

/**
 * Typesense search-only client for the browser.
 * Uses NEXT_PUBLIC_ env vars (safe for frontend — search-only key).
 */
const searchClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || '',
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY || '',
  connectionTimeoutSeconds: 5,
})

export interface TypesenseHit {
  document: {
    id: string
    title: string
    shortTitle: string
    chapter: string
    topic: string
    url: string
    type: 'question' | 'subquestion'
    parentId: string
    content: string
    questionNumber: number
  }
  highlights: Array<{
    field: string
    snippet: string
    matched_tokens: string[]
  }>
}

export interface TypesenseSearchResult {
  hits: TypesenseHit[]
  found: number
}

/**
 * Search questions and sub-questions via Typesense.
 * Returns results with highlighted snippets.
 */
export async function searchQuestions(
  query: string,
  limit: number = 6,
): Promise<TypesenseSearchResult> {
  if (!query || query.length < 2) {
    return { hits: [], found: 0 }
  }

  try {
    const result = await searchClient
      .collections('questions')
      .documents()
      .search({
        q: query,
        query_by: 'title,shortTitle,content,chapter,topic',
        query_by_weights: '10,8,3,2,2',
        highlight_full_fields: 'title',
        highlight_start_tag: '<mark>',
        highlight_end_tag: '</mark>',
        per_page: limit,
        num_typos: 2,
        typo_tokens_threshold: 1,
      })

    return {
      hits: (result.hits || []) as TypesenseHit[],
      found: result.found || 0,
    }
  } catch {
    return { hits: [], found: 0 }
  }
}
