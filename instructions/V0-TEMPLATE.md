# V0 Design Prompt Template

## Usage

1. Generate a bundle: `bun run v0-bundle -- landing` (or `web`)
2. Copy this template and fill in the bracketed sections below
3. Upload the zip file to V0
4. Paste the filled-in prompt

**Important:** V0 is for UI polish only — don't modify business logic, data fetching, or Convex calls. V0 handles one web app at a time. For mobile (React Native), V0 can generate design inspiration but can't render.

---

## Prompt Template

```
I'm uploading a Next.js web application that needs a design polish pass. The zip contains the current codebase.

### Screens to redesign
{SCREEN_LIST}
- Example: "app/page.tsx (landing hero + features + CTA)"
- Example: "app/(protected)/dashboard/page.tsx"

### Design goals
{DESIGN_GOALS}
- Example: "Modern, minimal SaaS aesthetic with subtle animations"
- Example: "Bold and colorful, playful startup feel"

### Hard constraints (do NOT change)
- Do not modify any Convex data fetching (useMutation, useQuery calls)
- Do not change route structure or navigation logic
- Do not modify provider wrappers or layout hierarchy
- Do not add new npm dependencies without listing them
- Keep all existing functionality working
- Preserve TypeScript types and imports

### Soft constraints (you can adjust)
- Color palette: {CONSTRAINTS}
- Typography: {CONSTRAINTS}
- Spacing and layout: {CONSTRAINTS}
- Animations: prefer framer-motion (already installed)

### Available packages
Already installed — feel free to use:
- framer-motion (animations)
- lucide-react (icons)
- class-variance-authority (component variants)
- tailwind-merge + clsx (class composition)
- sonner (toast notifications)
- next-themes (dark mode)

The shared UI library is in packages/ui/ — components use CVA + Tailwind.

### Output format
For each file you change:
1. Show the complete updated file
2. At the end, provide a "Changed Files" checklist:

**Changed Files:**
- [ ] `app/page.tsx` — redesigned hero section
- [ ] `components/Hero.tsx` — new animation, updated layout
- [ ] (etc.)

Note: The zip has files at the root (app/, components/), but in the actual project they live under src/ (src/app/, src/components/). Remap when copying back.
```

---

## Tips

- **3-7 screens per prompt** — too many and V0 loses focus
- **Let V0 lead on design** — give goals, not pixel-perfect specs
- **One app per session** — don't mix landing and web in one prompt
- **Iterate** — V0 works best with follow-up refinement prompts
- **Check after copying** — always run `bun check` after integrating V0 output
