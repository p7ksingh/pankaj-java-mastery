/** Minimal question info used in listings and search results. */
export interface QuestionSummary {
  id: string
  slug: string
  urlSlug: string
  questionNumber: number
  title: string
  shortTitle: string
  chapterNumber: number
  chapterSlug: string
  chapterTitle: string
}

/** Question preview for R1 cards — summary plus content hints. */
export interface QuestionPreview extends QuestionSummary {
  keyPoints: string[]
  oneliner: string
  topicSlug: string
  topicTitle: string
}

/** Full question with all answer sections. */
export interface Question extends QuestionSummary {
  keyPoints?: string[]
  sections: AnswerSections
}

/**
 * Sections keyed by identifier (s1_definition, s2_technical, etc.).
 * s1_definition is a structured dict. All others are raw markdown strings.
 */
export interface AnswerSections {
  [sectionKey: string]: SectionContent | string
}

/** Structured content in the definition section. */
export interface SectionContent {
  profdef: string
  analogy: string
  oneliner: string
  raw: string
  [key: string]: string
}
