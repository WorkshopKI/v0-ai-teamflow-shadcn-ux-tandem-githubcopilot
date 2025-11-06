# Type Safety Migration Guide

This guide helps fix the 14 TypeScript errors discovered after enabling strict type checking.

## Quick Reference

```bash
# Run typecheck to see all errors
pnpm typecheck

# Fix in order of priority
1. Missing components (quick fix)
2. Type mismatches (medium complexity)
3. Optional property handling (requires careful review)
```

## Error 1: Missing Separator Component

**File**: `components/settings-dialog.tsx:11`

**Error**: Cannot find module '@/components/ui/separator'

**Fix**: Create the missing component or remove the import.

```bash
# Option A: Create separator component
# Copy from shadcn/ui: https://ui.shadcn.com/docs/components/separator

# Option B: Remove unused import (if not used)
# Check if Separator is used in the file, remove import if not
```

## Error 2: Optional String Properties

**Files**:
- `components/ai-agents-management.tsx:209` (lastActive)
- `components/workflow-builder.tsx:227` (lastRun)

**Error**: Type 'undefined' is not assignable to type 'string'

**Problem**: Interface expects `string`, but code provides `undefined`.

**Fix Option 1 - Make interface property optional**:
```typescript
// In type definition
interface Agent {
  lastActive?: string  // Add ? to make optional
}

// Usage stays the same
const agent: Agent = {
  lastActive: undefined  // Now valid
}
```

**Fix Option 2 - Provide a default value**:
```typescript
const duplicated: Agent = {
  lastActive: new Date().toISOString()  // Or ""
}
```

## Error 3: Number | Undefined in Strict Context

**File**: `components/ai-agents-management.tsx:366`

**Error**: Type 'number | undefined' is not assignable to type 'number'

**Context**:
```typescript
onValueChange={([value]) => setNewAgent({ ...newAgent, temperature: value })}
```

**Fix - Guard against undefined**:
```typescript
onValueChange={([value]) => {
  if (value !== undefined) {
    setNewAgent({ ...newAgent, temperature: value })
  }
}}

// Or with default value
onValueChange={([value]) => 
  setNewAgent({ ...newAgent, temperature: value ?? 0.7 })
}
```

## Error 4: Array Access Without Check

**File**: `components/app-sidebar.tsx:160`

**Error**: Argument of type 'string | undefined' is not assignable to parameter

**Context**:
```typescript
const match = team.name.match(/pattern/)
return match ? Number.parseInt(match[1], 10) : 1
```

**Fix - Add null coalescing**:
```typescript
return match ? Number.parseInt(match[1] ?? "1", 10) : 1

// Or more explicit
return match && match[1] ? Number.parseInt(match[1], 10) : 1
```

## Error 5: Possibly Undefined Array Access

**File**: `components/lane-color-customizer.tsx:133-134`

**Error**: Object is possibly 'undefined'

**Context**:
```typescript
const defaultLightColors: ColorScheme = colorPresets[0].light
const defaultDarkColors: ColorScheme = colorPresets[0].dark
```

**Fix - Add fallback**:
```typescript
const defaultPreset = colorPresets[0] ?? {
  light: { /* default values */ },
  dark: { /* default values */ }
}

const defaultLightColors: ColorScheme = defaultPreset.light
const defaultDarkColors: ColorScheme = defaultPreset.dark

// Or with type assertion if you're certain
const defaultLightColors: ColorScheme = colorPresets[0]!.light
```

## Error 6: Unknown Type in Style Properties

**Files**: `components/lane-color-customizer.tsx:213, 215, 225, 233`

**Error**: Argument of type 'unknown' is not assignable to parameter of type 'string | null'

**Context**:
```typescript
Object.entries(colors).forEach(([key, value]) => {
  root.style.setProperty(varName, value)  // value is unknown
})
```

**Fix - Type guard or assertion**:
```typescript
// Option 1: Type guard
Object.entries(colors).forEach(([key, value]) => {
  if (typeof value === 'string') {
    root.style.setProperty(varName, value)
  }
})

// Option 2: Type assertion (if certain)
Object.entries(colors).forEach(([key, value]) => {
  root.style.setProperty(varName, value as string)
})

// Option 3: Typed Object.entries
Object.entries(colors as Record<string, string>).forEach(([key, value]) => {
  root.style.setProperty(varName, value)
})
```

## Error 7: Optional Property in Task

**File**: `components/task-management-view.tsx:379`

**Error**: Types of property 'assignee' are incompatible

**Context**:
```typescript
const task: Task = {
  assignee: formData.assignee || undefined
}
```

**Fix - Make interface property optional**:
```typescript
// In type definition
interface Task {
  assignee?: string  // Add ?
}

// Or ensure always a string
const task: Task = {
  assignee: formData.assignee || ""  // Use empty string instead
}
```

## Error 8: Checked State in Dropdown

**File**: `components/ui/dropdown-menu.tsx:92`

**Error**: Type 'CheckedState | undefined' is not assignable

**Fix - Provide default or guard**:
```typescript
<DropdownMenuPrimitive.CheckboxItem
  checked={checked ?? false}  // Default to false
  {...props}
/>
```

## Error 9: Slider Value Array

**File**: `components/ui/slider.tsx:27`

**Error**: Type 'number[] | undefined' is not assignable to type 'number[]'

**Fix - Provide default empty array**:
```typescript
<SliderPrimitive.Root
  value={value ?? []}  // Default to empty array
  {...props}
/>
```

## Batch Fix Script

Create a script to apply common fixes:

```typescript
// scripts/fix-type-errors.ts
import fs from 'fs'
import path from 'path'

// Add null coalescing to common patterns
function addNullCoalescing(content: string): string {
  // match[1] -> match[1] ?? ""
  content = content.replace(
    /match\[(\d+)\](?!\s*\?)/g,
    'match[$1] ?? ""'
  )
  
  // value -> value ?? defaultValue for common cases
  // Add more patterns as needed
  
  return content
}

// Apply to files
const files = [
  'components/app-sidebar.tsx',
  // Add more files
]

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8')
  const fixed = addNullCoalescing(content)
  fs.writeFileSync(file, fixed)
})
```

## Validation After Fixes

```bash
# 1. Run typecheck
pnpm typecheck

# 2. Run linter
pnpm lint

# 3. Build to ensure no runtime errors
pnpm build

# 4. Start dev server and test affected features
pnpm dev
```

## Priority Order

1. **High Priority** (breaks functionality):
   - Missing separator component
   - Slider value array

2. **Medium Priority** (potential runtime errors):
   - Array access without checks
   - Possibly undefined object properties

3. **Low Priority** (type mismatches only):
   - Optional string properties (use defaults or make optional)
   - Unknown types in style properties (add type guards)

## Testing Strategy

For each fix:
1. Make the change
2. Run `pnpm typecheck`
3. Test the affected feature in browser
4. Verify no new errors introduced

## Common Patterns

### Pattern 1: Make Property Optional
```diff
interface MyType {
-  prop: string
+  prop?: string
}
```

### Pattern 2: Provide Default Value
```diff
-const value = props.value
+const value = props.value ?? defaultValue
```

### Pattern 3: Add Type Guard
```diff
-Object.entries(obj).forEach(([k, v]) => {
+Object.entries(obj).forEach(([k, v]) => {
+  if (typeof v !== 'string') return
   useValue(v)
})
```

### Pattern 4: Non-Null Assertion (use sparingly!)
```diff
-const item = array[0].property
+const item = array[0]!.property  // Only if certain array has items
```

## Resources

- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)

---

**Estimated Time**: 2-3 hours to fix all 14 errors
**Difficulty**: Beginner to Intermediate
**Impact**: Prevents production bugs, improves DX
