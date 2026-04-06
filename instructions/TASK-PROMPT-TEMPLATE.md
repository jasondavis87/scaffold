# TaskMaster Parse Prompt

Use this prompt when running `tm parse`:

---

Parse this PRD into actionable development tasks for a monorepo project.

**Important context:**
- This is a Turborepo monorepo with apps/ (mobile, landing, web) and packages/ (backend, shared, ui)
- Backend is Convex (packages/backend/convex/) — no Next.js API routes
- Mobile uses Expo SDK 55 + UniWind (NOT NativeWind)
- Web uses Next.js 16 + Tailwind CSS v4 + shadcn/ui
- Package manager is Bun

**Task generation rules:**
1. The FIRST task must always be: "Install all mobile dependencies and verify the app builds"
2. Schema/backend tasks should come early (other tasks depend on them)
3. Shared types and schemas before app-specific tasks
4. Group by feature, not by layer (e.g., "User Profile" includes schema + mobile screen + web page)
5. Each task should be completable in a single session
6. Include acceptance criteria that can be verified with `bun check` or manual testing
7. Reference specific files/directories where work should happen
8. Work on ONE app at a time per task — don't mix mobile and web in the same task

**Dependency ordering:**
1. Mobile dependency installation + build verification
2. Convex schema + core functions
3. Shared types + schemas
4. Feature tasks (grouped, with cross-app dependencies noted)
5. Polish + V0 design passes
6. Final verification
