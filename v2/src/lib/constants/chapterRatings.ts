/**
 * Interview frequency rating per chapter (1–5).
 * Indicates how often topics from each chapter appear in real interviews.
 * Consumed by ChapterTable (home) and ChapterSidebar (chapter detail).
 *
 * To add a new chapter, insert its number here.
 * Missing chapters default to DEFAULT_RATING.
 */

const DEFAULT_RATING = 3

const ratings: Readonly<Record<number, number>> = {
  1: 4,   // Core Java
  2: 3,   // OOP
  3: 5,   // Collections
  4: 4,   // Exception Handling
  5: 4,   // Concurrency & Multithreading
  6: 5,   // Streams, Lambda & Functional
  7: 3,   // Spring & Spring Boot
  8: 4,   // Transactions
  9: 4,   // JPA & Hibernate
  10: 5,  // Microservices
  11: 4,  // Kafka & Messaging
  12: 3,  // DevOps, CI/CD & Tooling
  13: 5,  // Database & SQL
  14: 4,  // REST API & Web
  15: 5,  // Design Patterns & LLD
  16: 3,  // Advanced Java
  17: 5,  // Coding Problems — DSA
  18: 4,  // AWS & Cloud
  20: 4,  // Data Engineering
  21: 3,  // QA, Testing & SDET
  23: 4,  // Behavioral / HR
  24: 5,  // System Design
  26: 3,  // Security
}

/** Returns the interview frequency rating for a chapter (1–5). */
export function getChapterRating(chapterNumber: number): number {
  return ratings[chapterNumber] ?? DEFAULT_RATING
}

/** Maximum star rating value. */
export const MAX_RATING = 5
