/** Distinguishes interview content from learning content. */
export type ContentType = 'interview' | 'learn'

/** Search result returned from any content source. */
export interface SearchResult {
  type: ContentType
  id: string
  slug: string
  title: string
  chapterTitle: string
  highlight: string
}
