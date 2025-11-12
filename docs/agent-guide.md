# AI Agent Guide for TeamFlow

**Quick reference for AI coding agents contributing to TeamFlow**

For detailed explanations, see the comprehensive guides in this directory.

## 📚 Quick Navigation

| Topic | Quick Reference | Detailed Guide |
|-------|----------------|----------------|
| Adding Features | [Below](#adding-features) | [feature-creation.md](feature-creation.md) |
| Storage Patterns | [Below](#storage-patterns) | [storage.md](storage.md) |
| Component Patterns | [Below](#component-patterns) | [components.md](components.md) |
| TypeScript | [Below](#typescript-patterns) | [typescript.md](typescript.md) |
| Testing | [Below](#testing-patterns) | [testing.md](testing.md) |

## Quick Start

### Before You Code (5 minutes)

```bash
# 1. Verify setup
pnpm install

# 2. Run TypeScript check
pnpm typecheck

# 3. Start dev server
pnpm dev
```

### Critical Rules

✅ **DO**:
- Use storage abstraction (`storage`, `useStorage`, `useCRUD`) - never `localStorage` directly
- Build components from `components/ui/` primitives - never modify them
- Keep files under 200 lines
- Fix all TypeScript errors (no `@ts-ignore` or `any`)
- Run `pnpm typecheck` before committing

❌ **DON'T**:
- Access `localStorage` directly
- Modify files in `components/ui/`
- Use `any` or `@ts-ignore`
- Skip type checking

## Architecture Overview

### Project Structure

```
├── app/                    # Next.js 16 App Router
│   └── [feature]/         # Dynamic feature routes
├── components/
│   ├── ui/                # shadcn/ui primitives (DON'T MODIFY)
│   └── [feature]/         # Feature-specific components
├── features/              # Feature registration
│   ├── index.ts          # Feature loader
│   └── [feature]/        # Self-contained modules
│       ├── index.ts      # Feature registration
│       ├── page.tsx      # Main component
│       └── components/   # Feature components
├── lib/
│   ├── types/            # Domain types
│   ├── schemas/          # Zod validation
│   ├── storage/          # Storage abstraction
│   ├── hooks/            # Reusable hooks
│   ├── mock-data/        # Dev data
│   └── features/         # Feature registry
└── tests/                # Vitest tests
```

### Technology Stack

- **Next.js 16** + **React 19** - App Router, Server Components
- **TypeScript 5.6** - Strict mode (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI + shadcn/ui** - Accessible primitives
- **Vitest + RTL** - Testing
- **react-hook-form + Zod** - Forms

## Core Patterns

### Pattern 1: Storage Abstraction ⭐

**Never use `localStorage` directly**. Always use the abstraction.

```typescript
// ❌ WRONG
localStorage.setItem("tasks", JSON.stringify(tasks))

// ✅ CORRECT - Direct access (one-time)
import { storage, STORAGE_KEYS } from "@/lib/storage"
storage.set(STORAGE_KEYS.THEME, "dark")

// ✅ CORRECT - Reactive state
import { useStorage } from "@/lib/storage"
const [theme, setTheme] = useStorage(STORAGE_KEYS.THEME, "light")

// ✅ CORRECT - CRUD operations
import { useCRUD } from "@/lib/hooks"
const { items, create, update, remove } = useCRUD(mockTasks, STORAGE_KEYS.TASKS)
```

**Decision**: One-time → `storage.get/set` | Reactive → `useStorage` | Lists → `useCRUD`

### Pattern 2: Component Composition

**Build from primitives, never modify them**.

```typescript
// ✅ CORRECT
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function StatsCard({ title, value }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
```

### Pattern 3: Type-Driven Development

```typescript
// 1. Define type (lib/types/task.ts)
export interface Task {
  id: string
  title: string
  status: TaskStatus
  createdAt: string
}

export type TaskFormData = Omit<Task, "id" | "createdAt" | "updatedAt">

// 2. Create Zod schema (lib/schemas/task.ts)
export const taskSchema = z.object({
  title: z.string().min(2),
  status: z.enum(["todo", "in-progress", "completed"]),
})

// 3. Mock data (lib/mock-data/tasks.ts)
export const mockTasks: Task[] = [...]

// 4. Use in component
const { items: tasks } = useCRUD<Task>(mockTasks, STORAGE_KEYS.TASKS)
```

### Pattern 4: Feature Registration

```typescript
// features/notes/index.ts
import { featureRegistry } from "@/lib/features"
import NotesPage from "./page"

featureRegistry.register({
  id: "notes",
  name: "Notes",
  icon: FileText,
  enabled: true,
  order: 5,
  component: NotesPage,
})

export { default } from "./page"

// Don't forget: import "./notes" in features/index.ts
```

## Adding Features

### 6-Step Workflow (30-45 min)

**1. Type** (5 min) - `lib/types/note.ts`:
```typescript
export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
}

export type NoteFormData = Omit<Note, "id" | "createdAt" | "updatedAt">
```

Export in `lib/types/index.ts`:
```typescript
export type { Note, NoteFormData } from "./note"
```

**2. Storage Key** (2 min) - `lib/storage/storage-keys.ts`:
```typescript
export const STORAGE_KEYS = {
  // ... existing
  NOTES: "notes", // ← Add this
} as const
```

**3. Mock Data** (5 min) - `lib/mock-data/notes.ts`:
```typescript
export const mockNotes: Note[] = [
  { id: "1", title: "Example", content: "...", createdAt: "..." }
]
```

Export in `lib/mock-data/index.ts`:
```typescript
export { mockNotes } from "./notes"
```

**4. Feature Page** (15 min) - `features/notes/page.tsx`:
```typescript
"use client"

import { useCRUD } from "@/lib/hooks"
import { STORAGE_KEYS } from "@/lib/storage"
import { mockNotes } from "@/lib/mock-data"
import type { Note } from "@/lib/types"

export default function NotesPage() {
  const { items: notes, create, remove } = useCRUD<Note>(
    mockNotes,
    STORAGE_KEYS.NOTES
  )

  return (
    <div className="container mx-auto p-6">
      {/* Your UI */}
    </div>
  )
}
```

**5. Register** (5 min) - `features/notes/index.ts`:
```typescript
import { FileText } from "lucide-react"
import { featureRegistry } from "@/lib/features"
import NotesPage from "./page"

featureRegistry.register({
  id: "notes",
  name: "Notes",
  description: "Personal note-taking",
  icon: FileText,
  enabled: true,
  order: 5,
  component: NotesPage,
})

export { default } from "./page"
```

Import in `features/index.ts`:
```typescript
import "./notes" // ← Add this line
```

**6. Test** (5 min):
```bash
pnpm typecheck  # Must pass
pnpm dev        # Test in browser
```

**Checklist**:
- [ ] Type in `lib/types/`
- [ ] Storage key in `storage-keys.ts`
- [ ] Mock data in `lib/mock-data/`
- [ ] Page in `features/[name]/page.tsx`
- [ ] Registration in `features/[name]/index.ts`
- [ ] Import in `features/index.ts`
- [ ] `pnpm typecheck` passes
- [ ] Tested in browser

## Common Tasks

### Add Storage Key
1. Edit `lib/storage/storage-keys.ts`
2. Add to `STORAGE_KEYS` object
3. Use `STORAGE_KEYS.YOUR_KEY`

### Create Component
1. Check `components/ui/` for primitive
2. Compose from primitives
3. Keep under 200 lines
4. Extract logic to hooks if needed

### Fix Type Errors
1. Run `pnpm typecheck`
2. Read error message
3. Common fixes:
   - Array: Add `?` or type guard
   - Optional: Omit instead of `undefined`
   - Generic: Add type parameter
4. Never use `@ts-ignore`

### Handle Arrays
```typescript
const item = items[0]
if (item) {
  // Safe to use item
}
```

## Common Pitfalls

| Issue | Cause | Resolution |
|-------|-------|------------|
| Hydration mismatch | Locale-sensitive dates | Use `formatDateISO` from `lib/utils.ts` |
| Data doesn't persist | Not using storage abstraction | Use `useCRUD` or `useStorage` |
| Type errors | Array access without check | Add type guard or optional chaining |
| Feature not appearing | Not imported in `features/index.ts` | Add import statement |

## Pre-Commit Checklist

- [ ] `pnpm typecheck` passes (zero tolerance for type errors)
- [ ] `pnpm lint` passes
- [ ] No hydration warnings in dev console
- [ ] All date displays use `formatDateISO`
- [ ] No direct `localStorage` access
- [ ] Components under 200 lines

## Development Commands

```bash
pnpm dev          # Dev server
pnpm typecheck    # TypeScript check (must pass!)
pnpm lint         # Lint
pnpm lint:fix     # Auto-fix
pnpm test         # Tests
pnpm build        # Production build
```

## Additional Resources

- **[Feature Creation Guide](feature-creation.md)** - Complete tutorial with examples
- **[Storage Guide](storage.md)** - Deep dive on storage abstraction
- **[Component Guide](components.md)** - UI composition patterns
- **[TypeScript Guide](typescript.md)** - Strict mode patterns
- **[Testing Guide](testing.md)** - Testing patterns and setup
- **[Architecture](ARCHITECTURE.md)** - System design
- **[Contributing](CONTRIBUTING.md)** - Contribution guidelines

---

**Version**: 2.0  
**Last Updated**: November 7, 2025
