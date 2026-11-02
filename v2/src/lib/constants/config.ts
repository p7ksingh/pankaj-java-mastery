/** Application configuration. Single source of truth for all configurable values. */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export const APP_CONFIG = {
  site: {
    name: 'javabypankaj',
    tagline: 'One platform. Every interview. Your entire career.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.javabypankaj.live',
  },
  api: {
    questions: `${API_BASE}/questions`,
    subscribe: `${API_BASE}/subscribe`,
  },
  rateLimit: {
    submitCooldownMs: 30_000,
    maxSubmitsPerHour: 5,
  },
} as const
