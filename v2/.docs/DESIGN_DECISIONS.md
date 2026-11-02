# Design Decisions

Every major decision is recorded here with the reasoning. If you disagree with one, change it here first, then in code.

## DD-001: Next.js with Static Site Generation (SSG)
**Decision:** Use Next.js App Router with `output: 'export'` to generate static HTML.
**Alternatives considered:** Angular (too heavy for content), Gatsby (declining ecosystem), Astro (smaller ecosystem), vanilla JS (current, no SEO).
**Reason:** SSG pre-builds every page as HTML. Google indexes them. S3 serves them. No server needed. React hydrates for interactivity. Same hosting cost as v1.

## DD-002: CSS Modules, not Tailwind
**Decision:** Use CSS Modules for component styles and CSS Variables for theming.
**Alternatives considered:** Tailwind CSS, styled-components, Emotion.
**Reason:** The existing design system uses CSS variables and specific class names. CSS Modules let us keep the same visual design with scoped styles and no runtime cost. Tailwind would require rewriting every style.

## DD-003: TypeScript strict mode
**Decision:** Enable strict mode in tsconfig.json.
**Reason:** Catches null/undefined errors at compile time. The data layer (JSON parsing) benefits most — we know the shape of every answer before runtime.

## DD-004: No state management library
**Decision:** Use React hooks (useState, useContext) and custom hooks only.
**Alternatives considered:** Redux, Zustand, Jotai.
**Reason:** All state is local (dark mode, bookmarks, notes, progress). None of it is shared between unrelated components in a way that requires a global store. Custom hooks are simpler and have zero bundle cost.

## DD-005: Component folder structure
**Decision:** Each component gets its own folder with .tsx, .module.css, .test.tsx, and index.ts.
**Alternatives considered:** Flat files, grouped by page.
**Reason:** Co-location. Everything related to a component is in one place. Easy to find, easy to delete, easy to test. index.ts re-exports for clean imports.

## DD-006: Data stays as JSON files
**Decision:** Keep the existing ch01.json–ch28.json files. Import them at build time.
**Alternatives considered:** Database (PostgreSQL), CMS (Contentful, Sanity), MDX files.
**Reason:** The data is static and changes rarely. JSON files are simple, version-controlled, and require no external service. When we add an admin panel (Phase 3), we'll move to a database. For now, JSON is enough.

## DD-007: URL slug strategy
**Decision:** Generate slugs from chapter titles and question short titles. Format: `/core-java/collections/hashmap-internal-working`.
**Reason:** Readable URLs rank better in Google. They also tell the user where they are. Slugs are generated at build time from the data, stored in a lookup map, and never change (to avoid broken links).

## DD-008: Testing strategy
**Decision:** TDD for lib/ and components. Write test first, then code.
- **Unit tests** (Jest): lib/ functions, utility functions, hooks
- **Component tests** (React Testing Library): render, user interaction, accessibility
- **E2E tests** (Playwright): critical paths (navigate to question, search, dark mode)
**Reason:** The site has 2,500+ pages generated from data. A bug in the data layer or rendering affects thousands of pages. Tests catch this before deploy.

## DD-009: No client-side routing for initial load
**Decision:** Every page is a full HTML page. Navigation between pages uses Next.js Link (client-side after first load).
**Reason:** Google gets full HTML on first crawl. Users get instant navigation after. Best of both worlds.

## DD-010: Progressive enhancement
**Decision:** Pages render fully without JavaScript. JS adds: dark mode, bookmarks, notes, progress, keyboard shortcuts.
**Reason:** Google's crawler may not execute all JS. Users on slow connections see content immediately. Accessibility: screen readers get full content.
