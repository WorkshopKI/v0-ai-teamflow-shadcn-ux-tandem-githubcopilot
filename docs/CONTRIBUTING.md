# Contributing to TeamFlow

Welcome! This guide helps new developers and AI coding agents understand the project structure, conventions, and workflows.

## 📚 Quick Start for AI Agents

**New to this codebase?** Start here:

1. **Read this overview** (you are here) - Understand project structure and conventions
2. **[FEATURE_CREATION_GUIDE.md](FEATURE_CREATION_GUIDE.md)** - Complete walkthrough of adding a feature from scratch
3. **[STORAGE_GUIDE.md](STORAGE_GUIDE.md)** - Data persistence patterns and storage abstraction
4. **[COMPONENT_PATTERNS.md](COMPONENT_PATTERNS.md)** - UI component composition and best practices
5. **[TYPE_SYSTEM_GUIDE.md](TYPE_SYSTEM_GUIDE.md)** - TypeScript patterns and strict mode handling
6. **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing patterns and examples

**Quick reference**: See [Pattern Catalog](#pattern-catalog) below for code examples.

## Quick Start

### Prerequisites
- **Node.js**: ≥18.x
- **pnpm**: ≥8.x (install via `npm install -g pnpm`)
- **TypeScript**: 5.6.3 (pinned in package.json)

### Setup
```bash
# Clone and install
git clone <repo-url>
cd v0-ai-teamflow-shadcn-ux
pnpm install

# Start development server
pnpm dev

# Run type checking
pnpm typecheck

# Run linter
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Build for production
pnpm build
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home/dashboard page
│   ├── agents/            # AI agents management
│   ├── tasks/             # Task management
│   ├── workflows/         # Workflow builder
│   ├── templates/         # Template library
│   └── settings/          # Settings page
├── components/
│   ├── ui/                # shadcn/ui primitives (Dialog, Button, etc.)
│   ├── resizable-dialog/  # Reusable resizable dialog component
│   ├── app-sidebar.tsx    # Main sidebar with team navigation
│   ├── settings-overlay.tsx # Settings modal (refactor in progress)
│   └── *.tsx              # Feature components
├── lib/
│   ├── settings-context.tsx # Global settings state
│   └── utils.ts           # Utility functions (cn, etc.)
├── data/
│   └── templates.tsx      # Template definitions
├── styles/                # Global styles
└── public/                # Static assets
```

## Architecture Decisions

### UI System
- **shadcn/ui**: Radix UI + Tailwind CSS primitives in `components/ui/`
- **Tailwind v4**: Latest version with enhanced CSS variables
- **Custom components**: Feature components built on top of UI primitives

### State Management
- **React Context**: `SettingsProvider` for global app settings
- **Local State**: `useState` for component-specific state
- **Persistence**: `localStorage` for settings and user preferences

### Styling
- **Tailwind utility-first**: Use Tailwind classes for all styling
- **CSS custom properties**: For theming and dynamic values
- **Component variants**: Use `class-variance-authority` (cva) for complex variants

### Type Safety
- **Strict mode enabled**: `strict: true` in tsconfig.json
- **Extra checks**: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **No build errors**: `ignoreBuildErrors` removed; all type errors must be fixed

## Coding Conventions

### File Organization
- **One component per file**: Exception for tiny sub-components
- **Co-located styles**: Keep component-specific CSS in same directory
- **Named exports**: Prefer named exports for better refactoring support
- **Index files**: Use index.ts for clean public APIs

### Component Patterns
```typescript
// ✅ Good: Named export with props interface
export interface MyComponentProps {
  title: string
  onClose?: () => void
}

export function MyComponent({ title, onClose }: MyComponentProps) {
  return <div>{title}</div>
}

// ❌ Avoid: Default exports make refactoring harder
export default function MyComponent() { }
```

### TypeScript Best Practices
- Use explicit types for props and return values
- Avoid `any`; use `unknown` if type is truly unknown
- Use `type` for object shapes, `interface` for extensible contracts
- Prefix unused variables with `_` (e.g., `_unusedParam`)

### Accessibility
- All interactive elements must have accessible labels
- Use `aria-label` or `sr-only` text for icon buttons
- Dialogs must have a `DialogTitle` (can be hidden with `sr-only`)
- Test with keyboard navigation

## Development Workflow

### Adding a New Feature
1. Create a branch: `git checkout -b feature/my-feature`
2. Build the feature using existing UI components where possible
3. Add TypeScript types for all new interfaces
4. Test manually in the browser
5. Run `pnpm typecheck && pnpm lint` before committing
6. Format code: `pnpm format`
7. Commit with descriptive message
8. Open PR with clear description

### Creating a New Component
1. Place in appropriate directory (`components/` or `app/`)
2. Create component file: `my-component.tsx`
3. Export types and component from index file
4. Use existing UI primitives where possible
5. Document props with JSDoc comments
6. Consider adding to Storybook (future)

### Refactoring Large Components
**Current pain points:**
- `settings-overlay.tsx` (~700 lines) → split into subcomponents
- `app-sidebar.tsx` (~544 lines) → extract team management

**Refactor checklist:**
- Extract logical sections into named components
- Create custom hooks for complex state logic
- Move shared logic to utility functions
- Update imports in affected files
- Run typecheck to ensure no breakage

## Pattern Catalog

Quick reference to common patterns in the codebase. For detailed explanations, see the linked guides.

### Storage Patterns

```typescript
// Direct storage access (one-time read/write)
import { storage, STORAGE_KEYS } from "@/lib/storage"
const theme = storage.get(STORAGE_KEYS.THEME, "light")
storage.set(STORAGE_KEYS.THEME, "dark")
```

```typescript
// Reactive storage (state synced to localStorage)
import { useStorage } from "@/lib/storage"
const [theme, setTheme] = useStorage(STORAGE_KEYS.THEME, "light")
```

```typescript
// CRUD with auto-persistence (lists with create/update/delete)
import { useCRUD } from "@/lib/hooks"
import { STORAGE_KEYS } from "@/lib/storage"
import { mockTasks } from "@/lib/mock-data"

const { items: tasks, create, update, remove } = useCRUD(
  mockTasks,
  STORAGE_KEYS.TASKS
)
```

**📖 Full guide**: [STORAGE_GUIDE.md](STORAGE_GUIDE.md)

### Component Patterns

```typescript
// Using UI primitives
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click me</Button>
  </CardContent>
</Card>
```

```typescript
// Form with validation
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { taskSchema } from "@/lib/schemas/task"

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(taskSchema),
})
```

**📖 Full guide**: [COMPONENT_PATTERNS.md](COMPONENT_PATTERNS.md)

### Type Patterns

```typescript
// Domain type definition
export interface Task {
  id: string
  title: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

// Form data (omit auto-generated fields)
export type TaskFormData = Omit<Task, "id" | "createdAt" | "updatedAt">

// Partial update
export type TaskUpdate = Partial<Omit<Task, "id" | "createdAt">>
```

```typescript
// Handling array access with noUncheckedIndexedAccess
const tasks: Task[] = [...]
const firstTask = tasks[0] // Type: Task | undefined

// Solution 1: Optional chaining
console.log(firstTask?.title)

// Solution 2: Type guard
if (firstTask) {
  console.log(firstTask.title) // Safe
}
```

**📖 Full guide**: [TYPE_SYSTEM_GUIDE.md](TYPE_SYSTEM_GUIDE.md)

### Feature Registration

```typescript
// features/my-feature/index.ts
import { featureRegistry } from "@/lib/features"
import MyFeaturePage from "./page"

featureRegistry.register({
  id: "my-feature",
  name: "My Feature",
  description: "Feature description",
  icon: FileText,
  enabled: true,
  order: 5,
  component: MyFeaturePage,
})

export { default } from "./page"
```

**📖 Full guide**: [FEATURE_CREATION_GUIDE.md](FEATURE_CREATION_GUIDE.md)

## AI Agent Guidelines

### Before You Code

**Checklist for AI agents starting work**:

- [ ] Read [FEATURE_CREATION_GUIDE.md](FEATURE_CREATION_GUIDE.md) if adding a feature
- [ ] Read [STORAGE_GUIDE.md](STORAGE_GUIDE.md) if working with data persistence
- [ ] Read [COMPONENT_PATTERNS.md](COMPONENT_PATTERNS.md) if creating UI components
- [ ] Read [TYPE_SYSTEM_GUIDE.md](TYPE_SYSTEM_GUIDE.md) if working with types
- [ ] Check [Pattern Catalog](#pattern-catalog) above for quick reference
- [ ] Look at existing similar features (tasks, agents, workflows) for patterns

### Core Principles

When modifying this codebase:

1. **Always run typecheck first**: `pnpm typecheck` before and after changes
2. **Follow existing patterns**: Match the style of surrounding code (see Pattern Catalog)
3. **Use abstractions**: Never use `localStorage` directly; use `storage` or hooks
4. **Use existing components**: Check `components/ui/` before creating new primitives
5. **Respect type safety**: Fix all type errors; don't use `@ts-ignore` or `any`
6. **Keep files small**: If a component exceeds ~200 lines, suggest refactoring
7. **Update related files**: If changing a component's interface, update all usages
8. **Preserve accessibility**: Don't remove aria-labels or semantic HTML
9. **Document complex logic**: Add JSDoc comments for non-obvious code

### Common Tasks

**Adding a new feature**:
1. Follow [FEATURE_CREATION_GUIDE.md](FEATURE_CREATION_GUIDE.md) step-by-step
2. Create types in `lib/types/`
3. Add mock data in `lib/mock-data/`
4. Create feature page in `features/[name]/`
5. Register feature in `features/[name]/index.ts`
6. Import in `features/index.ts`

**Adding a storage key**:
1. Add to `lib/storage/storage-keys.ts`
2. Use `STORAGE_KEYS.YOUR_KEY` in code
3. See [STORAGE_GUIDE.md](STORAGE_GUIDE.md) for patterns

**Creating a component**:
1. Check if primitive exists in `components/ui/`
2. Build from primitives, don't modify them
3. Extract logic to hooks if complex
4. See [COMPONENT_PATTERNS.md](COMPONENT_PATTERNS.md) for patterns

**Fixing type errors**:
1. Run `pnpm typecheck` to see all errors
2. Read error message carefully
3. Check [TYPE_SYSTEM_GUIDE.md](TYPE_SYSTEM_GUIDE.md) for solutions
4. Fix (don't suppress with `@ts-ignore`)
5. Re-run `pnpm typecheck`

**Writing tests**:
1. See [TESTING_GUIDE.md](TESTING_GUIDE.md) for patterns
2. Look at existing tests in `tests/components/`
3. Test behavior, not implementation
4. Use accessible queries (getByRole, getByLabelText)

## Testing (Future)
- **Unit tests**: Vitest for hooks and utilities
- **Component tests**: React Testing Library for component interactions
- **E2E tests**: Playwright for critical user flows
- **Coverage**: Aim for >80% on new code

## Common Issues

### TypeScript Version Warning
If you see "Minimum recommended TypeScript version is v5.1.0":
- We've pinned to `~5.6.3`
- Run `pnpm install` to ensure correct version

### ESLint Errors
- Run `pnpm lint:fix` to auto-fix most issues
- Check `eslint.config.mjs` for rule configuration

### Dialog Centering Issues
- Use `ResizableDialog` component from `components/resizable-dialog/`
- Ensures proper centering and viewport constraints
- Replaces manual resize logic

### Build Errors
- Check `pnpm typecheck` output
- Ensure all imports resolve correctly
- Verify no circular dependencies

## Example Features to Study

When implementing a new feature, study these existing implementations:

- **Tasks** (`features/tasks/`, `components/task-management/`)
  - Modular component structure
  - Custom hooks for state management
  - Drag-and-drop implementation
  - ~170 lines per file, well-organized
  
- **Agents** (`features/agents/`, `components/agents/`)
  - Form validation with Zod
  - Type-driven config objects
  - CRUD operations
  - Note: Main component needs refactoring (too large)

- **Workflows** (`features/workflows/`)
  - Simple feature structure
  - Good example of minimal implementation

- **Templates** (`features/templates/`)
  - Data-driven UI
  - Card grid layout

## Resources

### Project Documentation
- **[FEATURE_CREATION_GUIDE.md](FEATURE_CREATION_GUIDE.md)** - Complete tutorial for adding features
- **[STORAGE_GUIDE.md](STORAGE_GUIDE.md)** - Data persistence patterns
- **[COMPONENT_PATTERNS.md](COMPONENT_PATTERNS.md)** - UI component best practices
- **[TYPE_SYSTEM_GUIDE.md](TYPE_SYSTEM_GUIDE.md)** - TypeScript patterns
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing patterns and setup
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture deep dive
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI agent specific instructions

### External Resources
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## Questions?

**For AI agents**:
1. Check the relevant guide first (feature, storage, component, type, or testing)
2. Look at existing similar features for patterns
3. Run `pnpm typecheck` and `pnpm lint` for immediate feedback
4. Review the [Pattern Catalog](#pattern-catalog) for quick reference

**For humans**:
1. Check existing code for similar patterns
2. Review component props and interfaces
3. Open an issue for architectural questions
4. See `.github/` for multi-agent collaboration protocols

---

**Last updated**: November 2025
**Guides version**: 1.0
