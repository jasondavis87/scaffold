# Instructions

This directory contains documentation and templates for the AI-first development workflow.

## Workflow

1. **Setup** — Run `scripts/setup.sh` to customize the template (project name, features)
2. **Write PRD** — Use `PRD-TEMPLATE.md` to write your product requirements document
3. **Save PRD** — Save to `.taskmaster/docs/prd.txt`
4. **Parse** — Run `tm parse .taskmaster/docs/prd.txt` to generate TaskMaster tasks
5. **Build** — Run `tm next` to get the next unblocked task, build it, mark done, repeat

## Files

| File | Purpose |
|------|---------|
| `PRD-TEMPLATE.md` | Fill-in-the-blank PRD structured for TaskMaster parsing |
| `LANDING-PAGE-TEMPLATE.md` | Landing page design spec template |
| `TASK-PROMPT-TEMPLATE.md` | Prompt template for `tm parse` |
| `PROJECT-STRUCTURE.md` | Monorepo layout and "what goes where" guide |
| `V0-TEMPLATE.md` | V0 design prompt template + usage guide |
