# Build Plan

## Approach
Build one layer at a time, bottom up. Test each layer before moving to the next.

```
Phase 1: Foundation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1A: Project setup (Next.js, TS, ESLint, Jest)
  1B: Types + Data layer (load JSON, build indexes)
  1C: Base UI components (Button, Badge, Pill, etc.)
  1D: Layout components (TopBar, Footer, Breadcrumb)
  1E: Styles (migrate CSS variables, theme, typography)

Phase 2: Pages ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  2A: Home page (chapter table)
  2B: Chapter page (topic table)
  2C: Topic page (question list)
  2D: Question page (answer with all SKILL sections)
  2E: Search page

Phase 3: Features ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  3A: Dark mode
  3B: Bookmarks
  3C: Notes
  3D: Progress tracking
  3E: Submit question form
  3F: Community questions
  3G: Email popup
  3H: Share buttons
  3I: Keyboard shortcuts (⌘K)

Phase 4: Learn Section ━━━━━━━━━━━━━━━━━━━━━━━━━
  4A: Learn data types and loader (tutorial.ts, patterns.ts)
  4B: Convert Design_Patterns_Reference.html → JSON data files
  4C: Write proper SKILL-format content with code examples for each pattern
  4D: TutorialView and TutorialSection components
  4E: Learn home page, category page, pattern page
  4F: Add design patterns to search index and sitemap

Phase 5: SEO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  5A: Unique title/description per page
  5B: Structured data (WebSite, FAQPage, BreadcrumbList, Course)
  5C: Sitemap generation (2,500+ interview + 21 learn URLs)
  5D: robots.txt
  5E: OG image per page (or shared)
  5F: Canonical URLs

Phase 6: Quality ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  5A: Lighthouse audit (target 95+)
  5B: Accessibility audit (WCAG 2.1 AA)
  5C: Mobile testing (390px, 360px, 414px)
  5D: Cross-browser testing
  5E: E2E tests with Playwright
  5F: Performance optimization (lazy loading, code splitting)

Phase 6: Deploy ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  6A: GitHub Actions build workflow
  6B: S3 + CloudFront deploy
  6C: DNS cutover (www.javabypankaj.live → v2)
  6D: Redirect old hash URLs to new clean URLs
  6E: Submit new sitemap to Google Search Console
```

## Current Status
- [x] Phase 0: Documentation and folder structure
- [ ] Phase 1A: Project setup ← NEXT

## How we work
1. Pick the next unchecked item
2. Write tests for it
3. Write code to pass the tests
4. Review the output visually (screenshot if UI)
5. Commit to `dev` with a clear message
6. Update this file (check the box, add notes)
7. Move to the next item

## Rules
- One phase at a time
- Tests before code
- Commit after each sub-phase
- Don't skip ahead
- Don't optimize prematurely
- Keep the existing v1 site running (it's in the repo root, v2 is in v2/)
