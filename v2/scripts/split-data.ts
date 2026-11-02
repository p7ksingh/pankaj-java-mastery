/**
 * Splits monolithic chapter JSON files into per-topic, per-question files.
 *
 * Input:  ../../data/ch01.json ... ch28.json, chapters_grouped.json
 * Output: data/interview/chapters.json
 *         data/interview/ch01/meta.json
 *         data/interview/ch01/topics/difference-between-jdk-jre-jvm/Q1.json
 *         ...
 *
 * Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/split-data.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const V1_DATA = path.resolve(__dirname, '../../data')
const OUT_DIR = path.resolve(__dirname, '../data/interview')

interface V1Answer {
  id: string
  qnum: number | string
  question: string
  shortTitle: string
  chapter: number | string
  chapterTitle: string
  sections: Record<string, Record<string, string>>
}

interface V1Topic {
  title: string
  count: number
  firstId: string
  ids: string[]
}

interface V1GroupedChapter {
  chapter: number
  chapterTitle: string
  count: number
  file: string
  topics: V1Topic[]
}

function generateSlug(title: string): string {
  if (!title) {
    return ''
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
}

function run(): void {
  const groupedPath = path.join(V1_DATA, 'chapters_grouped.json')
  const grouped = JSON.parse(fs.readFileSync(groupedPath, 'utf-8'))
  const groupedChapters: V1GroupedChapter[] = grouped.chapters

  const chapterSummaries: Array<{
    number: number
    slug: string
    title: string
    topicCount: number
    questionCount: number
  }> = []

  let totalQuestions = 0
  let totalTopicFolders = 0

  for (const gc of groupedChapters) {
    const chNum = gc.chapter
    const chPad = String(chNum).padStart(2, '0')
    const chFile = path.join(V1_DATA, `ch${chPad}.json`)

    if (!fs.existsSync(chFile)) {
      console.error(`Missing: ${chFile}`)
      continue
    }

    const chData = JSON.parse(fs.readFileSync(chFile, 'utf-8'))
    const chSlug = generateSlug(chData.chapterTitle)
    const chDir = path.join(OUT_DIR, `ch${chPad}`)

    // Build answer lookup by ID for fast access
    const answerMap = new Map<string, V1Answer>()
    for (const a of chData.answers) {
      answerMap.set(a.id, a)
    }

    // Build topics with slugs, appending index on collision
    const slugCount = new Map<string, number>()
    const topics = gc.topics.map((t: V1Topic, i: number) => {
      let topicSlug = generateSlug(t.title)
      const count = slugCount.get(topicSlug) || 0
      if (count > 0) {
        topicSlug = `${topicSlug}-${i}`
      }
      slugCount.set(topicSlug, count + 1)
      return {
        index: i,
        slug: topicSlug,
        title: t.title,
        questionCount: t.count,
        questionIds: t.ids,
      }
    })

    // Write chapter meta
    ensureDir(chDir)
    writeJson(path.join(chDir, 'meta.json'), {
      number: chNum,
      slug: chSlug,
      title: chData.chapterTitle,
      topicCount: topics.length,
      questionCount: chData.count,
      topics: topics.map((t: { index: number; slug: string; title: string; questionCount: number }) => ({
        index: t.index,
        slug: t.slug,
        title: t.title,
        questionCount: t.questionCount,
      })),
    })

    // Write questions grouped by topic
    let chQuestionCount = 0

    for (const topic of topics) {
      const topicDir = path.join(chDir, 'topics', topic.slug)
      ensureDir(topicDir)
      totalTopicFolders++

      for (const qId of topic.questionIds) {
        const answer = answerMap.get(qId)
        if (!answer) {
          console.error(`  Missing answer ${qId} in ch${chPad}`)
          continue
        }

        const qNum = typeof answer.qnum === 'string' ? parseInt(answer.qnum, 10) : answer.qnum

        const questionData = {
          id: answer.id,
          slug: generateSlug(answer.shortTitle || answer.question),
          questionNumber: qNum,
          title: answer.question,
          shortTitle: answer.shortTitle || answer.question,
          chapterNumber: chNum,
          chapterSlug: chSlug,
          chapterTitle: chData.chapterTitle,
          topicIndex: topic.index,
          topicSlug: topic.slug,
          topicTitle: topic.title,
          sections: answer.sections,
        }

        writeJson(path.join(topicDir, `${answer.id}.json`), questionData)
        chQuestionCount++
        totalQuestions++
      }
    }

    chapterSummaries.push({
      number: chNum,
      slug: chSlug,
      title: chData.chapterTitle,
      topicCount: topics.length,
      questionCount: chQuestionCount,
    })

    console.log(`  ch${chPad}: ${chData.chapterTitle} (${chQuestionCount} Qs, ${topics.length} topics)`)
  }

  // Write chapters summary
  writeJson(path.join(OUT_DIR, 'chapters.json'), {
    totalQuestions: totalQuestions,
    totalChapters: chapterSummaries.length,
    chapters: chapterSummaries,
  })

  console.log(`\nDone: ${totalQuestions} questions, ${chapterSummaries.length} chapters, ${totalTopicFolders} topic folders.`)
}

run()
