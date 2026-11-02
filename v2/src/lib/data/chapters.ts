import * as fs from 'fs'
import * as path from 'path'
import type { ChapterSummary, Chapter, TopicSummary } from '@/types'

const DATA_DIR = path.resolve(process.cwd(), 'data/interview')

interface ChaptersIndex {
  totalQuestions: number
  totalChapters: number
  chapters: ChapterSummary[]
}

interface ChapterMeta {
  number: number
  slug: string
  title: string
  topicCount: number
  questionCount: number
  topics: TopicSummary[]
}

/** Returns all chapters sorted by number. Used on the home page. */
export function getAllChapters(): ChapterSummary[] {
  const filePath = path.join(DATA_DIR, 'chapters.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data: ChaptersIndex = JSON.parse(raw)
  return data.chapters.sort((a, b) => a.number - b.number)
}

/** Returns a full chapter with topics. Returns null if slug does not match. */
export function getChapterBySlug(slug: string): Chapter | null {
  if (!slug) {
    return null
  }

  const chapters = getAllChapters()
  const summary = chapters.find((c) => c.slug === slug)
  if (!summary) {
    return null
  }

  return loadChapterMeta(summary.number)
}

/** Returns a full chapter by its number. Returns null if not found. */
export function getChapterByNumber(num: number): Chapter | null {
  const chapters = getAllChapters()
  const summary = chapters.find((c) => c.number === num)
  if (!summary) {
    return null
  }

  return loadChapterMeta(num)
}

function loadChapterMeta(chapterNumber: number): Chapter | null {
  const chPad = String(chapterNumber).padStart(2, '0')
  const metaPath = path.join(DATA_DIR, `ch${chPad}`, 'meta.json')

  if (!fs.existsSync(metaPath)) {
    return null
  }

  const raw = fs.readFileSync(metaPath, 'utf-8')
  const meta: ChapterMeta = JSON.parse(raw)

  return {
    number: meta.number,
    slug: meta.slug,
    title: meta.title,
    topicCount: meta.topicCount,
    questionCount: meta.questionCount,
    topics: meta.topics,
  }
}
