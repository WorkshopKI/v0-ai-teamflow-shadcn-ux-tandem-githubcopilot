# TeamFlow - AI Collaborative App

A local-first collaborative platform with AI agents, built with Next.js 16, React 19, and Tailwind CSS v4.

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
├── lib/             # Utilities and context
├── data/            # Static data and templates
└── styles/          # Global styles
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed architecture and conventions.

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

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Development workflow
- Coding conventions
- Component patterns
- TypeScript guidelines
- AI agent guidelines

## License

[Your License Here]

## Links

- **v0.app Chat**: [https://v0.app/chat/e3ttGFonQzv](https://v0.app/chat/e3ttGFonQzv)
- **Documentation**: See CONTRIBUTING.md
- **Issues**: [GitHub Issues](https://github.com/WorkshopKI/v0-ai-teamflow-shadcn-ux/issues)
