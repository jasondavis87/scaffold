# Instructions

This directory contains documentation and templates for the AI-first development workflow.

## Workflow

1. **Setup** — Run `scripts/setup.sh` to customize the template (project name, features)
2. **Write PRD** — Write your product requirements document
3. **Save PRD** — Save to `.taskmaster/docs/prd.txt`
4. **Parse** — Run `tm parse-prd --input=.taskmaster/docs/prd.txt` to generate TaskMaster tasks
5. **Build** — Use `instructions/TASK-PROMPT.md` as your prompt when starting each task

## Files

| File | Purpose |
|------|---------|
| `TASK-PROMPT.md` | Copy-paste prompt for starting each TaskMaster task |
| `DECISIONS.md` | Tracks implementation decisions that deviate from the PRD |
| `PROJECT-STRUCTURE.md` | Monorepo layout and "what goes where" guide |
| `V0-TEMPLATE.md` | V0 design prompt template + usage guide |
