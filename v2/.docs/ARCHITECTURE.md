# javabypankaj v2 — Architecture

## Overview
A Next.js (React) static site that pre-generates 2,500+ individual HTML pages from JSON data at build time. Every question, topic, and chapter gets its own URL that Google can index.

## Tech Stack
| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG, file-based routing, React Server Components |
| Language | TypeScript | Type safety, better DX, catch errors at compile time |
| Styling | CSS Modules + CSS Variables | Keep existing design system, scoped styles, no extra dependencies |
| Testing | Jest + React Testing Library | Industry standard, fast unit tests |
| E2E Testing | Playwright | Real browser testing for critical flows |
| Linting | ESLint + Prettier | Consistent code style |
| Hosting | AWS S3 + CloudFront | Same as v1, near-zero cost, `next export` generates static files |
| CI/CD | GitHub Actions | Same as v1, builds and deploys on push to main |
| Analytics | Google Analytics (G-4ZCZWRPXHW) | Same as v1 |

## Architecture Diagram
```
┌─────────────────────────────────────────────────┐
│                    BUILD TIME                     │
│                                                   │
│  data/*.json ──→ lib/data/ ──→ Next.js SSG        │
│                      │           │                │
│                      ▼           ▼                │
│              TypeScript     2,500+ HTML pages     │
│              Type Safety    (one per question)    │
│                                                   │
└──────────────────────┬──────────────────────────┘
                       │ next export
                       ▼
┌─────────────────────────────────────────────────┐
│                   RUNTIME                         │
│                                                   │
│  S3 Bucket ──→ CloudFront CDN ──→ Browser         │
│  (static HTML)   (edge cache)    (hydrates React) │
│                                                   │
│  Browser Features (client-side only):             │
│  • Dark mode toggle (localStorage)                │
│  • Bookmarks (localStorage)                       │
│  • Notes (localStorage)                           │
│  • Progress tracking (localStorage)               │
│  • Search (client-side, instant)                  │
│  • ⌘K keyboard shortcut                          │
│                                                   │
│  AWS Lambda (existing):                           │
│  • POST /subscribe (email collection)             │
│  • POST /questions (submit question)              │
│  • GET /questions (community questions)            │
└─────────────────────────────────────────────────┘
```

## Design Principles
1. **Static First** — Every page is pre-built HTML. No server needed at runtime.
2. **Progressive Enhancement** — Pages work without JS. JS adds interactivity (dark mode, bookmarks, notes).
3. **SOLID** — Single Responsibility per component/hook. Open for extension (new answer sections, new features) without modifying existing code.
4. **Composition over Inheritance** — Small, composable React components. No deep hierarchies.
5. **Separation of Concerns** — Data loading (lib/data), presentation (components), state (hooks), styling (CSS Modules) are separate.
6. **Test-Driven** — Write test first, then component. Every component has a .test.tsx file.
7. **Zero Runtime Dependencies** — No state management library, no CSS-in-JS runtime. Only React, Next.js, and our code.

## Data Flow
```
JSON files (data/ch01.json ... ch28.json)
    │
    ▼ (imported at build time)
lib/data/chapters.ts — loads, validates, transforms
lib/data/questions.ts — indexes by slug, chapter, topic
    │
    ▼ (passed as props)
app/[chapter]/[topic]/[question]/page.tsx
    │
    ▼ (renders)
components/features/QuestionView — the answer card
components/features/AnswerSection — each SKILL section
components/ui/* — buttons, pills, badges, code blocks
```

## URL Structure (SEO)
| Route | Example | Page |
|---|---|---|
| `/` | `/` | Home — chapter table |
| `/[chapter]` | `/core-java` | Chapter — topic list |
| `/[chapter]/[topic]` | `/core-java/collections` | Topic — question list |
| `/[chapter]/[topic]/[question]` | `/core-java/collections/hashmap-internal-working` | Question — full answer |
| `/search?q=hashmap` | `/search?q=hashmap` | Search results |
| `/sitemap.xml` | | Auto-generated |

## Performance Targets
- Lighthouse: 95+ on all metrics
- First Contentful Paint: < 1s
- Total page size: < 100KB (HTML + CSS, before images)
- Time to Interactive: < 2s on 3G
