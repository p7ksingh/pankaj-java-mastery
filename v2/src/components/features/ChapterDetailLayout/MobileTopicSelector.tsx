'use client'

import styles from './ChapterDetailLayout.module.css'

interface MobileTopicSelectorProps {
  chapterSlug: string
  topics: Array<{ slug: string; index: number; title: string; questionCount: number }>
  activeTopicSlug: string
}

/** Mobile-only topic dropdown — replaces sidebar on small screens. */
export function MobileTopicSelector({ chapterSlug, topics, activeTopicSlug }: MobileTopicSelectorProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    window.location.href = `/interview/${chapterSlug}/${e.target.value}/`
  }

  return (
    <div className={styles.mobileSelect}>
      <select
        className={styles.mobileSelectInput}
        defaultValue={activeTopicSlug}
        aria-label="Select topic"
        onChange={handleChange}
      >
        {topics.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.index + 1}. {t.title} ({t.questionCount})
          </option>
        ))}
      </select>
    </div>
  )
}
