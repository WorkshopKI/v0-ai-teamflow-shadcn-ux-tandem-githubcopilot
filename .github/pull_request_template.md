## Summary

<!-- Briefly describe what this PR does and why -->

## Type of Change

<!-- Check all that apply -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 UI/UX improvement
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test addition or update

## Checklist

### Required (must be checked before merge)

- [ ] **TypeScript check passes**: `pnpm typecheck` runs without errors
- [ ] **Linting passes**: `pnpm lint` runs without errors (or `pnpm lint:fix` applied)
- [ ] **Storage abstraction**: No direct `localStorage` usage outside `lib/storage/` (use `storage`, `useStorage`, or `useCRUD`)
- [ ] **Component composition**: No modifications to `components/ui/` files (composed from primitives instead)
- [ ] **Tests added/updated**: New features have tests; bug fixes include regression tests
- [ ] **File size compliance**: All new files <200 lines (or labeled `allow-large` with justification)

### Feature-Specific (check if applicable)

- [ ] **New feature registered**: Added to `features/index.ts` and validated with feature schema
- [ ] **Storage key added**: New key added to `STORAGE_KEYS` in `lib/storage/storage-keys.ts`
- [ ] **Types defined**: New types in `lib/types/` and exported in `lib/types/index.ts`
- [ ] **Mock data provided**: Development seed data in `lib/mock-data/`
- [ ] **Zod schema created**: Validation schema in `lib/schemas/` for new entities

### Documentation (check if applicable)

- [ ] **Public API documented**: New hooks, components, or utilities have JSDoc comments
- [ ] **User-facing changes documented**: Updates to user guide or feature documentation
- [ ] **README updated**: If adding new commands, scripts, or setup steps
- [ ] **Migration guide provided**: For breaking changes

## Testing

<!-- Describe how you tested this PR -->

### Manual Testing
- [ ] Tested in dev environment (`pnpm dev`)
- [ ] Verified in production build (`pnpm build && pnpm start`)
- [ ] Tested with browser DevTools (no console errors)
- [ ] Keyboard navigation works (accessibility check)

### Automated Testing
- [ ] Unit tests pass: `pnpm test`
- [ ] New tests cover edge cases
- [ ] Coverage maintained or improved

## Screenshots / Videos

<!-- If UI changes, add before/after screenshots or screen recordings -->

## Related Issues

<!-- Link related issues: Closes #123, Fixes #456, Related to #789 -->

## Deployment Notes

<!-- Any special deployment considerations, environment variables, or migration steps -->

## Rollback Plan

<!-- For risky changes, describe how to rollback if issues arise -->

---

**Reviewer Guidelines**:
- Verify all required checklist items are checked
- Run `pnpm typecheck && pnpm lint && pnpm test` locally
- Test manually in dev environment
- Check for storage abstraction compliance (`git diff | grep localStorage`)
- Verify component composition (no `components/ui/` modifications)
