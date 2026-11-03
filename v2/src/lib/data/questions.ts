import * as fs from 'fs'
import * as path from 'path'
import type { QuestionSummary, Question, AnswerSections } from '@/types'

const DATA_DIR = path.resolve(process.cwd(), 'data/interview')

interface RawQuestion {
  id: string
  slug: string
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

function toSummary(raw: RawQuestion): QuestionSummary {
  return {
    id: raw.id,
    slug: raw.slug,
    questionNumber: raw.questionNumber,
    title: raw.title,
    shortTitle: raw.shortTitle,
    chapterNumber: raw.chapterNumber,
    chapterSlug: raw.chapterSlug,
    chapterTitle: raw.chapterTitle,
  }
}

function toQuestion(raw: RawQuestion): Question {
  return {
    ...toSummary(raw),
    keyPoints: raw.keyPoints || [],
    sections: raw.sections as AnswerSections,
  }
}
