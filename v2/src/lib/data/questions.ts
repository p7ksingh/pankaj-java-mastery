import * as fs from 'fs'
import * as path from 'path'
import type { QuestionSummary, QuestionPreview, Question, AnswerSections } from '@/types'

const DATA_DIR = path.resolve(process.cwd(), 'data/interview')

interface RawQuestion {
  id: string
  slug: string
  urlSlug: string
  questionNumber: number
  title: string
  shortTitle: string
  chapterNumber: number
  chapterSlug: string
  chapterTitle: string
  topicIndex: number
  topicSlug: string
  topicTitle: string
  keyPoints?: string[]
  sections: Record<string, unknown>
}

/** Returns all questions for a given topic. */
export function getQuestionsByTopic(chapterNumber: number, topicSlug: string): QuestionSummary[] {
  const chPad = String(chapterNumber).padStart(2, '0')
  const topicDir = path.join(DATA_DIR, `ch${chPad}`, 'topics', topicSlug)

  if (!fs.existsSync(topicDir)) {
    return []
  }

  const files = fs.readdirSync(topicDir).filter((f) => f.endsWith('.json'))
  const questions: QuestionSummary[] = []

  for (const file of files) {
    const raw: RawQuestion = JSON.parse(fs.readFileSync(path.join(topicDir, file), 'utf-8'))
    questions.push(toSummary(raw))
  }

  return questions.sort((a, b) => a.questionNumber - b.questionNumber)
}

/** Returns question previews for R1 cards (includes keyPoints + oneliner). */
export function getQuestionPreviewsByTopic(chapterNumber: number, topicSlug: string): QuestionPreview[] {
  const chPad = String(chapterNumber).padStart(2, '0')
  const topicDir = path.join(DATA_DIR, `ch${chPad}`, 'topics', topicSlug)

  if (!fs.existsSync(topicDir)) {
    return []
  }

  const files = fs.readdirSync(topicDir).filter((f) => f.endsWith('.json'))
  const previews: QuestionPreview[] = []

  for (const file of files) {
    const raw: RawQuestion = JSON.parse(fs.readFileSync(path.join(topicDir, file), 'utf-8'))
    previews.push(toPreview(raw))
  }

  return previews.sort((a, b) => a.questionNumber - b.questionNumber)
}

/** Returns a single question with all sections. Returns null if not found. */
export function getQuestionById(chapterNumber: number, topicSlug: string, questionId: string): Question | null {
  const chPad = String(chapterNumber).padStart(2, '0')
  const filePath = path.join(DATA_DIR, `ch${chPad}`, 'topics', topicSlug, `${questionId}.json`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw: RawQuestion = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return toQuestion(raw)
}

/** Returns all question IDs for a topic. Used by generateStaticParams. */
export function getQuestionIdsForTopic(chapterNumber: number, topicSlug: string): string[] {
  const chPad = String(chapterNumber).padStart(2, '0')
  const topicDir = path.join(DATA_DIR, `ch${chPad}`, 'topics', topicSlug)

  if (!fs.existsSync(topicDir)) {
    return []
  }

  return fs
    .readdirSync(topicDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
}

/** Returns all question IDs for a chapter, grouped by topic. Used for progress tracking. */
export function getChapterQuestionIds(chapterNumber: number, topics: Array<{ slug: string; questionIds?: string[] }>): string[] {
  const allIds: string[] = []
  for (const topic of topics) {
    if (topic.questionIds) {
      allIds.push(...topic.questionIds)
    } else {
      // Fallback: read from filesystem
      allIds.push(...getQuestionIdsForTopic(chapterNumber, topic.slug))
    }
  }
  return allIds
}

/** Returns a question by its urlSlug within a topic. Returns null if not found. */
export function getQuestionByUrlSlug(chapterNumber: number, topicSlug: string, urlSlug: string): Question | null {
  const chPad = String(chapterNumber).padStart(2, '0')
  const topicDir = path.join(DATA_DIR, `ch${chPad}`, 'topics', topicSlug)

  if (!fs.existsSync(topicDir)) {
    return null
  }

  const files = fs.readdirSync(topicDir).filter((f) => f.endsWith('.json'))
  for (const file of files) {
    const raw: RawQuestion = JSON.parse(fs.readFileSync(path.join(topicDir, file), 'utf-8'))
    if (raw.urlSlug === urlSlug) {
      return toQuestion(raw)
    }
  }

  return null
}

/** Resolves a Q-based ID to its urlSlug. Used for redirects. */
export function resolveIdToUrlSlug(chapterNumber: number, topicSlug: string, questionId: string): string | null {
  const chPad = String(chapterNumber).padStart(2, '0')
  const filePath = path.join(DATA_DIR, `ch${chPad}`, 'topics', topicSlug, `${questionId}.json`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw: RawQuestion = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return raw.urlSlug || null
}

function toSummary(raw: RawQuestion): QuestionSummary {
  return {
    id: raw.id,
    slug: raw.slug,
    urlSlug: raw.urlSlug,
    questionNumber: raw.questionNumber,
    title: raw.title,
    shortTitle: raw.shortTitle,
    chapterNumber: raw.chapterNumber,
    chapterSlug: raw.chapterSlug,
    chapterTitle: raw.chapterTitle,
  }
}

function extractOneliner(sections: Record<string, unknown>): string {
  const s1 = sections?.s1_definition
  if (s1 && typeof s1 === 'object' && s1 !== null) {
    const def = s1 as Record<string, unknown>
    if (typeof def.oneliner === 'string') {
      return def.oneliner
    }
  }
  return ''
}

function toPreview(raw: RawQuestion): QuestionPreview {
  return {
    ...toSummary(raw),
    keyPoints: Array.isArray(raw.keyPoints) ? raw.keyPoints : [],
    oneliner: extractOneliner(raw.sections),
    topicSlug: raw.topicSlug,
    topicTitle: raw.topicTitle,
  }
}

function toQuestion(raw: RawQuestion): Question {
  return {
    ...toSummary(raw),
    keyPoints: raw.keyPoints || [],
    sections: raw.sections as AnswerSections,
  }
}
