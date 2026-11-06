'use client'

import { useState, useRef, useCallback } from 'react'
import { TagPicker } from '@/components/ui/TagPicker'
import { validateSubmission, recordSubmission, MIN_LENGTH, MAX_LENGTH } from '@/lib/utils/spamGuard'
import { enqueue, flushQueue } from '@/lib/utils/submissionQueue'
import { addLocalQuestion } from '@/lib/utils/localCommunity'
import { COMMUNITY_TOPICS, COMMUNITY_COMPANIES } from '@/lib/constants/community'
import styles from './CommunityPage.module.css'

interface CommunityWriteSectionProps {
  onPostSuccess: (question: string, topic: string | null, company: string | null) => void
}

const TopicIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const CompanyIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

/**
 * Inline write section for the community page.
 * Includes textarea, topic/company pickers, char counter, and post button.
 * On post: enqueues to localStorage, flushes to API, and calls onPostSuccess.
 */
export function CommunityWriteSection({ onPostSuccess }: CommunityWriteSectionProps) {
  const [question, setQuestion] = useState('')
  const [topic, setTopic] = useState<string | null>(null)
  const [company, setCompany] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const charCount = question.trim().length
  const canSubmit = charCount >= MIN_LENGTH && charCount <= MAX_LENGTH

  const handlePost = useCallback(() => {
    const validation = validateSubmission(question, honeypot)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    enqueue(question)
    recordSubmission()
    flushQueue()
    addLocalQuestion(question.trim(), topic, company)

    onPostSuccess(question, topic, company)

    setQuestion('')
    setTopic(null)
    setCompany(null)
    setError(null)
  }, [question, honeypot, topic, company, onPostSuccess])

  return (
    <div className={styles.writeCard}>
      <div className={styles.writeTop}>
        <div className={styles.writeAvatar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <div className={styles.writeName}>Share your question</div>
          <div className={styles.writeNameSub}>Visible to the community after posting</div>
        </div>
      </div>

      <div className={styles.writeBody}>
        <textarea
          ref={textareaRef}
          className={styles.writeTextarea}
          placeholder="Share a real interview question you were asked..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={MAX_LENGTH}
        />
        {/* Honeypot */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        {(topic || company) && (
          <div className={styles.writeTags}>
            {topic && (
              <span className={styles.writeTagTopic}>
                {topic}
                <button type="button" className={styles.writeTagX} onClick={() => setTopic(null)} aria-label="Remove topic">&times;</button>
              </span>
            )}
            {company && (
              <span className={styles.writeTagCompany}>
                {company}
                <button type="button" className={styles.writeTagX} onClick={() => setCompany(null)} aria-label="Remove company">&times;</button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className={styles.writeFooter}>
        <div className={styles.writeFooterLeft}>
          <TagPicker
            label="Topic"
            icon={TopicIcon}
            options={COMMUNITY_TOPICS}
            value={topic}
            onChange={setTopic}
            placeholder="Search or type topic..."
          />
          <TagPicker
            label="Company"
            icon={CompanyIcon}
            options={COMMUNITY_COMPANIES}
            value={company}
            onChange={setCompany}
            placeholder="Search or type company..."
          />
        </div>
        <div className={styles.writeFooterRight}>
          {error && <span className={styles.writeError}>{error}</span>}
          <span className={styles.writeChar}>{charCount} / {MAX_LENGTH}</span>
          <button
            type="button"
            className={styles.writePost}
            disabled={!canSubmit}
            onClick={handlePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}
