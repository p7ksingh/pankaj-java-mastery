/** Minimal question info used in listings and search results. */
export interface QuestionSummary {
  id: string
  slug: string
  questionNumber: number
  title: string
  shortTitle: string
  chapterNumber: number
  chapterSlug: string
  chapterTitle: string
}

/** Full question with all answer sections. */
export interface Question extends QuestionSummary {
  sections: AnswerSections
}

/**
 * Sections keyed by their identifier (s1_definition, s2_technical, etc.).
 * Each section contains structured parts: profdef, analogy, oneliner, raw.
 */
export interface AnswerSections {
  [sectionKey: string]: SectionContent
}

/** Content within one answer section. */
export interface SectionContent {
  profdef: string
  analogy: string
  oneliner: string
  raw: string
}
