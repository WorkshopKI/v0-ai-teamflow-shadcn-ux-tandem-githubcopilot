# AI Agent Instructions for TeamFlow

## Project Overview
TeamFlow is a local-first collaborative platform built with **Next.js 16 App Router**, **React 19**, and **Tailwind CSS v4**. The codebase emphasizes type safety, component composition, and localStorage-based persistence (backend integration planned).

## Critical Architecture Patterns

### Storage Abstraction Layer
**All localStorage access goes through `lib/storage/`** - never use `localStorage` directly:
```typescript
// ✅ Correct
import { storage, STORAGE_KEYS } from "@/lib/storage"
const theme = storage.get(STORAGE_KEYS.THEME, "light")
storage.set(STORAGE_KEYS.THEME, "dark")

// ❌ Wrong
localStorage.getItem("theme")
```

**Why**: Centralized error handling, type safety, and easy backend migration. Storage keys are constants in `lib/storage/storage-keys.ts`.

### State Management Architecture
1. **React Context** (`SettingsProvider` in `lib/settings-context.tsx`): Global app settings with pending/applied state pattern
2. **Common Hooks** (`lib/hooks/`):
   - `useCRUD`: Auto-persisting CRUD operations for lists
   - `useDialogState`: Dialog open/close state management
   - `useResizeHandle`: Drag-to-resize with persistence
3. **Component State** (`useState`): UI-only state (dropdowns, hover, etc.)

### Component Composition Strategy
- **UI primitives** (`components/ui/`): Radix UI + shadcn/ui base components (Dialog, Button, etc.)
- **Feature components**: Build from UI primitives - never modify `components/ui/` directly
- **ResizableDialog** (`components/resizable-dialog/`): Preferred over raw Radix Dialog for draggable/resizable modals

Example pattern:
```typescript
import { useCRUD } from "@/lib/hooks"
import { STORAGE_KEYS } from "@/lib/storage"
import { mockTasks } from "@/lib/mock-data"

const { items: tasks, create, update, remove } = useCRUD(mockTasks, STORAGE_KEYS.TASKS)
```

## TypeScript Strictness
**Zero tolerance** for type errors - `strict: true` with extra safeguards:
- `noUncheckedIndexedAccess: true` - all array access returns `T | undefined`
- `exactOptionalPropertyTypes: true` - optional properties can't be explicitly `undefined`
- Never use `@ts-ignore` or `any` - use `unknown` if type is truly unknown

Run `pnpm typecheck` before committing. If type errors exist, **fix them**, don't suppress.

## File Organization Conventions

### Component Structure
```
components/
  feature-name.tsx           # Simple component (target <200 lines)
  
  complex-feature/           # Multi-file component
    index.ts                 # Public API: export { Feature } from "./feature"
    feature.tsx              # Main component
    sub-component.tsx        # Internal components
    hooks/                   # Feature-specific hooks
      use-feature-state.ts
```

### Import Order (enforced by ESLint)
1. External libraries (React, Next.js, etc.)
2. Internal absolute imports (`@/lib`, `@/components`)
3. Types (`import type { ... }`)
4. Relative imports (if any)

### Naming Conventions
- **Components**: PascalCase (`TaskCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`use-task-dnd.ts`)
- **Utils/types**: kebab-case (`agent.ts`, `task.ts`)
- **Constants**: SCREAMING_SNAKE_CASE in the value (`STORAGE_KEYS.TASKS`)

## Development Commands

```bash
pnpm dev                    # Development server (localhost:3000)
pnpm typecheck             # Run TypeScript compiler (do this first!)
pnpm lint                  # ESLint checks
pnpm lint:fix              # Auto-fix linting issues
pnpm format                # Prettier formatting
pnpm build                 # Production build
pnpm test                  # Vitest unit tests
```

**Pre-commit checklist**: `pnpm typecheck && pnpm lint` must pass.

## Key Integration Points

### App Router Structure
- **Root layout**: `app/layout.tsx` → Providers → AppSidebar + route content
- **Providers**: `components/providers.tsx` wraps `SettingsProvider` (Theme via `next-themes` is on the roadmap)
- **Dynamic routing**: `app/[feature]/page.tsx` - renders any registered feature from the feature registry

### Styling System
1. **CSS Variables** (`:root` in `globals.css`): `--primary`, `--accent`, `--radius`, `--spacing`
2. **Tailwind Utilities**: All styling via Tailwind classes - avoid custom CSS
3. **Component Variants** (`class-variance-authority`): For complex variant logic (see `components/ui/button.tsx`)

**Theme switching**: Settings are applied via `applyCSSSettings()` in `lib/settings-context.tsx` which updates CSS custom properties.

### Mock Data Pattern
All mock data lives in `lib/mock-data/` (agents, tasks, workflows). Import from there, never define inline in components:
```typescript
import { mockTasks } from "@/lib/mock-data"
```

## Common Pitfalls to Avoid

1. **Hydration Mismatches**: Use `suppressHydrationWarning={true}` on `<body>` (already in layout.tsx). Format dates with `formatDateISO()` from `lib/utils.ts` for SSR/CSR parity.

2. **Missing Dialog Titles**: Every `<Dialog>` must have `<DialogTitle>`. If visually hidden, use:
   ```tsx
   <DialogTitle className="sr-only">Accessible title</DialogTitle>
   ```

3. **Direct localStorage Access**: Always use `storage` abstraction from `lib/storage/`.

4. **Modifying UI Primitives**: Never edit files in `components/ui/` - these are from shadcn/ui. Create wrapper components instead.

5. **Array Access Without Checks**: With `noUncheckedIndexedAccess`, always check array results:
   ```typescript
   const item = items[0]
   if (item) { /* use item */ }
   ```

## Testing Strategy
- **Unit tests** (Vitest): Utilities in `lib/`, hooks
- **Component tests** (React Testing Library): UI components in `tests/components/`
- **E2E tests** (Playwright - future): Critical user flows

Example: `tests/components/agent-form.test.tsx`, `tests/components/stats-card.test.tsx`

## Current Refactoring Initiatives

### Completed
- ✅ Storage abstraction layer (`lib/storage/`)
- ✅ Common hooks library (`lib/hooks/`)
- ✅ Centralized types (`lib/types/`)
- ✅ Mock data extraction (`lib/mock-data/`)

### In Progress
- 🔄 Task management modularization (`components/task-management/`)
- 🔄 Settings overlay refactoring (split 700-line component)

### When Refactoring Large Files
Target: <200 lines per file. If exceeding:
1. Extract logical sections into sub-components
2. Create custom hooks for complex state logic
3. Move shared utilities to `lib/utils.ts`

## Accessibility Requirements
- All interactive elements need accessible labels (`aria-label` or visible text)
- Icon-only buttons must have `aria-label`
- Test keyboard navigation (Tab, Enter, Escape)
- Maintain WCAG 2.1 AA compliance

## Multi-Agent Collaboration

This repository uses **two AI agents working in tandem**:
- **v0 (Vercel)**: Handles UI/UX, components, and page layouts (see `.github/V0.md`)
- **GitHub Copilot**: Handles backend logic, APIs, and testing (see `.github/COPILOT.md`)

**Handoff protocol**: See `.github/HANDOFF.md` for how agents communicate and divide work.

## AI-Specific Guidance

### When Making Changes
1. **Always run** `pnpm typecheck` to verify changes
2. **Check existing patterns** in similar components before creating new patterns
3. **Import from centralized locations**: Use `@/lib/types`, `@/lib/mock-data`, etc.
4. **Preserve file structure**: Don't reorganize unless explicitly asked
5. **Document complex logic**: Add JSDoc comments for non-obvious code

### When Adding Features
1. Use existing UI components from `components/ui/`
2. Follow CRUD pattern with `useCRUD` hook if managing lists
3. Add types to `lib/types/` if creating new domain objects
4. Use `storage` abstraction for persistence
5. Create index.ts for multi-file components

### When Fixing Bugs
1. Reproduce the issue in the dev server (`pnpm dev`)
2. Check TypeScript errors first (`pnpm typecheck`)
3. Verify ESLint issues (`pnpm lint`)
4. Test keyboard navigation for accessibility issues
5. Check browser console for runtime errors

---

**Last Updated**: November 2025  
**Tech Stack**: Next.js 16, React 19, TypeScript 5.6, Tailwind v4, Radix UI, shadcn/ui  
**Package Manager**: pnpm (required)
