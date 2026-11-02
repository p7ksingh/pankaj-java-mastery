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
