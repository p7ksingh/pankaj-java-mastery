# Changelog

All changes to the v2 project are documented here. Read top to bottom to understand what was done and why.

## 2026-11-02 — Project Setup

### What was done
- Created folder structure (see FOLDER_STRUCTURE.md)
- Wrote architecture documentation (ARCHITECTURE.md)
- Wrote design decisions (DESIGN_DECISIONS.md)
- Wrote testing strategy (TESTING_STRATEGY.md)
- Created build plan with phases (BUILD_PLAN.md)
- Added Learn section plan (LEARN_SECTION.md) — 21 design patterns from course notes
- Updated architecture for two sections: Interview + Learn
- Updated URL structure: `/interview/...` and `/learn/...`
- Added data folders: `data/interview/` and `data/learn/design-patterns/`
- Added Learn-specific components: TutorialView, TutorialSection, PatternCard, CategoryGrid
- Added Learn-specific lib files: tutorials.ts, patterns.ts
- Added Learn-specific types: tutorial.ts, content.ts

### What was NOT done yet
- No code written
- No dependencies installed
- No Next.js initialized

### Next step
- Phase 1A: Initialize Next.js project, install dependencies, configure TypeScript/ESLint/Jest
- Phase 1B: Build type definitions from existing JSON data
- Phase 1C: Build base UI components (Button, Badge, Pill, etc.) with TDD

## 2026-11-02 — Session 2: Logo, Search, Code Blocks, UI Polish

### Bold J Logo
- Designed and implemented custom brand mark: distinctive J letterform with blinking red dot
- Logo component: `src/components/ui/Logo/Logo.tsx` — reusable, SVG, uses `currentColor` + red dot with CSS animation (opacity pulse + size throb)
- Applied to TopBar (34px), Footer (44px), and all favicons
- Favicon: F23 dark rounded square variant (`rx="16"`) for browser tabs + Google search
- Generated PNGs: 16/32/48/96/180/192/512px via sharp
- Created `public/site.webmanifest` for PWA support
- OpenGraph + Twitter meta tags for social sharing with 512px logo
- Removed old coffee cup emoji (`&#9749;`) from TopBar and Footer

### Search Redesign
- **Search bar**: left-side clean icon next to logo (like GFG/Medium), click to expand with animation
- **Expand animation**: smooth `36px → 280px` with opacity transition
- **Close**: X button collapses back to icon, click outside also collapses
- **Navigation**: Enter → `/search#query` (hash-based for static export compatibility)
- **Search page**: Medium-style "Results for **query**" heading, no separate search box — topbar IS the search
- **TopBar syncs** query from URL hash when on search page
- **Recent history**: last 5 searches saved in localStorage, dropdown on focus with clock icon + Clear button
- **Fuzzy search**: bigram similarity for typo tolerance (cuncurrent→concurrent, hasmap→HashMap)
- **"Did you mean"**: clickable spelling suggestion when fuzzy results found
- **Relevance ranking**: exact match (100) > starts-with (80) > ID match (75) > word boundary (60) > substring (40)
- Removed old inline search input, submit button, `onSearchChange`/`showSubmit` props from TopBar

### GFG Syntax Highlighting
- Added `highlightCode()` function in `AnswerSection.tsx` — regex-based tokenizer
- Java tokens: keywords (blue `#0000ff`), types (maroon `#800000`), strings (maroon), comments (green italic `#008000`), annotations (olive), numbers (blue)
- Also handles bash (comment highlighting), JSON (keys/values/literals), XML (tags/attributes), SQL (keywords/strings)
- Dark mode: tokens auto-switch to VS Code dark palette
- Copy button: changed from text "Copy" to circular SVG icon (two overlapping squares)

### Breadcrumb Redesign
- Glassmorphism removed, replaced with light gray pill boxes (`#f0f0f0`, `border: 1px solid #e0e0e0`)
- Home icon (SVG house) replaces "Home" text
- Bold text (`font-weight: 700`, current item `800`)
- Hover: no underline

### Key Concepts Refinement
- Heading: matches "Definition" style — `font-family: var(--font-family)`, `18px`, `weight 800`, `color: #1a1a1a`
- Removed square dot before "Key Concepts"
- No more uppercase — reads "Key Concepts" not "KEY CONCEPTS"

### Other UI Changes
- Removed community submit form from home page
- Merged duplicate imports (SearchResults, CommunityList)
- Logo + brand name both zoom on hover (`scale(1.05)`)
- Brand name: `18px`, `weight 800`, no underline on hover

### Files Created
- `src/components/ui/Logo/Logo.tsx` + `index.ts`
- `public/favicon.svg`, `icon.svg`, `site.webmanifest`
- `public/favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `favicon-96.png`
- `public/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`

### Files Modified
- `src/app/layout.tsx` — favicon metadata, OpenGraph, Twitter meta, removed old TopBar props
- `src/app/page.tsx` — removed SubmitForm + CommunityList
- `src/app/search/page.tsx` — static export, passes to SearchResults
- `src/components/layout/TopBar/TopBar.tsx` — new search icon expand, history, hash navigation
- `src/components/layout/TopBar/TopBar.module.css` — complete rewrite for new search UX
- `src/components/layout/TopBar/TopBar.test.tsx` — updated for new API
- `src/components/layout/Footer/Footer.tsx` — Logo component replaces emoji
- `src/components/layout/Footer/Footer.module.css` — SVG logo styles
- `src/components/layout/Breadcrumb/Breadcrumb.tsx` — home icon, pill boxes
- `src/components/layout/Breadcrumb/Breadcrumb.module.css` — complete restyling
- `src/components/features/AnswerSection/AnswerSection.tsx` — syntax highlighting + code highlighting
- `src/components/features/AnswerSection/AnswerSection.module.css` — syntax token CSS, circular copy button
- `src/components/features/AnswerSection/CodeBlockEnhancer.tsx` — SVG copy icon
- `src/components/features/SearchResults/SearchResults.tsx` — hash-based, no input, Medium heading
- `src/components/features/SearchResults/SearchResults.module.css` — heading, hint, suggestion styles
- `src/lib/data/search.ts` — fuzzy search, bigram similarity, relevance ranking, suggestion
- `src/lib/data/search.test.ts` — fuzzy + ranking tests added
- `src/app/interview/[chapter]/[topic]/[question]/page.tsx` — removed keyPointsDot
- `src/app/interview/[chapter]/[topic]/[question]/page.module.css` — Key Concepts heading, dot removal

### Test Status
- 172 tests pass (27 suites)
- Build clean, lint clean
- Static export: 2466 question pages + search + learn pages
