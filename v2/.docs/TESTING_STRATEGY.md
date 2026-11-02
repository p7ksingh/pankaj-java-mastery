# Testing Strategy

## Philosophy
Write the test first. Watch it fail. Write the minimum code to pass. Refactor. Repeat.

Every file in `src/` has a corresponding test. No exceptions.

## Test Pyramid
```
        ╱  E2E  ╲          Few, slow, high confidence
       ╱─────────╲         Playwright: 5-10 critical flows
      ╱Integration╲        Medium, test component combinations
     ╱─────────────╲       React Testing Library: ~50 tests
    ╱   Unit Tests   ╲     Many, fast, test one thing
   ╱───────────────────╲   Jest: ~200 tests
```

## What to test where

### Unit Tests (Jest) — `*.test.ts`
Location: next to the file, or `__tests__/unit/`

| What | Example |
|---|---|
| lib/data functions | `getChapterBySlug('core-java')` returns correct chapter |
| lib/utils functions | `generateSlug('HashMap internal working')` → `'hashmap-internal-working'` |
| Type validators | `isValidQuestion(data)` returns true/false |
| Constants | Routes build correctly |
| Hooks (with renderHook) | `useDarkMode` toggles class on body |

### Component Tests (React Testing Library) — `*.test.tsx`
Location: next to the component

| What | Example |
|---|---|
| Renders correctly | `<Badge>Q1</Badge>` renders with text "Q1" |
| User interaction | Click bookmark button → heart fills |
| Accessibility | Button has aria-label, table has proper roles |
| Props | `<ProgressBar value={45} />` shows 45% width |
| Dark mode | Component respects dark class |
| Responsive | Component hides text on small viewport |

### Integration Tests — `__tests__/integration/`
| What | Example |
|---|---|
| Page renders with data | Home page shows 28 chapters |
| Navigation works | Click "Core Java" → chapter page loads |
| Search works | Type "hashmap" → results appear |
| Data loading | All 28 JSON files parse without errors |

### E2E Tests (Playwright) — `__tests__/e2e/`
| What | Example |
|---|---|
| Full navigation flow | Home → Chapter → Topic → Question → Back |
| Search flow | ⌘K → type → click result → question loads |
| Dark mode persists | Toggle dark → reload → still dark |
| Mobile responsive | All pages render at 390px without overflow |
| SEO | Each page has unique title, description, canonical |

## Coverage Targets
| Layer | Target |
|---|---|
| lib/ | 100% |
| hooks/ | 95% |
| components/ui/ | 95% |
| components/features/ | 85% |
| Overall | 90% |

## Running Tests
```bash
# Unit + Component tests
npm test

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## Test File Template
```tsx
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant class', () => {
    render(<Button variant="primary">Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('primary')
  })
})
```
