# Product Requirements Document

## Product Overview

**Product Name:** [Name]
**One-liner:** [One sentence description]
**Target Launch:** [Date or milestone]

## Target User

**Primary persona:** [Who is the main user?]
**Pain point:** [What problem does this solve?]
**Current alternative:** [How do they solve it today?]

## Core Features

### Feature 1: [Name]
**Description:** [What it does]
**Acceptance Criteria:**
- [ ] [Specific, testable criterion]
- [ ] [Another criterion]

### Feature 2: [Name]
**Description:** [What it does]
**Acceptance Criteria:**
- [ ] [Specific, testable criterion]
- [ ] [Another criterion]

### Feature 3: [Name]
**Description:** [What it does]
**Acceptance Criteria:**
- [ ] [Specific, testable criterion]
- [ ] [Another criterion]

## Tech Stack

- **Mobile:** Expo SDK 55, expo-router, UniWind, React Native Reusables
- **Web:** Next.js 16, Tailwind CSS v4, shadcn/ui (Base UI)
- **Backend:** Convex
- **Auth:** [Clerk / none / other]
- **Payments:** [RevenueCat / Stripe / none]
- **AI:** [Claude API / none]

## Data Model / Schema

```typescript
// Define your Convex schema here
// emails table is provided by the template
```

## Screen Inventory

### Mobile Screens
| Screen | Route | Description |
|--------|-------|-------------|
| Home | `/` | [Description] |

### Web Screens
| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `/dashboard` | [Description] |

## API / Integrations

| Service | Purpose | Auth Method |
|---------|---------|-------------|
| [Service] | [Purpose] | [API key / OAuth] |

## Auth Strategy

[Describe auth flow — Clerk, social login, magic link, etc. Or "none for MVP"]

## Billing / Monetization

[Describe pricing model, free tier, in-app purchases, subscriptions, etc. Or "none for MVP"]

## AI Features

[Describe any AI-powered features — Claude API, embeddings, etc. Or "none for MVP"]

## Design System

- **Colors:** [Primary, secondary, accent — or "use template defaults"]
- **Typography:** [Font family — or "use Inter (default)"]
- **Style:** [Minimal, playful, corporate, etc.]

## MVP Scope

**In scope:**
- [Feature 1]
- [Feature 2]

**Out of scope (post-MVP):**
- [Feature X]
- [Feature Y]

## Verification Plan

**The first task generated should always be:**
> Install all mobile dependencies and verify the app builds

**Testing strategy:**
- Convex functions: vitest + convex-test
- Manual testing for UI

**Definition of done:**
- `bun check` passes
- `bun test` passes
- App runs on iOS simulator
- Landing page renders correctly
