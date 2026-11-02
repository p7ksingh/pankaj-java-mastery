/** Minimal chapter info used in listings and navigation. */
export interface ChapterSummary {
  number: number
  slug: string
  title: string
  topicCount: number
  questionCount: number
}

/** Full chapter with its topics. */
export interface Chapter extends ChapterSummary {
  topics: TopicSummary[]
}

/** One topic within a chapter. */
export interface TopicSummary {
  index: number
  slug: string
  title: string
  questionCount: number
  questionIds: string[]
}
