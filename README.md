# TeamFlow - Radically Simple & Extensible

A modular collaborative platform with **plugin-based feature architecture** that makes it radically simple to add or remove functionality.

## 🚀 Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## 🎯 Philosophy: Radical Simplicity

**Minimal Core** + **Plugin Features** = Maximum Extensibility

- ✅ Core handles layout, routing, settings
- ✅ Features are self-contained modules
- ✅ Enable/disable features in Settings
- ✅ Add features without touching core

## 📁 Architecture

```
features/                 # 👈 Drop-in feature modules
  tasks/
    index.ts             # Feature registration
    page.tsx             # Main UI
    components/          # Feature components
  agents/
  workflows/
  templates/

app/
  [feature]/page.tsx     # Dynamic feature loader
  layout.tsx             # Core layout only
  
lib/features/            # Feature registry system
```

## ✨ Adding a New Feature (3 Steps)

### 1. Create Feature Folder
```bash
mkdir features/analytics
```

### 2. Create Page Component
```typescript
// features/analytics/page.tsx
export default function AnalyticsPage() {
  return <div><h1>Analytics</h1></div>
}
```

### 3. Register Feature
```typescript
// features/analytics/index.ts
import { BarChart } from "lucide-react"
import { featureRegistry } from "@/lib/features"
import AnalyticsPage from "./page"

featureRegistry.register({
  id: "analytics",
  name: "Analytics",
  description: "Business intelligence dashboard",
  icon: BarChart,
  enabled: true,
  component: AnalyticsPage,
})

export { default } from "./page"
```

**That's it!** Feature is now accessible at `/analytics`, appears in sidebar, and is toggleable.

## 🤖 AI Agent Documentation

**For AI agents and developers**:
- 🚀 **[AI Agent Guide](./docs/agent-guide.md)** - Quick reference for AI coding agents
- 📖 **[Documentation Hub](./docs/README.md)** - Complete documentation index
- 📚 **Detailed Guides**:
  - [Feature Creation](./docs/feature-creation.md) - Adding new features
  - [Storage Patterns](./docs/storage.md) - Persistence abstraction
  - [Component Patterns](./docs/components.md) - UI composition
  - [TypeScript Guide](./docs/typescript.md) - Strict mode patterns
  - [Testing Guide](./docs/testing.md) - Testing strategy

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/kilabteam-2501s-projects/v0-ai-collaborative-platform)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/e3ttGFonQzv)

## Features

- 🤖 **AI Agents Management**: Configure and manage AI team members
- ✅ **Task Management**: Organize and track team tasks
- 🔄 **Workflow Builder**: Visual workflow automation
- 📚 **Template Library**: Pre-built team templates
- ⚙️ **Customizable Settings**: Appearance, typography, and layout options
- 🎨 **Theme Support**: Light, dark, and system themes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.6.3 (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **State**: React Context + localStorage
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js ≥18.x
- pnpm ≥8.x (install via `npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd v0-ai-teamflow-shadcn-ux

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Run TypeScript type checking
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix linting issues
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

### Project Structure

```
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # shadcn/ui primitives
│   └── resizable-dialog/  # Reusable components
├── features/        # Feature modules (plugin architecture)
├── lib/             # Utilities, context, hooks
├── docs/            # Documentation
│   ├── ARCHITECTURE.md
│   └── CONTRIBUTING.md
└── tests/           # Vitest tests
```

See [docs/agent-guide.md](./docs/agent-guide.md) for AI agent quick reference and [docs/](./docs/) for all documentation.

## Key Components

- **ResizableDialog**: Reusable dialog with drag-to-resize handles
- **SettingsOverlay**: Comprehensive settings management
- **AppSidebar**: Team navigation and workspace switcher
- **WorkflowBuilder**: Visual workflow editor

## Configuration

### Environment Variables

```bash
# .env.local (optional)
NEXT_PUBLIC_API_URL=https://api.example.com
```

### TypeScript

Strict type checking is enabled with additional safeguards:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

## Deployment

This project is automatically deployed on Vercel:

**Production**: [https://vercel.com/kilabteam-2501s-projects/v0-ai-collaborative-platform](https://vercel.com/kilabteam-2501s-projects/v0-ai-collaborative-platform)

### Manual Deployment

```bash
# Build and test locally
pnpm build
pnpm start

# Deploy to Vercel
vercel deploy
```

## Contributing

We welcome contributions! Please read [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) for:
- Development workflow
- Coding conventions
- Component patterns
- TypeScript guidelines
- AI agent guidelines

**For AI Agents**: Start with [docs/agent-guide.md](./docs/agent-guide.md) for quick reference patterns.

## License

[Your License Here]

## Links

- **v0.app Chat**: [https://v0.app/chat/e3ttGFonQzv](https://v0.app/chat/e3ttGFonQzv)
- **Documentation**: 
  - [Documentation Hub](./docs/README.md)
  - [AI Agent Guide](./docs/agent-guide.md)
  - [Contributing Guide](./docs/CONTRIBUTING.md)
  - [Architecture](./docs/ARCHITECTURE.md)
- **Issues**: [GitHub Issues](https://github.com/WorkshopKI/v0-ai-teamflow-shadcn-ux/issues)
