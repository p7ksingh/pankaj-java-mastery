# Folder Structure

Every folder has a single responsibility. If you're unsure where something goes, read the "What goes here" column.

```
v2/
├── .docs/                      # 📖 Project documentation (you are here)
├── public/                     # 🖼️ Static assets served as-is
├── data/                       # 📊 Question JSON files (from v1)
├── src/
│   ├── app/                    # 📄 Pages (Next.js App Router)
│   ├── components/
│   │   ├── ui/                 # 🧱 Base UI components (Button, Badge, etc.)
│   │   ├── layout/             # 📐 Page layout components (TopBar, Footer, etc.)
│   │   ├── features/           # ⚙️ Feature components (ChapterTable, QuestionView, etc.)
│   │   └── seo/                # 🔍 SEO components (StructuredData, MetaTags)
│   ├── hooks/                  # 🪝 Custom React hooks
│   ├── lib/                    # 📚 Core logic (no React, no DOM)
│   │   ├── data/               # 📦 Data loading & transformation
│   │   ├── utils/              # 🔧 Pure utility functions
│   │   └── constants/          # 📋 App-wide constants
│   ├── styles/                 # 🎨 Global CSS
│   └── types/                  # 📝 TypeScript type definitions
├── __tests__/                  # 🧪 Integration & E2E tests
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config
├── jest.config.ts              # Jest config
├── package.json                # Dependencies
├── .eslintrc.json              # Lint rules
└── .prettierrc                 # Code formatting
```

## Detailed Breakdown

### `src/app/` — Pages
Next.js App Router. Each folder = a route. Each `page.tsx` = a page.

| File | URL | Renders |
|---|---|---|
| `app/page.tsx` | `/` | Home (chapter table) |
| `app/[chapter]/page.tsx` | `/core-java` | Chapter (topic list) |
| `app/[chapter]/[topic]/page.tsx` | `/core-java/collections` | Topic (question list) |
| `app/[chapter]/[topic]/[question]/page.tsx` | `/core-java/collections/hashmap-internal-working` | Single question |
| `app/search/page.tsx` | `/search?q=hashmap` | Search results |
| `app/layout.tsx` | — | Root layout (wraps all pages) |
| `app/not-found.tsx` | — | 404 page |

### `src/components/ui/` — Base Components
Small, reusable, no business logic. Each has its own folder:
```
Button/
├── Button.tsx           # Component
├── Button.module.css    # Scoped styles
├── Button.test.tsx      # Tests
└── index.ts             # Re-export
```

Components: `Button`, `Badge`, `Pill`, `ProgressBar`, `Card`, `SearchInput`, `CodeBlock`, `CopyButton`, `Checkbox`, `Dropdown`, `Skeleton`, `Tooltip`

### `src/components/layout/` — Layout Components
Page-level structure. Used in `app/layout.tsx`.

Components: `TopBar`, `Footer`, `Breadcrumb`, `PageHeader`, `Sidebar`

### `src/components/features/` — Feature Components
Compose ui + layout components with business logic.

Components: `ChapterTable`, `TopicTable`, `QuestionView`, `AnswerSection`, `SearchResults`, `SubmitForm`, `DarkModeToggle`, `BookmarkButton`, `NotesPanel`, `CommunityQuestions`, `ContinueWhereYouLeftOff`, `EmailPopup`, `ShareButtons`

### `src/hooks/` — Custom Hooks
Encapsulate stateful logic. Each hook = one responsibility.

| Hook | What it does |
|---|---|
| `useLocalStorage` | Read/write localStorage with SSR safety |
| `useDarkMode` | Toggle dark/light mode, persist preference |
| `useBookmarks` | Add/remove bookmarks, get bookmarked questions |
| `useProgress` | Track completed questions, calculate percentages |
| `useSearch` | Search questions by text, debounced |
| `useKeyboardShortcuts` | ⌘K for search, Escape to close |
| `useNotes` | Per-question notes, auto-save |

### `src/lib/` — Core Logic
Pure TypeScript. No React imports. No DOM access. Fully testable.

- `lib/data/chapters.ts` — Load all chapters, get by slug
- `lib/data/questions.ts` — Load questions, index by ID/slug, get related
- `lib/data/search.ts` — Build search index, fuzzy search
- `lib/utils/slug.ts` — Generate URL-safe slugs from titles
- `lib/utils/format.ts` — Format numbers, dates, reading time
- `lib/utils/validation.ts` — Validate form inputs
- `lib/constants/config.ts` — Site URL, API endpoints, GA ID
- `lib/constants/routes.ts` — Route patterns, builder functions
- `lib/constants/seo.ts` — Default meta tags, structured data templates

### `src/types/` — TypeScript Types
Shared type definitions. No runtime code.

- `chapter.ts` — Chapter, ChapterSummary
- `question.ts` — Question, QuestionSummary, AnswerSection
- `answer.ts` — Answer, Section types (Definition, Example, Code, etc.)
- `index.ts` — Re-exports all types

### `src/styles/` — Global CSS
CSS Variables from the current design system. No component styles here (those use CSS Modules).

- `globals.css` — Reset, base styles, CSS variables (--bg, --text, etc.)
- `theme.css` — Light mode and dark mode variable overrides
- `typography.css` — Font imports, heading/body scales

### `__tests__/` — Integration Tests
Tests that span multiple components or test page-level behavior.

- `__tests__/unit/` — Unit tests for lib/ functions
- `__tests__/integration/` — Component integration tests
- `__tests__/e2e/` — Playwright end-to-end tests

## Naming Conventions
| What | Convention | Example |
|---|---|---|
| Component files | PascalCase | `Button.tsx`, `ChapterTable.tsx` |
| Hook files | camelCase with `use` prefix | `useDarkMode.ts` |
| Lib files | camelCase | `chapters.ts`, `slug.ts` |
| CSS Modules | PascalCase matching component | `Button.module.css` |
| Test files | Same name + `.test` | `Button.test.tsx` |
| Type files | camelCase | `chapter.ts` |
| Constants | UPPER_SNAKE_CASE inside, camelCase file | `config.ts` → `SITE_URL` |
| Folders | camelCase for lib, PascalCase for components | `utils/`, `Button/` |
