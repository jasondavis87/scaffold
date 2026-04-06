# Project Structure

## Package Naming

All packages use the `@packages/` scope (replaced by setup script):

- `@packages/backend` — Convex backend
- `@packages/shared` — Types, constants, schemas, utils
- `@packages/ui` — Web component library (shadcn/Base UI)
- `@packages/eslint-config` — ESLint presets
- `@packages/prettier-config` — Prettier config
- `@packages/tailwind-config` — Tailwind configs
- `@packages/typescript-config` — TypeScript configs

## Dependency Flow

```
apps/mobile  ──→  @packages/backend
             ──→  @packages/shared

apps/landing ──→  @packages/backend
             ──→  @packages/ui
             ──→  @packages/shared

apps/web     ──→  @packages/backend
             ──→  @packages/ui
             ──→  @packages/shared

@packages/ui ──→  @packages/shared (for types/schemas)
```

## Turbo Pipeline

- `build` — Builds all apps (depends on package builds)
- `dev` — Starts dev servers (persistent, not cached)
- `typecheck` — Type checks all packages and apps
- `lint` — Lints all packages and apps
- `format` — Checks formatting across all packages and apps
- `test` — Runs tests (not cached)
- `check-imports` — Validates mobile import restrictions

## What Goes Where

| Content | Location |
|---------|----------|
| Convex schema & functions | `packages/backend/convex/` |
| Shared types & constants | `packages/shared/src/` |
| Zod validation schemas | `packages/shared/src/schemas/` |
| Web UI components (shadcn) | `packages/ui/src/components/` |
| Mobile UI components | `apps/mobile/src/components/ui/` |
| Landing page routes | `apps/landing/src/app/` |
| Web app routes | `apps/web/src/app/` |
| Mobile screens | `apps/mobile/src/app/` |
| Design tokens (web) | `packages/shared/global.css` |
| Design tokens (mobile) | `apps/mobile/src/global.css` |
| ESLint presets | `tooling/eslint/` |
| TypeScript configs | `tooling/typescript/` |
