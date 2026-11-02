# Development Rules

These rules are non-negotiable. Every line of code follows them. No exceptions.

## 1. Development Workflow

```
1. Pick ONE feature from BUILD_PLAN.md
2. Write tests first (TDD)
3. Write code to pass tests
4. Test locally — verify it works as expected
5. Break it intentionally — test edge cases, bad input, missing data, network errors
6. Fix what broke — add tests for those edge cases
7. Review code — clean, no shortcuts, proper comments
8. Update documentation (CHANGELOG.md, BUILD_PLAN.md)
9. Only then push to dev
10. Move to next feature
```

**Never push untested code. Never push multiple features at once. Never skip the break-and-test step.**

## 2. Code Quality Standards

### Clean Code
- No emoji in code, variable names, comments or log messages
- No decorative separators (no `--`, `===`, `***`, `----` in code)
- No unnecessary comments. Code should be self-explanatory
- Comments explain WHY, not WHAT. The code already says what it does
- Short, precise comments. One line. No essays

```typescript
// BAD
// ===== This function gets the chapter by slug =====
// It takes a slug parameter and returns the chapter object 🎉
function getChapterBySlug(slug: string): Chapter | null { ... }

// GOOD
// Returns null when slug does not match any chapter
function getChapterBySlug(slug: string): Chapter | null { ... }
```

### Naming
- Names are descriptive and unambiguous
- Boolean variables start with `is`, `has`, `can`, `should`
- Functions start with a verb: `get`, `set`, `create`, `validate`, `build`, `parse`, `format`
- No abbreviations except widely known ones (URL, ID, HTML, CSS, API, SSG)
- No single-letter variables except loop counters (`i`, `j`)

```typescript
// BAD
const d = getData()
const flag = true
const str = 'hello'
function proc(x: any) { ... }

// GOOD
const chapters = getChapters()
const isLoading = true
const searchQuery = 'hello'
function validateEmail(input: string): ValidationResult { ... }
```

### Functions and Methods
- One function does one thing
- Maximum 20 lines per function. If longer, extract a helper
- Maximum 3 parameters. If more, use an options object
- Always return typed values. Never return `any`
- Pure functions where possible. No side effects unless the function name says so

```typescript
// BAD — does too many things
function handleSubmit(form: FormData) {
  validate(form)
  sanitize(form)
  callAPI(form)
  showMessage()
  resetForm()
  trackEvent()
}

// GOOD — each step is a separate function, composed together
function handleSubmit(form: FormData): SubmitResult {
  const validated = validateSubmission(form)
  if (!validated.valid) return createFailure(validated.errors)

  const sanitized = sanitizeSubmission(validated.data)
  const result = await submitToAPI(sanitized)
  
  trackSubmission(result)
  return result
}
```

### Components
- One component per file
- Maximum 50 lines of JSX. If longer, extract sub-components
- Props are typed with an interface. No inline types
- No business logic in components. Logic goes in hooks or lib/
- Components receive data via props or hooks. Never fetch or compute in render

```typescript
// BAD
function ChapterRow({ chapter }: { chapter: any }) {
  const topics = chapter.answers.reduce((acc, a) => { /* 20 lines of logic */ }, [])
  return <tr>{ /* 40 lines of JSX */ }</tr>
}

// GOOD
interface ChapterRowProps {
  chapter: ChapterSummary
}

function ChapterRow({ chapter }: ChapterRowProps) {
  return (
    <tr className={styles.row}>
      <td><Badge>{chapter.number}</Badge></td>
      <td>{chapter.title}</td>
      <td><Pill>{chapter.topicCount} topics</Pill></td>
      <td>{chapter.questionCount}</td>
    </tr>
  )
}
```

## 3. OOP and SOLID in Practice

### Single Responsibility
- Each file has one class, one hook, or one component
- Each function has one job
- If you say "and" to describe what something does, it does too much

### Open/Closed
- Add new section types by adding to the registry. Never modify existing renderers
- Add new data sources by implementing the interface. Never modify existing repositories
- Add new features by creating new components and hooks. Never modify unrelated code

### Liskov Substitution
- `JSONFileRepository` and `SpringBootAPIRepository` are interchangeable
- Every implementation of an interface must work correctly when swapped in

### Interface Segregation
- `IChapterRepository` is separate from `IQuestionRepository`
- A component that needs chapters does not depend on question methods
- Keep interfaces small and focused

### Dependency Inversion
- Components depend on interfaces, not implementations
- Hooks depend on config and interfaces, not concrete classes
- The factory decides which implementation to use. Nothing else knows

### Loose Coupling
- Components do not import other feature components directly
- Data layer does not know about the presentation layer
- Hooks do not know about specific components
- Communication between unrelated parts goes through config or context

```
ALLOWED:
  Page -> Feature Component -> UI Component -> (CSS Module)
  Page -> Hook -> lib/data (via interface)
  Hook -> lib/utils (pure functions)
  Component -> config (via useConfig hook)

NOT ALLOWED:
  UI Component -> Feature Component (child importing parent)
  lib/data -> Component (data layer importing React)
  Hook A -> Hook B -> Hook A (circular)
  Component -> .env directly (use config layer)
```

## 4. Testing Rules

### Every feature must have
- Unit tests for pure functions (lib/)
- Component tests for UI (render, interaction, accessibility)
- Edge case tests discovered during break-and-test step

### Break-and-test checklist
After a feature works, try to break it:
- Pass null, undefined, empty string, empty array
- Pass extremely long input (10,000 characters)
- Pass special characters: `<script>`, `' OR 1=1`, `../../../etc/passwd`
- Remove network (offline). Does it degrade gracefully?
- Resize to 320px wide. Does it overflow?
- Test with keyboard only. Can you reach everything?
- Test in dark mode. Are all colours readable?
- Remove localStorage. Does the app still work?
- Pass duplicate data. Does it handle it?
- Pass data in wrong format. Does it show an error, not crash?

### Test naming
```typescript
describe('validateEmail', () => {
  it('returns valid for a standard email address', () => { ... })
  it('returns invalid when @ is missing', () => { ... })
  it('returns invalid for an empty string', () => { ... })
  it('returns invalid when domain has no TLD', () => { ... })
  it('trims whitespace before validating', () => { ... })
})
```

## 5. File and Import Rules

### Import order (enforced by ESLint)
```typescript
// 1. Node/Next.js built-ins
import { Metadata } from 'next'

// 2. External libraries (if any)

// 3. Internal: lib (data, utils, constants, config)
import { getChapters } from '@/lib/data/chapters'
import { formatNumber } from '@/lib/utils/format'
import config from '@/lib/config/app.config'

// 4. Internal: hooks
import { useDarkMode } from '@/hooks/useDarkMode'

// 5. Internal: components
import { Badge } from '@/components/ui/Badge'
import { TopBar } from '@/components/layout/TopBar'

// 6. Styles
import styles from './Page.module.css'
```

### No barrel exports from large folders
```typescript
// BAD — imports everything even if you need one thing
import { Button, Badge, Pill, Card } from '@/components/ui'

// GOOD — import directly from the component
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
```

## 6. Git Commit Rules

### Commit messages
```
<scope>: <what changed>

Examples:
  ui/Button: add primary and outline variants
  lib/data: implement JSONFileRepository for chapters
  hooks/useDarkMode: handle SSR and localStorage fallback
  app/interview: add chapter page with topic table
  test: add edge case tests for slug generation
  docs: update BUILD_PLAN with Phase 1A completion
```

### One feature per commit
- Never mix unrelated changes in one commit
- Never commit commented-out code
- Never commit console.log or debug statements
- Never commit TODO comments without a tracking reference

## 7. Performance Rules

- No unnecessary re-renders. Use React.memo for pure display components
- No large objects in state. Derive what you can from props
- Lazy load components below the fold (Next.js dynamic import)
- Images use next/image with width/height for layout shift prevention
- CSS Modules for scoped styles. No global style pollution
- No runtime CSS-in-JS. All styles resolved at build time

## 8. Summary

```
Write code like a principal engineer:
  - Clean. Readable. No decoration
  - Small functions. Small components. Small files
  - Typed. Validated. Tested
  - Loosely coupled. Interface-driven. Configurable
  - Breaks gracefully. Recovers automatically
  - Documented in code (short comments) and in .docs/ (architecture)
```
