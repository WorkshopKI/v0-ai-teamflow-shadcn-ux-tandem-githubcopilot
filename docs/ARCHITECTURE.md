# Architecture Overview

## System Design

TeamFlow is a Next.js 16 App Router application with a component-based architecture focused on maintainability and developer experience.

## Core Principles

1. **Type Safety First**: Strict TypeScript with no escape hatches
2. **Component Composition**: Build complex UIs from small, focused components
3. **Local-First**: Data persisted in localStorage, sync optional
4. **Accessibility**: WCAG 2.1 AA compliance for all interactive elements
5. **Progressive Enhancement**: Works without JavaScript where possible

## Technology Decisions

### Why Next.js 16?
- **App Router**: File-based routing with layouts and nested routes
- **React Server Components**: Reduced client bundle, faster page loads
- **Turbopack**: Faster dev server and builds
- **Built-in optimizations**: Image optimization, font loading, etc.

### Why React 19?
- **Improved concurrent rendering**: Better performance for complex UIs
- **Server Actions**: Simplified data mutations (future use)
- **Form APIs**: Native form handling improvements
- **Stable features**: useTransition, useDeferredValue, etc.

### Why Tailwind CSS v4?
- **Utility-first**: Rapid prototyping and consistent spacing/colors
- **CSS Variables**: Dynamic theming support
- **Automatic purging**: Minimal production bundle
- **PostCSS integration**: No build tool complexity

### Why Radix UI?
- **Unstyled primitives**: Full design control
- **Accessibility built-in**: ARIA patterns, keyboard nav, focus management
- **Composable**: Build complex components from simple primitives
- **Well-tested**: Battle-tested by thousands of production apps

### Why shadcn/ui?
- **Copy-paste components**: Own the code, no package dependencies
- **Customizable**: Modify to fit design system
- **Type-safe**: Full TypeScript support
- **Community-driven**: Extensive examples and patterns

## Data Flow

```
┌─────────────────────────────────────────┐
│          User Interaction               │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│       Component State (useState)         │
│  - UI state (open/closed, selected)     │
│  - Form inputs                           │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│    Context API (SettingsProvider)       │
│  - Global app settings                  │
│  - Theme preferences                    │
│  - Pending vs applied state             │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         localStorage Persistence         │
│  - Settings: "appSettings"              │
│  - Teams: "teams"                       │
│  - Active team: "activeTeamId"          │
│  - Sidebar width: "sidebarWidth"        │
└─────────────────────────────────────────┘
```

## Component Hierarchy

```
app/layout.tsx (Root)
  ├─ Providers (Theme, Settings)
  │   └─ AppSidebar
  │       ├─ TeamList (collapsible)
  │       ├─ Navigation Links
  │       └─ ThemeToggle + SettingsButton
  └─ Main Content (route-specific)
      ├─ page.tsx (Dashboard)
      ├─ agents/page.tsx
      ├─ tasks/page.tsx
      ├─ workflows/page.tsx
      ├─ templates/page.tsx
      └─ settings/page.tsx

Overlays (Portal-based)
  ├─ SettingsOverlay (Dialog)
  │   ├─ Tabs (Appearance, Typography, Layout)
  │   └─ Live Preview
  └─ TemplateDialog
```

## State Management Strategy

### Local Component State
**Use for**: UI-only state (modals, dropdowns, hover)
```typescript
const [isOpen, setIsOpen] = useState(false)
```

### React Context
**Use for**: Cross-component shared state (theme, settings)
```typescript
const { settings, updateSettings } = useSettings()
```

### URL State (Future)
**Use for**: Shareable state (filters, search, selected item)
```typescript
const searchParams = useSearchParams()
```

### Server State (Future)
**Use for**: Backend data (when API is added)
```typescript
// Consider: TanStack Query, SWR, or React Server Components
```

## Styling Architecture

### Layer 1: Design Tokens (CSS Variables)
```css
:root {
  --primary: #0a3874;
  --accent: #306bb3;
  --radius: 0.5rem;
  --spacing: 0.25rem;
}
```

### Layer 2: Tailwind Utilities
```tsx
<div className="rounded-lg border bg-background p-6 shadow-lg" />
```

### Layer 3: Component Variants (CVA)
```typescript
const buttonVariants = cva("base-styles", {
  variants: {
    variant: { default, destructive, ghost },
    size: { sm, md, lg }
  }
})
```

### Layer 4: Component-Specific CSS (Rare)
Only when Tailwind can't express the behavior (e.g., complex animations).

## File Organization Patterns

### Component Files
```
components/
  feature-name.tsx          # Main component
  feature-name.css          # Optional: complex styles
  
  complex-feature/          # For multi-file components
    index.ts                # Public API
    component.tsx           # Main component
    sub-component.tsx       # Internal subcomponents
    hooks.ts                # Component-specific hooks
    types.ts                # Type definitions
```

### Page Files (App Router)
```
app/
  page.tsx                  # Home route
  layout.tsx                # Root layout
  
  feature/
    page.tsx                # /feature route
    layout.tsx              # Feature-specific layout
    loading.tsx             # Loading state
    error.tsx               # Error boundary
    
    [id]/
      page.tsx              # /feature/123 route
```

## Performance Considerations

### Bundle Size
- Tree-shaking enabled (ES modules)
- Dynamic imports for heavy components
- Tailwind purge for minimal CSS

### Runtime Performance
- Memoization for expensive computations (`useMemo`)
- Callback stability (`useCallback`)
- Avoid unnecessary re-renders (React.memo when needed)
- Debounce/throttle user inputs

### Load Time
- Code splitting at route level (automatic)
- Image optimization (next/image)
- Font optimization (next/font)
- Static generation where possible

## Security Considerations

### XSS Prevention
- React escapes by default
- Sanitize user-generated content if using `dangerouslySetInnerHTML`
- Use Content Security Policy headers

### Data Validation
- zod schemas for runtime validation
- TypeScript for compile-time safety
- Validate localStorage data on read

### Authentication (Future)
- JWT tokens in httpOnly cookies
- CSRF protection
- Rate limiting on API routes

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// lib/utils.test.ts
describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })
})
```

### Component Tests (RTL)
```typescript
// components/button.test.tsx
it('handles click events', async () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click me</Button>)
  await userEvent.click(screen.getByText('Click me'))
  expect(handleClick).toHaveBeenCalledOnce()
})
```

### E2E Tests (Playwright)
```typescript
// e2e/settings.spec.ts
test('user can change theme', async ({ page }) => {
  await page.goto('/')
  await page.click('[aria-label="Settings"]')
  await page.click('text=Dark')
  await expect(page.locator('html')).toHaveClass(/dark/)
})
```

## Deployment Architecture

```
┌─────────────────┐
│   GitHub Repo   │
│   (main branch) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel Build   │
│  - pnpm install │
│  - pnpm build   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel Edge    │
│  - Global CDN   │
│  - Auto-scaling │
└─────────────────┘
```

## Migration Paths

### Adding Database (Future)
1. Choose: PostgreSQL (Vercel Postgres) or Supabase
2. Add Prisma ORM for type-safe queries
3. Migrate localStorage data to DB
4. Add authentication (NextAuth.js or Clerk)
5. Implement optimistic updates

### Adding Real-Time (Future)
1. WebSockets via Vercel Serverless Functions
2. Or use Supabase Realtime
3. Or Pusher/Ably for managed solution

### Scaling (Future)
1. Add Redis for caching
2. Move heavy computation to background jobs
3. Implement pagination for large lists
4. Add search with Algolia or Meilisearch

## Common Patterns

### Dialog with Form
```typescript
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogTitle>Edit Item</DialogTitle>
    <form onSubmit={handleSubmit}>
      <Input {...register("name")} />
      <Button type="submit">Save</Button>
    </form>
  </DialogContent>
</Dialog>
```

### Optimistic UI Update
```typescript
const handleUpdate = async (data) => {
  // Update UI immediately
  setItems(prev => prev.map(item => 
    item.id === data.id ? data : item
  ))
  
  try {
    // Then sync to backend
    await api.update(data)
  } catch (error) {
    // Revert on error
    setItems(prev => /* revert */)
  }
}
```

### Debounced Search
```typescript
const [query, setQuery] = useState("")
const debouncedQuery = useDebounce(query, 300)

useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

## Troubleshooting Guide

### Type Errors
1. Check TypeScript version: `pnpm list typescript`
2. Run clean typecheck: `pnpm typecheck`
3. Check for missing types: `@types/*` packages
4. Restart TypeScript server in IDE

### Build Errors
1. Clear cache: `rm -rf .next`
2. Clean install: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
3. Check for syntax errors in recent changes
4. Verify all imports resolve

### Runtime Errors
1. Check browser console for client errors
2. Check terminal for server errors
3. Verify localStorage hasn't been corrupted
4. Check for hydration mismatches (server vs client)

### Performance Issues
1. Use React DevTools Profiler
2. Check for unnecessary re-renders
3. Verify images are optimized
4. Check bundle size: `pnpm build && pnpm analyze`

---

**Last Updated**: November 2025  
**Version**: Next.js 16 + React 19  
**Status**: Active Development
