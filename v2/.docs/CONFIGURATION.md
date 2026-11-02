# Configuration Guide

## Zero Hardcoding Policy
Every value that could change between environments, features, or deployments is configurable. No magic numbers, no inline URLs, no hardcoded strings in components.

## Configuration Sources (in priority order)
1. **Environment variables** — `.env.local`, `.env.production` (secrets, API keys)
2. **Config file** — `src/lib/config/app.config.ts` (site settings, feature flags)
3. **Data files** — `data/` folder (content)
4. **Defaults** — Fallback values in config types

## Environment Variables (.env)

```bash
# .env.local (development - not committed)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DATA_SOURCE=static
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_API_BASE_URL=

# .env.production (production)
NEXT_PUBLIC_SITE_URL=https://www.javabypankaj.live
NEXT_PUBLIC_DATA_SOURCE=static
NEXT_PUBLIC_GA_ID=G-4ZCZWRPXHW
NEXT_PUBLIC_API_BASE_URL=https://ebiskwsxj4.execute-api.ap-southeast-2.amazonaws.com

# .env.api (Phase 3 - when Spring Boot is ready)
NEXT_PUBLIC_DATA_SOURCE=api
NEXT_PUBLIC_API_BASE_URL=https://api.javabypankaj.live/api/v1
NEXT_PUBLIC_API_TIMEOUT=5000
NEXT_PUBLIC_API_RETRIES=3

# Server-only (not exposed to browser)
SUBSCRIBE_API_KEY=xxx
GITHUB_TOKEN=xxx
```

## App Config (app.config.ts)

```typescript
// src/lib/config/app.config.ts
// This is the SINGLE SOURCE OF TRUTH for all app settings.
// Components never hardcode values — they read from this config.

import { AppConfig } from './types'

const config: AppConfig = {
  site: {
    name: 'javabypankaj',
    tagline: 'Crack Any Java Interview',
    separator: '|',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.javabypankaj.live',
    description: '3000+ real Java interview questions and answers...',
    author: 'Pankaj Singh',
    email: 'p7ksingh@gmail.com',
    social: {
      linkedin: 'https://www.linkedin.com/in/p7ksingh/',
      github: 'https://github.com/p7ksingh',
      instagram: '@p7ksingh',
    },
  },

  dataSource: {
    type: (process.env.NEXT_PUBLIC_DATA_SOURCE as 'static' | 'api') || 'static',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 5000,
    apiRetries: Number(process.env.NEXT_PUBLIC_API_RETRIES) || 3,
  },

  features: {
    darkMode: true,
    bookmarks: true,
    notes: true,
    progress: true,
    search: true,
    submitQuestion: true,
    communityQuestions: true,
    emailPopup: true,
    shareButtons: true,
    keyboardShortcuts: true,
    analytics: true,
    learnSection: false,    // Set true when Phase 4 is ready
  },

  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
    enabled: !!process.env.NEXT_PUBLIC_GA_ID,
  },

  api: {
    subscribe: `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribe`,
    questions: `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions`,
  },

  seo: {
    titleSuffix: ' | javabypankaj',
    defaultOgImage: '/share-preview.png',
    twitterHandle: '@p7ksingh',
  },

  rateLimit: {
    searchDebounceMs: 300,
    submitCooldownMs: 30_000,
    maxSubmitsPerHour: 5,
  },

  ui: {
    questionsPerPage: 50,
    searchResultsLimit: 100,
    emailPopupDelayMs: 30_000,
    animationsEnabled: true,
  },
}

export default config
```

## Feature Flags

Every feature can be toggled off. When off, the component renders nothing and the hook returns a no-op.

```typescript
// Usage in components:
function SubmitButton() {
  const { features } = useConfig()
  if (!features.submitQuestion) return null  // Feature off → nothing rendered
  return <button>💡 Submit</button>
}

// Usage in hooks:
function useBookmarks() {
  const { features } = useConfig()
  if (!features.bookmarks) return NO_OP_BOOKMARKS  // Feature off → no-op
  // ... actual implementation
}
```

## UI Strings (No hardcoded text in components)

```typescript
// src/lib/constants/strings.ts

export const STRINGS = {
  nav: {
    home: '🏠 Home',
    search: 'Search questions...',
    submit: '💡 Submit Yours Interview Question',
    darkMode: '🌙',
    lightMode: '☀️',
  },
  home: {
    title: 'Interview Topics',
    questionsLabel: 'Questions',
    chaptersLabel: 'Chapters',
    continueTitle: 'CONTINUE WHERE YOU LEFT OFF',
  },
  question: {
    markCompleted: 'Mark as completed',
    prevTopic: '← Prev Topic',
    nextTopic: 'Next Topic →',
    copyCode: '📋 Copy',
    copied: '✓ Copied!',
  },
  submit: {
    title: '💡 Share Your Interview Question',
    description: 'Faced a question in your interview? Share it here...',
    placeholder: 'Write the question you were asked...',
    button: 'Submit Question →',
    success: 'Submitted! Thank you.',
    tooShort: 'Question too short (min 10 characters)',
    rateLimited: 'Please wait before submitting again',
  },
  errors: {
    notFound: 'Page not found',
    loadFailed: 'Failed to load content. Please try again.',
    networkError: 'Network error. Check your connection.',
  },
  // Add i18n here in future (Hindi, etc.)
} as const
```

## CSS Variables (Theme — no hardcoded colours)

```css
/* src/styles/theme.css */
/* Every colour, size, font used in the app comes from here. */
/* Components use var(--name), never a raw hex value. */

:root {
  /* Colours */
  --color-bg: #f0f2f5;
  --color-surface: #ffffff;
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  --color-brand: #FF0000;
  --color-brand-gradient: linear-gradient(135deg, #FF0000, #ff6b6b);
  --color-link: #4A90D9;
  --color-success: #27ae60;
  --color-warning: #e67e22;
  --color-error: #e74c3c;
  --color-border: #e0e0e0;
  --color-hover: #f7f9fc;
  --color-topbar: #2d3748;
  --color-footer: #1a2332;

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Menlo', 'Consolas', monospace;
  --font-size-base: 14px;
  --font-size-sm: 12px;
  --font-size-lg: 16px;
  --font-size-xl: 22px;
  --font-size-2xl: 28px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 25px;
  --radius-full: 50%;

  /* Shadows */
  --shadow-card: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-hover: 0 4px 12px rgba(0,0,0,0.12);

  /* Sizes */
  --topbar-height: 56px;
  --max-width: 1200px;
  --sidebar-width: 300px;
}

/* Dark mode overrides — only change colours, not spacing or typography */
body.dark {
  --color-bg: #121212;
  --color-surface: #1e1e1e;
  --color-text-primary: #d4d4d4;
  --color-text-secondary: #aaaaaa;
  --color-text-muted: #777777;
  --color-border: #2a2a2a;
  --color-hover: #2a2a2a;
  --color-topbar: #1a1a1a;
  --color-footer: #0d0d0d;
  --shadow-card: 0 2px 8px rgba(0,0,0,0.3);
}
```

## Changing Anything

| Want to change... | Edit this file | No other changes needed |
|---|---|---|
| Site name | `app.config.ts` → `site.name` | ✓ |
| Colours | `theme.css` → CSS variables | ✓ |
| GA tracking ID | `.env.production` → `NEXT_PUBLIC_GA_ID` | ✓ |
| Switch to Spring Boot API | `.env` → `NEXT_PUBLIC_DATA_SOURCE=api` | ✓ |
| Disable a feature | `app.config.ts` → `features.xxx = false` | ✓ |
| Add a new section type | `AnswerSection/registry.ts` → add entry | ✓ |
| Change rate limits | `app.config.ts` → `rateLimit.xxx` | ✓ |
| UI text/labels | `strings.ts` | ✓ |
| Add a language | `strings.ts` → add locale | Components unchanged |
