# Low Level Design (LLD)

## 1. Design Principles Applied

| Principle | How We Apply It |
|---|---|
| **S** — Single Responsibility | Each component/hook/function does ONE thing. `Button` renders a button. `useDarkMode` manages dark mode. `slug.ts` generates slugs. |
| **O** — Open/Closed | Components accept props for extension. `AnswerSection` renders any section type via a registry. Adding a new section type doesn't change existing code. |
| **L** — Liskov Substitution | `JSONFileRepo` and `SpringBootAPIRepo` both implement `IContentRepository`. Swap one for the other — the app works the same. |
| **I** — Interface Segregation | `IChapterRepository`, `IQuestionRepository`, `ITutorialRepository` are separate. A component that needs chapters doesn't depend on question methods. |
| **D** — Dependency Inversion | Components depend on interfaces (`IContentRepository`), not implementations (`JSONFileRepo`). The factory injects the correct implementation based on config. |
| **DRY** | Shared utilities in `lib/utils/`. Shared types in `types/`. Shared components in `ui/`. No copy-paste. |
| **KISS** | No unnecessary abstraction. A simple component stays simple. Only abstract when there's a real second use case. |
| **YAGNI** | Don't build what we don't need yet. Spring Boot adapter interface is defined but not implemented until Phase 3. |

## 2. Core Interfaces (TypeScript)

### 2.1 Configuration Interface
```typescript
// lib/config/types.ts

interface AppConfig {
  // Site
  site: {
    name: string              // "javabypankaj"
    tagline: string           // "Crack Any Java Interview"
    url: string               // "https://www.javabypankaj.live"
    description: string
    author: string
    email: string
  }

  // Data source
  dataSource: {
    type: 'static' | 'api'   // 'static' = JSON files, 'api' = Spring Boot
    apiBaseUrl?: string       // "https://api.javabypankaj.live/api/v1"
    apiTimeout?: number       // 5000ms
    apiRetries?: number       // 3
  }

  // Features (toggle on/off)
  features: {
    darkMode: boolean
    bookmarks: boolean
    notes: boolean
    progress: boolean
    search: boolean
    submitQuestion: boolean
    communityQuestions: boolean
    emailPopup: boolean
    shareButtons: boolean
    keyboardShortcuts: boolean
    analytics: boolean
    learnSection: boolean     // false until Phase 4
  }

  // Analytics
  analytics: {
    googleAnalyticsId: string  // "G-4ZCZWRPXHW"
    enabled: boolean
  }

  // API endpoints (existing Lambdas)
  api: {
    subscribe: string          // "https://ebiskwsxj4.execute-api..."
    questions: string
  }

  // SEO
  seo: {
    titleSuffix: string       // " | javabypankaj"
    defaultOgImage: string
    twitterHandle: string
  }

  // Rate limiting (client-side)
  rateLimit: {
    searchDebounceMs: number   // 300
    submitCooldownMs: number   // 30000 (30 sec between submissions)
    maxSubmitsPerHour: number  // 5
  }

  // UI
  ui: {
    questionsPerPage: number   // 50
    searchResultsLimit: number // 100
    emailPopupDelayMs: number  // 30000
    animationsEnabled: boolean
  }
}
```

### 2.2 Repository Interfaces (Data Access)
```typescript
// lib/data/interfaces.ts

// ---- Chapter Repository ----
interface IChapterRepository {
  getAll(): Promise<ChapterSummary[]>
  getBySlug(slug: string): Promise<Chapter | null>
  getByNumber(num: number): Promise<Chapter | null>
}

// ---- Question Repository ----
interface IQuestionRepository {
  getById(id: string): Promise<Question | null>
  getBySlug(chapterSlug: string, topicSlug: string, questionSlug: string): Promise<Question | null>
  getByChapter(chapterSlug: string): Promise<QuestionSummary[]>
  getByTopic(chapterSlug: string, topicSlug: string): Promise<QuestionSummary[]>
  getRelated(questionId: string, limit: number): Promise<QuestionSummary[]>
  search(query: string, limit: number): Promise<SearchResult[]>
}

// ---- Tutorial Repository (for Learn section) ----
interface ITutorialRepository {
  getCategories(): Promise<TutorialCategory[]>
  getByCategory(categorySlug: string): Promise<TutorialSummary[]>
  getBySlug(categorySlug: string, topicSlug: string): Promise<Tutorial | null>
  search(query: string, limit: number): Promise<SearchResult[]>
}

// ---- Submission Repository ----
interface ISubmissionRepository {
  submitQuestion(data: QuestionSubmission): Promise<SubmissionResult>
  subscribe(email: string): Promise<SubscriptionResult>
  getCommunityQuestions(): Promise<CommunityQuestion[]>
}

// ---- Combined Repository (Facade) ----
interface IContentRepository {
  chapters: IChapterRepository
  questions: IQuestionRepository
  tutorials: ITutorialRepository
  submissions: ISubmissionRepository
}
```

### 2.3 Repository Factory
```typescript
// lib/data/factory.ts

// Factory Pattern — creates correct repository based on config
class DataRepositoryFactory {
  static create(config: AppConfig): IContentRepository {
    switch (config.dataSource.type) {
      case 'static':
        return new JSONFileRepository()    // Phase 1: reads JSON files
      case 'api':
        return new SpringBootAPIRepository(config.dataSource)  // Phase 3
      default:
        throw new Error(`Unknown data source: ${config.dataSource.type}`)
    }
  }
}
```

## 3. Component Design

### 3.1 Component Hierarchy
```
App (layout.tsx)
├── ConfigProvider              ← Provides AppConfig to all components
│   ├── ThemeProvider           ← Manages dark/light mode
│   │   ├── TopBar
│   │   │   ├── Logo
│   │   │   ├── SearchInput
│   │   │   ├── SubmitButton    ← Hidden if features.submitQuestion = false
│   │   │   └── DarkModeToggle  ← Hidden if features.darkMode = false
│   │   ├── Breadcrumb
│   │   ├── PageContent         ← Changes per route
│   │   │   ├── HomePage
│   │   │   │   ├── ContinueWhereYouLeftOff
│   │   │   │   ├── ChapterTable
│   │   │   │   └── CommunityQuestions
│   │   │   ├── ChapterPage
│   │   │   │   └── TopicTable
│   │   │   ├── TopicPage
│   │   │   │   ├── QuestionDropdown
│   │   │   │   ├── QuestionTabs
│   │   │   │   └── QuestionView
│   │   │   │       └── AnswerSection (repeated per section)
│   │   │   ├── SearchPage
│   │   │   │   └── SearchResults
│   │   │   └── LearnPage (Phase 4)
│   │   │       └── TutorialView
│   │   │           └── TutorialSection (repeated)
│   │   └── Footer
│   │       └── ShareButtons
│   └── ErrorBoundary
```

### 3.2 Answer Section Registry (Open/Closed Principle)
```typescript
// components/features/AnswerSection/registry.ts

// Each section type has its own renderer.
// To add a new section type, register it here. No other file changes.

type SectionRenderer = (props: SectionProps) => JSX.Element

const SECTION_REGISTRY: Record<string, SectionRenderer> = {
  'definition':     DefinitionSection,
  'real_world':     RealWorldSection,
  'code':           CodeSection,
  'diagram':        DiagramSection,
  'gotcha':         GotchaSection,
  'interview_tip':  InterviewTipSection,
  'comparison':     ComparisonSection,
  'behind_scenes':  BehindScenesSection,
  'when_to_use':    WhenToUseSection,
  'best_practices': BestPracticesSection,
  'follow_up':      FollowUpSection,
  'summary':        SummarySection,
  // Phase 4: Learn section types
  'concept':        ConceptSection,
  'problem':        ProblemSection,
  'solution':       SolutionSection,
  'pitfalls':       PitfallsSection,
}

// Adding a new section type:
// 1. Create the component in its own file
// 2. Add one line to this registry
// 3. Done. No other changes needed.

function renderSection(section: AnswerSection): JSX.Element {
  const Renderer = SECTION_REGISTRY[section.type]
  if (!Renderer) {
    console.warn(`Unknown section type: ${section.type}`)
    return <FallbackSection {...section} />
  }
  return <Renderer {...section} />
}
```

### 3.3 Hook Design
```typescript
// Each hook follows this pattern:
// 1. Single responsibility
// 2. Returns [state, actions]
// 3. SSR-safe (no window/localStorage on server)
// 4. Configurable via AppConfig

// Example: useBookmarks
interface UseBookmarksReturn {
  bookmarks: Set<string>           // Set of question IDs
  isBookmarked: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
  count: number
}

function useBookmarks(): UseBookmarksReturn {
  const config = useConfig()
  // If feature disabled, return no-op
  if (!config.features.bookmarks) {
    return { bookmarks: new Set(), isBookmarked: () => false, toggle: () => {}, clear: () => {}, count: 0 }
  }
  // ... actual implementation using useLocalStorage
}
```

## 4. Design Patterns Used

| Pattern | Where | Why |
|---|---|---|
| **Repository** | `lib/data/interfaces.ts` | Abstract data access. Swap JSON for API without changing components |
| **Factory** | `lib/data/factory.ts` | Create correct repository based on config |
| **Adapter** | `JSONFileRepo`, `SpringBootAPIRepo` | Both adapt different sources to the same interface |
| **Strategy** | `lib/data/search.ts` | Different search algorithms (simple match, fuzzy, API-backed) |
| **Observer** | React hooks (useState, useEffect) | Components react to state changes (dark mode, bookmarks) |
| **Singleton** | `AppConfig`, search index | One instance shared across the app via React Context |
| **Registry** | `AnswerSection/registry.ts` | Register section renderers without modifying existing code |
| **Facade** | `IContentRepository` | Single interface over multiple sub-repositories |
| **Template Method** | Page layouts (`layout.tsx`) | Common structure (TopBar, Footer), variable content |
| **Composition** | All React components | Small components composed into larger ones. No inheritance |
| **Provider** | `ConfigProvider`, `ThemeProvider` | Inject dependencies (config, theme) via React Context |
| **Builder** | URL/route builders in `lib/constants/routes.ts` | Build URLs step by step, never concatenate strings |
| **Decorator** | `withAuth`, `withRateLimit` (Phase 3) | Add behavior to components/functions without modifying them |
| **Null Object** | Feature-disabled hooks return no-ops | No null checks needed. Disabled feature = silent no-op |

## 5. Rate Limiting (Client-Side)

```typescript
// lib/utils/rateLimit.ts

interface RateLimiter {
  canProceed(): boolean
  record(): void
  reset(): void
  remainingAttempts(): number
  cooldownMs(): number
}

// Token bucket algorithm
class TokenBucketRateLimiter implements RateLimiter {
  constructor(
    private maxTokens: number,    // from config.rateLimit.maxSubmitsPerHour
    private refillRateMs: number, // from config.rateLimit.submitCooldownMs
  ) {}
  // ...
}

// Usage in SubmitForm component:
const limiter = useRateLimiter('submit', config.rateLimit)
if (!limiter.canProceed()) {
  showError(`Please wait ${limiter.cooldownMs() / 1000}s before submitting again`)
  return
}
```

## 6. Input Validation

```typescript
// lib/utils/validation.ts

// All validators are pure functions. No side effects.
// Used both client-side (React) and can be reused in Spring Boot (same rules).

interface ValidationResult {
  valid: boolean
  errors: string[]
}

const Validators = {
  email: (value: string): ValidationResult => { /* RFC 5322 pattern */ },
  question: (value: string): ValidationResult => {
    const errors: string[] = []
    if (value.length < 10) errors.push('Question must be at least 10 characters')
    if (value.length > 2000) errors.push('Question must be under 2000 characters')
    if (containsScript(value)) errors.push('Invalid characters detected')
    return { valid: errors.length === 0, errors }
  },
  searchQuery: (value: string): ValidationResult => { /* sanitize, length check */ },
}

// Sanitization
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')           // Strip HTML tags
    .replace(/javascript:/gi, '')   // Strip JS protocol
    .trim()
    .slice(0, 2000)                 // Hard length limit
}
```

## 7. Error Handling Strategy

```typescript
// lib/utils/errors.ts

// Custom error hierarchy
class AppError extends Error {
  constructor(message: string, public code: string, public recoverable: boolean) {
    super(message)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', true)
  }
}

class DataLoadError extends AppError {
  constructor(source: string) {
    super(`Failed to load data from ${source}`, 'DATA_LOAD_ERROR', true)
  }
}

class RateLimitError extends AppError {
  constructor(waitMs: number) {
    super(`Rate limited. Wait ${waitMs}ms`, 'RATE_LIMITED', true)
  }
}

// Error boundary catches these and shows appropriate UI
// Recoverable errors → show retry button
// Non-recoverable → show error page
```

## 8. Spring Boot Integration Points

```
FRONTEND (Next.js)                    BACKEND (Spring Boot — Phase 3)
─────────────────                     ────────────────────────────────
IContentRepository ─── interface ───→ REST Controller
  .chapters.getAll()                  GET /api/v1/chapters
  .chapters.getBySlug()              GET /api/v1/chapters/{slug}
  .questions.getBySlug()             GET /api/v1/questions/{slug}
  .questions.search()                GET /api/v1/search?q=...
  .tutorials.getCategories()         GET /api/v1/learn/categories
  .tutorials.getBySlug()             GET /api/v1/learn/{cat}/{topic}
  .submissions.submitQuestion()      POST /api/v1/submissions
  .submissions.subscribe()           POST /api/v1/subscribe

Config change to switch:
  dataSource.type: 'static' → 'api'
  dataSource.apiBaseUrl: 'https://api.javabypankaj.live/api/v1'

That's it. No component changes. No hook changes. No page changes.
```

## 9. File → Class Mapping

| File | Class/Interface | Responsibility |
|---|---|---|
| `lib/config/AppConfig.ts` | `AppConfig` (singleton) | Loads and provides all configuration |
| `lib/config/FeatureFlags.ts` | `FeatureFlags` | Checks if features are enabled |
| `lib/data/interfaces.ts` | `IChapterRepository`, `IQuestionRepository`, etc. | Data access contracts |
| `lib/data/factory.ts` | `DataRepositoryFactory` | Creates correct repo implementation |
| `lib/data/json/JSONFileRepository.ts` | `JSONFileRepository` implements `IContentRepository` | Reads JSON files |
| `lib/data/api/SpringBootAPIRepository.ts` | `SpringBootAPIRepository` implements `IContentRepository` | Calls REST API |
| `lib/utils/rateLimit.ts` | `TokenBucketRateLimiter` implements `RateLimiter` | Client-side rate limiting |
| `lib/utils/validation.ts` | `Validators` (static methods) | Input validation rules |
| `lib/utils/errors.ts` | `AppError`, `NotFoundError`, etc. | Error hierarchy |
| `lib/utils/slug.ts` | `SlugGenerator` (static methods) | URL-safe slug generation |
| `components/features/AnswerSection/registry.ts` | `SECTION_REGISTRY` | Section type → renderer mapping |
