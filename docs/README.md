# TeamFlow Documentation

**Complete documentation for TeamFlow collaborative platform**

## 🚀 For AI Agents

Start here: **[AI Agent Guide](agent-guide.md)** - Quick reference for AI coding agents

## 📖 Documentation Index

### Getting Started
- **[README](../README.md)** - Project overview and setup
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute

### Architecture & Design
- **[Architecture](ARCHITECTURE.md)** - System design and technical decisions
- **[Feature Creation](feature-creation.md)** - Step-by-step guide to adding new features

### Development Guides
- **[Storage Guide](storage.md)** - Storage abstraction patterns
- **[Component Guide](components.md)** - Component composition and UI patterns
- **[TypeScript Guide](typescript.md)** - TypeScript strict mode patterns
- **[Testing Guide](testing.md)** - Testing strategies and examples

## 📂 Documentation Structure

```
docs/
├── README.md              # This file - documentation hub
├── agent-guide.md         # AI agent quick reference
├── ARCHITECTURE.md        # System architecture
├── CONTRIBUTING.md        # Contribution guidelines
├── feature-creation.md    # Feature development tutorial
├── storage.md            # Storage patterns
├── components.md         # Component patterns
├── typescript.md         # TypeScript guide
└── testing.md            # Testing guide
```

## 🎯 Quick Links by Task

### I want to...

**Add a new feature**
→ Read [Feature Creation Guide](feature-creation.md) then [AI Agent Guide](agent-guide.md)

**Understand the architecture**
→ Start with [Architecture](ARCHITECTURE.md)

**Work with data/state**
→ Check [Storage Guide](storage.md)

**Build UI components**
→ See [Component Guide](components.md)

**Fix TypeScript errors**
→ Refer to [TypeScript Guide](typescript.md)

**Write tests**
→ Follow [Testing Guide](testing.md)

**Contribute code**
→ Review [Contributing Guide](CONTRIBUTING.md)

## 🤖 AI Agent Workflow

1. **Read**: [AI Agent Guide](agent-guide.md)
2. **Setup**: Run `pnpm install && pnpm typecheck`
3. **Develop**: Follow patterns in guides
4. **Verify**: Run `pnpm typecheck && pnpm lint && pnpm test`
5. **Test**: Run `pnpm dev` and verify in browser

## 📝 Documentation Principles

- **Single source of truth**: Each topic has one authoritative guide
- **Flat structure**: All guides in `docs/` root (no nested subdirectories)
- **Cross-referenced**: Related guides link to each other
- **AI-friendly**: Clear patterns, code examples, and checklists

## 🔄 Keeping Docs Updated

When making changes:
- Update relevant guide(s) in `docs/`
- Update code examples if patterns change
- Keep [AI Agent Guide](agent-guide.md) in sync with core patterns
- Run `pnpm typecheck` to ensure code examples are valid

---

**Last Updated**: November 7, 2025  
**Questions?** Open an issue or check [Contributing Guide](CONTRIBUTING.md)
