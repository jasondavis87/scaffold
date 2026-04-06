# scaffold

A scaffold application

## Monorepo Structure

```
├── apps/
│   ├── mobile/         # Expo SDK 55 + expo-router + UniWind
│   ├── landing/        # Next.js 16 marketing/landing site
│   └── web/            # Next.js 16 web app (dashboard)
├── packages/
│   ├── backend/        # Convex backend (schema, functions, tests)
│   ├── shared/         # Types, constants, Zod schemas, utils
│   └── ui/             # Shared web component library (shadcn/Base UI)
├── tooling/
│   ├── eslint/         # ESLint presets (base, react, nextjs, expo)
│   ├── prettier/       # Prettier config (import sorting + tailwind)
│   ├── tailwind/       # Tailwind configs (web + native reference)
│   ├── typescript/     # TypeScript configs (base, react, nextjs, expo)
│   └── github/         # CI setup action
├── instructions/       # AI & project documentation
├── scripts/            # Setup, import checks, V0 bundler
└── .taskmaster/        # TaskMaster AI config (pre-initialized)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Expo SDK 55, expo-router, UniWind, React Native Reusables |
| Web | Next.js 16, Tailwind CSS v4, shadcn/ui (Base UI) |
| Backend | Convex (realtime, serverless) |
| Package Manager | Bun |
| Monorepo | Turborepo |
| Testing | Vitest + convex-test |
| State (mobile) | Zustand + AsyncStorage (persisted) |

## Key Commands

```bash
bun install              # Install all dependencies
bun dev                  # Start all dev servers (turbo)
bun dev --filter=landing # Start only landing site (port 3000)
bun dev --filter=web     # Start only web app (port 3001)
bun ios                  # Start Expo on iOS simulator
bun android              # Start Expo on Android emulator
bun check                # Run typecheck + lint + format + check-imports
bun test                 # Run Convex tests (vitest)
bun run ui-add           # Add shadcn component to packages/ui
bun run v0-bundle -- landing  # Generate V0 design bundle
```

## Architectural Rules

1. **Convex is the ONLY backend** — no Next.js API routes for data. All mutations/queries go through Convex functions.
2. **Bun is the ONLY package manager** — never use npm, yarn, or pnpm.
3. **UniWind for mobile styling (NOT NativeWind)** — use `className` for all static styles. Use `style` prop ONLY for animated shared values (Reanimated).
4. **Never import RN primitives directly** — import `Text`, `View`, etc. from `@/lib/react-native` or `@/components/ui/*`, NOT from `react-native`. ESLint enforces this.
5. **Shared UI (`packages/ui`) is web-only** — mobile components live in `apps/mobile/src/components/ui/`.
6. **Validate with Zod** — all external data (API responses, form inputs) validated with Zod schemas from `@packages/shared`.
7. **Zustand store is the ONLY interface to AsyncStorage** — components never call AsyncStorage or SecureStore directly. Use `usePreferencesStore`.
8. **Work on ONE app at a time** — use `git worktree` for parallelism across apps in separate AI sessions.
9. **PRD is the single source of truth** — tasks reference the PRD, don't duplicate spec content.

## Do NOT

- Use `npm`, `yarn`, or `pnpm`
- Create Next.js API routes for data operations (use Convex)
- Import from `react-native` directly in mobile app code (except in `src/components/ui/` and `src/lib/react-native.tsx`)
- Use NativeWind — this project uses UniWind
- Use `style` prop for static styles on mobile — use `className`
- Call AsyncStorage directly — use the Zustand preferences store
- Duplicate PRD content in task descriptions

## Source of Truth

- **PRD**: `.taskmaster/docs/prd.txt`
- **Tasks**: `.taskmaster/tasks/`
- **Design tokens**: `packages/shared/global.css` (web) and `apps/mobile/src/global.css` (mobile)

## Convex Conventions

- Use the latest Convex syntax: `mutation()`, `query()`, `action()` from `convex/server`
- Always add `args` and `returns` validators
- Use `withIndex()` for efficient queries
- Schema defined in `packages/backend/convex/schema.ts`
- HTTP routes in `packages/backend/convex/http.ts`

## Adding Components

```bash
# Web (shadcn/Base UI → packages/ui)
bun run ui-add

# Mobile (React Native Reusables → apps/mobile)
cd apps/mobile && bun run rnr-add
```

## V0 Workflow

V0 is used for **UI polish only** (not business logic) and can be used **at any point during development**.

1. Generate bundle: `bun run v0-bundle -- landing` (or `web`)
2. Fill template: `instructions/V0-TEMPLATE.md`
3. Upload zip + paste prompt to V0
4. Copy changed files back (remap V0 root paths → `src/`)
5. Run `bun check` to verify

V0 handles one web app at a time. For mobile, share code context only (V0 can't render React Native).

See `instructions/V0-TEMPLATE.md` for the full prompt template.
See `scripts/create-v0-bundle.sh` for the bundle generator.
