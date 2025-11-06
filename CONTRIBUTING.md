# Contributing to TeamFlow

Welcome! This guide helps new developers and AI coding agents understand the project structure, conventions, and workflows.

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

## AI Agent Guidelines

### For AI Coding Assistants
When modifying this codebase:

1. **Always run typecheck first**: `pnpm typecheck` before and after changes
2. **Follow existing patterns**: Match the style of surrounding code
3. **Use existing components**: Check `components/ui/` before creating new primitives
4. **Respect type safety**: Fix all type errors; don't use `@ts-ignore`
5. **Keep files small**: If a component exceeds ~200 lines, suggest refactoring
6. **Update related files**: If changing a component's interface, update all usages
7. **Preserve accessibility**: Don't remove aria-labels or semantic HTML

### Common Tasks for AI Agents
```typescript
// Adding a new UI component
// 1. Check if similar primitive exists in components/ui/
// 2. If not, create in components/ with proper types
// 3. Export from index.ts
// 4. Update imports in consuming files

// Fixing type errors
// 1. Run: pnpm typecheck
// 2. Read the error message carefully
// 3. Fix the type mismatch (don't use 'any')
// 4. Re-run typecheck to verify

// Adding a new route
// 1. Create folder in app/ (e.g., app/new-page/)
// 2. Add page.tsx with default export
// 3. Update navigation in app-sidebar.tsx
// 4. Test navigation flow
```

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

## Resources
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Questions?
- Check existing code for similar patterns
- Review component props and interfaces
- Run `pnpm typecheck` and `pnpm lint` for guidance
- Open an issue for architectural questions

---

**Last updated**: November 2025
