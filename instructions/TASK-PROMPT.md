You are working on {{PROJECT_NAME}}{{PROJECT_URL}} — {{PROJECT_DESCRIPTION}}.

## Your Assignment

Work on Taskmaster task {TASK_ID}.
If no task ID is specified above, use the `mcp__task-manager-ai__next_task` tool to find the next available task.

Once you know your task:

1. Read the task details with `mcp__task-manager-ai__get_task`
2. Set it to "in-progress" with `mcp__task-manager-ai__set_task_status`
3. Read `.taskmaster/docs/prd.txt` for the relevant section (this is the single source of truth — tasks reference it, not the other way around)
4. Check `instructions/DECISIONS.md` for any decisions that supersede the PRD
5. Implement the task fully, following the details and test strategy
6. If the task has subtasks, work through them in dependency order, updating subtask status as you complete each one
7. Run `bun check` to verify typecheck + lint + format pass (this auto-fixes formatting)
8. **Run the code review** (see below)
9. Fix any Critical or High issues found in the review
10. Re-run `bun check` if fixes were made
11. Set the task to "done" in Taskmaster (and any subtasks to "done")
12. Commit ALL changes (code + tasks.json) with a descriptive message — this must be the LAST step so nothing dirties the tree after the commit

## Scope Constraints

- **Web app tasks**: Stay within `apps/web/`. You may READ from `packages/shared/` and `packages/backend/` but do NOT edit files outside `apps/web/` without asking me first.
- **Backend tasks**: Stay within `packages/backend/convex/`. You may READ from `packages/shared/` but do NOT edit files outside `packages/backend/` without asking me first.
- **Shared package tasks**: Work in `packages/shared/` but ask me before making changes that could break imports in other apps.
- **Mobile app tasks**: Stay within `apps/mobile/`. Ask before editing shared packages.
- **Landing page tasks**: Stay within `apps/landing/`. Ask before editing shared packages.

## Key Rules

- **Bun exclusively** — no npm, no yarn, no npx. Use `bun add`, `bun install`, `bunx`.
- **Convex is the only backend** — no Next.js API routes, no Express, no serverless outside Convex.
- **PRD is source of truth** — `.taskmaster/docs/prd.txt` contains the spec. Tasks reference it. When in doubt, read the PRD.
- **Check DECISIONS.md first** — `instructions/DECISIONS.md` tracks architectural decisions that differ from or extend the PRD. Entries there supersede the PRD. Read it before starting implementation.
- **Record new decisions** — If you need to deviate from the PRD during implementation, add an entry to DECISIONS.md before proceeding.
- For Taskmaster operations, use the MCP tools (mcp__task-manager-ai__*) or the `tm` CLI.
- Read the task's `details` field carefully — it contains specific implementation guidance.
- If you hit a blocker or need to change the approach, ask me before proceeding.

## Code Review (Step 8)

After implementation is complete and `bun check` passes, spawn a subagent as a **Senior Developer Reviewer**.

The reviewer's mandate:

> You are a senior developer reviewing the work just completed for Taskmaster task {TASK_ID} in the {{PROJECT_NAME}} project. Your job is to find real problems — not nitpick style or speculate about future work.
>
> **Inputs:**
>
> 1. The task details (read from Taskmaster)
> 2. The PRD section relevant to this task (`.taskmaster/docs/prd.txt`)
> 3. The git diff of all changes made for this task (`git diff HEAD~1` or appropriate range)
> 4. The project conventions in `CLAUDE.md`
> 5. Any relevant entries in `instructions/DECISIONS.md`
>
> **Review Checklist:**
>
> 1. **Correctness** — Does the code do what the task specifies? Trace the task's acceptance criteria through the implementation.
> 2. **PRD Compliance** — Does the implementation match what the PRD specifies for this feature? Check data models, API contracts, business rules, and naming against the PRD. Check DECISIONS.md for authorized deviations. Flag unauthorized deviations.
> 3. **Architectural Rules** — Does it follow CLAUDE.md rules? (Convex-only backend, Bun only, no banned packages, etc.)
> 4. **Edge Cases** — For each requirement in this task, what's the unhappy path? Is it handled? Check boundary conditions and validation.
> 5. **Security** — No prompt injection vectors, user content treated as untrusted, no OWASP top 10 issues.
> 6. **Integration** — Will this break existing code? Are imports correct? Are types consistent with shared packages?
>
> **Scoping Rules:**
>
> - Only review code changed in THIS task. Don't audit the whole codebase.
> - If something is missing but is clearly assigned to a future task, check Taskmaster to confirm, then **do not report it**.
> - Do not flag style/formatting issues — `bun check` handles that.
> - Do not suggest refactors or "nice to haves" — only flag real problems.
>
> **Output Format:**
>
> For each issue found:
>
> - **Severity**: Critical | High | Medium | Low
> - **File(s)**: path:line_number
> - **Issue**: What's wrong
> - **Expected**: What the PRD/task/CLAUDE.md says should happen
> - **Actual**: What the code does
> - **Fix**: Concrete suggestion
>
> Then a summary:
>
> - Total issues by severity
> - Verdict: **Ship it** / **Fix and ship** / **Needs rework**
> - If "Fix and ship": list only the Critical and High items that must be fixed before marking done

## Project Root

{{PROJECT_ROOT}}
