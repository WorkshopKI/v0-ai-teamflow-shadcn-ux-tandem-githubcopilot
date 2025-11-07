# AI Coding Agent Onboarding Guide

This repository is structured to make automated or AI-assisted contributions predictable and safe. This guide lists stable entry points, conventions, and guardrails.

## High-Level Map
- Pages (route components): `app/*/page.tsx`
- Feature components: `components/agents`, `components/templates`, `components/task-management`
- UI primitives: `components/ui/*`
- Config & constants: `lib/config/*`
- Types: `lib/types/*` (barrel in `lib/types/index.ts`)
- Validation schemas: `lib/schemas/*`
- Mock data: `lib/mock-data/*`
- Utilities: `lib/utils.ts`

## Safe Modification Zones
| Area | Purpose | Notes |
|------|---------|-------|
| `components/agents/*` | Feature components for agents | Extract logic before expanding |
| `lib/config/*` | Declarative mappings | Avoid side effects |
| `lib/schemas/*` | Zod schemas | Keep in sync with types |
| `components/ui/*` | Reusable primitives | Do not add feature logic |

## DO / AVOID
**DO** keep SSR/CSR deterministic (use `formatDateISO`).  
**DO** add new constants via config modules rather than scattering literals.  
**DO** write selectors (future) instead of recomputing in components.  
**AVOID** using `toLocaleDateString` during render.  
**AVOID** mutating arrays in place—always return new references.

## Adding a New Agent Field
1. Extend interface in `lib/types/agent.ts`.
2. Update `agentSchema` in `lib/schemas/agent.ts`.
3. Add default/handling in `AgentForm`.
4. Add display elements in `agent-details` (future extracted component).
5. Update any derived stats if impacted.

## Creating a Stats Card
Use `StatsCard` + `StatsGrid`. Provide:
```tsx
<StatsCard title="Active Agents" icon={Bot} value={active} highlight={"+5%"} subtext="vs last week" />
```

## Testing (Planned)
Use Vitest + React Testing Library:
```bash
pnpm test
```
Test examples will live in `tests/*` (add co-located tests for complex hooks).

## Checklist Before Opening PR
- [ ] Typecheck passes (`pnpm typecheck`)
- [ ] Lint passes (`pnpm lint`)
- [ ] No hydration warnings in dev console
- [ ] All new date displays use deterministic formatting
- [ ] Components remain pure (no side effects in render)
- [ ] Added/updated docs if public API changed

## Common Pitfalls
| Issue | Cause | Resolution |
|-------|-------|------------|
| Hydration mismatch | Locale-sensitive dates | Use `formatDateISO` |
| Infinite re-render | Effect deps include changing inline values | Memoize or narrow deps |
| Style drift | Duplicated Tailwind class sequences | Extract via component or utility |

## Future Enhancements
- Introduce selectors in `lib/selectors/*` for metrics
- Add data adapters (mock → API) `lib/data/*`
- Storybook for visual regression

---
For questions, see `ARCHITECTURE.md` or open an issue with `[design]` tag.
