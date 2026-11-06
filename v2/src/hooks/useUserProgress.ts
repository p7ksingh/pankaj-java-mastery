'use client'

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

/* ── Storage keys ── */
const COMPLETED_KEY = 'javabypankaj.completed'
const LIKES_KEY = 'javabypankaj.likes'

/* ── Types ── */

/** Set of completed question IDs. */
type CompletedSet = string[]

/** Set of liked question IDs. */
type LikedSet = string[]

export interface TopicProgress {
  completed: number
  total: number
  percentage: number
  isComplete: boolean
  /** Number of liked questions in this topic. */
  likeCount: number
}

export interface ChapterProgress {
  completedQuestions: number
  totalQuestions: number
  percentage: number
  isComplete: boolean
  completedTopics: number
  totalTopics: number
  /** Total likes across all topics in this chapter. */
  likeCount: number
}

export interface UseUserProgressReturn {
  /* ── Question-level ── */
  markComplete: (questionId: string) => void
  markIncomplete: (questionId: string) => void
  toggleComplete: (questionId: string) => void
  isComplete: (questionId: string) => boolean

  /* ── Topic-level (computed, read-only) ── */
  getTopicProgress: (questionIds: string[]) => TopicProgress

  /* ── Chapter-level (computed, read-only) ── */
  getChapterProgress: (topics: Array<{ questionIds: string[] }>) => ChapterProgress
}

/**
 * Manages user completion and like state for questions.
 * Topic and chapter progress are computed from question data.
 *
 * Rules:
 * - Users can complete and like QUESTIONS.
 * - Topic completes when ALL its questions are complete.
 * - Chapter completes when ALL its topics are complete.
 * - Like count aggregates up from question to topic to chapter.
 *
 * Persisted in localStorage. SSR-safe (returns defaults until mount).
 */
export function useUserProgress(): UseUserProgressReturn {
  const [completed, setCompleted] = useLocalStorage<CompletedSet>(COMPLETED_KEY, [])
  const [liked] = useLocalStorage<LikedSet>(LIKES_KEY, [])

  /* ── Question-level ── */

  const markComplete = useCallback(
    (questionId: string) => {
      if (!completed.includes(questionId)) {
        setCompleted([...completed, questionId])
      }
    },
    [completed, setCompleted],
  )

  const markIncomplete = useCallback(
    (questionId: string) => {
      setCompleted(completed.filter((id) => id !== questionId))
    },
    [completed, setCompleted],
  )

  const toggleComplete = useCallback(
    (questionId: string) => {
      if (completed.includes(questionId)) {
        setCompleted(completed.filter((id) => id !== questionId))
      } else {
        setCompleted([...completed, questionId])
      }
    },
    [completed, setCompleted],
  )

  const isComplete = useCallback(
    (questionId: string): boolean => {
      return completed.includes(questionId)
    },
    [completed],
  )

  /* ── Topic-level (computed) ── */

  const getTopicProgress = useCallback(
    (questionIds: string[]): TopicProgress => {
      if (questionIds.length === 0) {
        return { completed: 0, total: 0, percentage: 0, isComplete: false, likeCount: 0 }
      }

      const done = questionIds.filter((id) => completed.includes(id)).length
      const total = questionIds.length
      const percentage = Math.round((done / total) * 100)
      const isTopicComplete = done === total
      const likeCount = questionIds.filter((id) => liked.includes(id)).length

      return { completed: done, total, percentage, isComplete: isTopicComplete, likeCount }
    },
    [completed, liked],
  )

  /* ── Chapter-level (computed) ── */

  const getChapterProgress = useCallback(
    (topics: Array<{ questionIds: string[] }>): ChapterProgress => {
      if (topics.length === 0) {
        return {
          completedQuestions: 0,
          totalQuestions: 0,
          percentage: 0,
          isComplete: false,
          completedTopics: 0,
          totalTopics: 0,
          likeCount: 0,
        }
      }

      let totalQ = 0
      let doneQ = 0
      let doneTopics = 0
      let totalLikes = 0

      for (const topic of topics) {
        const tp = getTopicProgress(topic.questionIds)
        totalQ += tp.total
        doneQ += tp.completed
        totalLikes += tp.likeCount
        if (tp.isComplete) {
          doneTopics++
        }
      }

      const percentage = totalQ > 0 ? Math.round((doneQ / totalQ) * 100) : 0
      const isChapterComplete = doneTopics === topics.length && topics.length > 0

      return {
        completedQuestions: doneQ,
        totalQuestions: totalQ,
        percentage,
        isComplete: isChapterComplete,
        completedTopics: doneTopics,
        totalTopics: topics.length,
        likeCount: totalLikes,
      }
    },
    [getTopicProgress],
  )

  return useMemo(
    () => ({
      markComplete,
      markIncomplete,
      toggleComplete,
      isComplete,
      getTopicProgress,
      getChapterProgress,
    }),
    [
      markComplete,
      markIncomplete,
      toggleComplete,
      isComplete,
      getTopicProgress,
      getChapterProgress,
    ],
  )
}
