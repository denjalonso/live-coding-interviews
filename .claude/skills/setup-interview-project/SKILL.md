---
name: setup-interview-project
description: Scaffolds a Vite + React + TypeScript project with pnpm, Jest, ts-jest, React Testing Library, and Prettier pre-configured for live coding interviews or practice. Use when the user wants to set up an interview project, scaffold a practice repo, or mentions "live coding interview setup".
---

# Setup Interview Project

Creates a new Vite + React + TypeScript project under the current working directory with Jest + React Testing Library + Prettier wired up and a passing sample test. Designed for time-boxed interview prep where setup shouldn't eat into coding time.

## Quick start

From the directory where you want the project created:

```bash
bash .claude/skills/setup-interview-project/scripts/setup.sh [name]
```

- `name` (optional) — project directory name. Defaults to `interview-YYYY-MM-DD` based on today's date.
- Fails fast if the target directory already exists.

After it completes:

```bash
cd <name>
pnpm dev            # start the dev server
pnpm test           # run Jest
pnpm format         # format with Prettier
pnpm format:check   # verify formatting in CI-style
```

## What the script does

1. Scaffolds via `pnpm create vite@latest <name> --template react-ts`
2. Runs `pnpm install`
3. Installs dev deps: `jest`, `@types/jest`, `ts-jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `identity-obj-proxy`, `prettier`
4. Writes `jest.config.cjs` (CJS because Vite sets `"type": "module"`)
5. Writes `jest.setup.ts` importing `@testing-library/jest-dom`
6. Writes `__mocks__/fileMock.cjs` for static asset imports
7. Writes `.prettierrc.json` and `.prettierignore`
8. Adds `test`, `format`, and `format:check` scripts to `package.json`
9. Writes `src/__tests__/App.test.tsx` using RTL
10. Runs `pnpm format` to format the scaffold
11. Runs `pnpm test` to verify the sample test passes

## Before the interview

The script only handles the scaffold. The interview prep email also asks you to:

- Disable inline code completion (Copilot, Cursor Tab, etc.)
- Confirm screen sharing works

These are out of scope — handle them manually.
