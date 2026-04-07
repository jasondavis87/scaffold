# scaffold

An opinionated monorepo template for building mobile + web apps with an AI-first development workflow.

Built for developers who use **Claude Code**, **TaskMaster AI**, **Convex**, **Expo**, and **Next.js**.

## The Workflow

1. **Plan with AI** — Chat with Claude Code to map out your MVP. Decide on libraries, features, screens, schema. Get a comprehensive plan with all technical decisions made.

2. **Clone & customize** — Clone this template, run `scripts/setup.sh` to name the project and toggle features (mobile, web dashboard, auth).

3. **Write the PRD** — Write a detailed product requirements document and save to `.taskmaster/docs/prd.txt`.

4. **Generate tasks** — Run `tm parse .taskmaster/docs/prd.txt` to have TaskMaster break the PRD into actionable tasks.

5. **Build task by task** — Run `tm next` to get the next unblocked task. Build it. Mark it done. Repeat.
   - Work on **one app at a time** per AI session. Use `git worktree` for parallelism across apps.
   - Shared schema and types are typically tackled first since they're used across apps.
   - **Polish with V0 at any point** — After building a few screens, generate a V0 bundle (`bun run v0-bundle -- landing`), fill the prompt template (`instructions/V0-TEMPLATE.md`), and submit to V0 for UI polish. Copy changed files back, run `bun check`, continue building. V0 is for UI only (not business logic) and handles one web app at a time. Loop between building and polishing as needed.

6. **Ship** — Deploy: Convex Cloud (backend), Coolify/Vercel (web), EAS (mobile).

## Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Expo SDK 55, expo-router, UniWind, React Native Reusables |
| Web | Next.js 16, Tailwind CSS v4, shadcn/ui (Base UI) |
| Backend | Convex |
| Package Manager | Bun |
| Monorepo | Turborepo |
| Testing | Vitest + convex-test |
| State (mobile) | Zustand + AsyncStorage |
| AI Workflow | Claude Code + TaskMaster AI |

## Structure

```
├── apps/
│   ├── mobile/         # Expo SDK 55 + expo-router + UniWind
│   ├── landing/        # Next.js marketing/landing site
│   └── web/            # Next.js web app (dashboard)
├── packages/
│   ├── backend/        # Convex backend
│   ├── shared/         # Types, constants, schemas, utils
│   └── ui/             # Web component library (shadcn/Base UI)
├── tooling/            # Shared configs (ESLint, Prettier, TS, Tailwind)
├── instructions/       # AI workflow docs & templates
├── scripts/            # Setup, import checker, V0 bundler
└── .taskmaster/        # TaskMaster config (pre-initialized)
```

## Quick Start

```bash
# Clone
git clone https://github.com/your-org/scaffold.git my-app
cd my-app

# Setup (renames packages, toggles features)
bash scripts/setup.sh

# Start Convex
cd packages/backend && bunx convex dev

# Start dev servers (in another terminal)
bun dev
```

## Key Principles

- **One app at a time** per AI session — use `git worktree` for parallelism
- **PRD is the single source of truth** — tasks reference it, don't duplicate it
- **Convex is the only backend** — no Next.js API routes for data operations
- **UniWind `className` for all mobile styling** — `style` prop only for animated values
- **Zustand store is the only interface to device storage** — never call AsyncStorage directly
- **Shared UI package is web-only** — mobile components live in `apps/mobile/src/components/ui/`

## Commands

```bash
bun install              # Install dependencies
bun dev                  # Start all dev servers
bun check                # Typecheck + lint + format (auto-fix)
bun test                 # Run Convex tests
bun ios                  # Start iOS simulator
bun android              # Start Android emulator
bun run ui-add           # Add shadcn component (web)
bun run v0-bundle -- web # Generate V0 bundle
```

## Inspiration

- [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) — Tooling directory pattern, ESLint presets, CI workflow
- [turbo-expo-nextjs-clerk-convex-monorepo](https://github.com/get-convex/turbo-expo-nextjs-clerk-convex-monorepo) — Convex + Expo + Next.js app structure

## License

MIT
