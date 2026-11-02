# Build Plan

## Approach
Build one layer at a time, bottom up. Test each layer before moving to the next.

```
Phase 1: Foundation
  1A: Project setup (Next.js, TS, ESLint, Jest)
  1B: Types + Data layer (load JSON, build indexes)
  1C: Base UI components (Button, Badge, Pill, etc.)
  1D: Layout components (TopBar, Footer, Breadcrumb)
  1E: Styles (migrate CSS variables, theme, typography)

Phase 2: Pages
  2A: Home page (chapter table)
  2B: Chapter page (topic table)
  2C: Topic page (question list)
  2D: Question page (answer with all SKILL sections)
  2E: Search page

Phase 3: Features
  3A: Dark mode (toggle, persist in localStorage)
  3B: Bookmarks (save questions, heart icon)
  3C: Progress tracking (mark completed, progress bars)
  3D: Community (submit question + view submitted questions)
  3E: Keyboard shortcuts (Cmd+K search, Escape close)
  3F: Copy answer (one-click copy full answer text)
  3G: Share question URL (share button per question)
  3H: Spaced repetition (review later, 1/3/7 day schedule)

Phase 4: Learn Section
  4A: Learn data types and loader (tutorial.ts, patterns.ts)
  4B: Convert Design_Patterns_Reference.html to JSON data files
  4C: Write proper SKILL-format content with code examples for each pattern
  4D: TutorialView and TutorialSection components
  4E: Learn home page, category page, pattern page
  4F: Add design patterns to search index and sitemap

Phase 5: SEO
  5A: Unique title/description per page
  5B: Structured data (WebSite, FAQPage, BreadcrumbList, Course)
  5C: Sitemap generation (3786+ URLs)
  5D: robots.txt
  5E: OG image per page (or shared)
  5F: Canonical URLs

Phase 6: Quality
  6A: Lighthouse audit (target 95+)
  6B: Accessibility audit (WCAG 2.1 AA)
  6C: Mobile testing (390px, 360px, 414px)
  6D: Cross-browser testing
  6E: E2E tests with Playwright
  6F: Performance optimization (lazy loading, code splitting)

Phase 7: Deploy
  7A: GitHub Actions build workflow
  7B: S3 + CloudFront deploy
  7C: DNS cutover (www.javabypankaj.live to v2)
  7D: Redirect old hash URLs to new clean URLs
  7E: Submit new sitemap to Google Search Console
```

## Current Status
- [x] Phase 0: Documentation and folder structure
- [x] Phase 1A: Project setup (Next.js 15, TypeScript 5.7, ESLint, Jest, Prettier)
- [x] Phase 1B: Types, slug utility (10 tests), data split (2506 Qs into 1261 topics)
- [x] Phase 1C: Button, Badge, Pill, ProgressBar, Card (32 tests)
- [x] Phase 1D: TopBar, Breadcrumb, Footer (19 tests)
- [x] Phase 1E: Theme (45 tokens), globals reset, typography, Inter font
- [x] Phase 2A: Home page, ChapterTable, data loader (16 tests)
- [x] Phase 2B: Chapter page, TopicTable, 28 static pages (6 tests)
- [x] Phase 2C: Topic page, question data loader, 1261 static pages (16 tests)
- [x] Phase 2D: Question page, AnswerSection, 2495 static pages (9 tests)
- [x] Phase 2E: Search page, search index (461 KB), client-side filter (7 tests)
- [ ] Phase 3A: Dark mode <-- NEXT

## How we work
1. Pick the next unchecked item
2. Write tests for it
3. Write code to pass the tests
4. Test locally, verify it works
5. Break it intentionally, test edge cases
6. Fix what broke, add tests
7. Review code, clean up
8. Update this file and CHANGELOG.md
9. Commit to dev with a clear message
10. Move to the next item

## Rules
- One feature at a time
- Tests before code
- Break and test before commit
- No emoji in code
- No hardcoded values
- Commit after each sub-phase
- Never skip the break-and-test step
