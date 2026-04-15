# live-coding-interviews

Personal training ground for React + TypeScript live coding interviews, run through [Claude Code](https://claude.com/claude-code) skills.

Four Claude Code skills chain together to scaffold a timed exercise, act as an in-character interviewer during the session, and deliver a scored verdict with Socratic coaching afterwards — so every round reproduces the pressure, the persona, and the feedback loop of a real on-site round.

## The training loop

```
train-live-coding-interview  →  (60 min of coding)  →  interview-veredict
           ↑                                                   ↓
           └─────────── ask-interviewer ←────────── coaching mode
                         (mid-session)                 (post-session)
```

1. **Scaffold the exercise** — `train-live-coding-interview` picks a random React + TS exercise at the requested difficulty, scaffolds a fresh Vite project via `setup-interview-project`, writes a `BRIEF.md` into the new dir, and arms a three-stage desktop-notification timer at 45 / 55 / 60 minutes.
2. **Code for an hour** — open the project in your IDE, disable all AI autocomplete, read `BRIEF.md`, and go. Commit at meaningful checkpoints.
3. **Ask the interviewer mid-session** — when stuck or unsure, call `ask-interviewer` with a question. It stays in persona, matches the abstraction level of your question, and never writes code for you.
4. **Get the verdict** — when done (or when the clock kills you), run `interview-veredict`. It reads your code + `BRIEF.md`, runs `pnpm tsc` and `pnpm test`, scores you against a fixed senior rubric, and writes the report to `<training-dir>/VEREDICT.md`.
5. **Coach through the gaps** — the same skill then walks you Socratically through the top gaps one at a time. You type the fixes; it only nudges. Each gap closed is appended to `VEREDICT.md` under `## Coaching outcomes`.

## The skills

| Skill | Phase | What it does | Writes? |
|---|---|---|---|
| [`setup-interview-project`](.claude/skills/setup-interview-project/SKILL.md) | setup | Scaffolds a Vite + React + TS project with pnpm, Jest, ts-jest, RTL, and Prettier pre-configured. Used by the train skill — rarely invoked directly. | yes — new project |
| [`train-live-coding-interview`](.claude/skills/train-live-coding-interview/SKILL.md) | start | Picks a level (`beginner` / `intermediate` / `expert` / `random`), rolls an exercise from an internal catalog, delivers the brief in Senior Frontend Interviewer persona, scaffolds the project, writes `BRIEF.md`, and arms the 60-minute timer. | `BRIEF.md` + new project |
| [`ask-interviewer`](.claude/skills/ask-interviewer/SKILL.md) | mid-session | Conversational Socratic advisor. Names concepts, asks leading questions, points at `file:line` — never writes code, never proposes a solution, never says yes/no on your approach. Matches the abstraction level of your question. | nothing |
| [`interview-veredict`](.claude/skills/interview-veredict/SKILL.md) | post-session | Read-only grading against a fixed senior rubric (8 signals × /10 → /80 + %). Emits `VEREDICT.md` with verdict, score, rubric table, top gaps, and a coaching sequence. Then coaches you through each gap Socratically. | `VEREDICT.md` only |

The four share a single **Senior Frontend Interviewer** persona — terse but encouraging, asks "why" not "what", refuses to hand over solutions, grades against a generic senior bar regardless of the declared exercise level.

## Typical session

```
# 1. Scaffold
Ask Claude Code: "give me an intermediate mock interview"
→ creates training-<slug>-YYYY-MM-DD/ with BRIEF.md and a running timer

# 2. Code for ~60 min in your IDE
#    (disable Copilot / JetBrains AI / Cursor Tab)

# 3. Mid-session, when stuck:
/ask-interviewer how should I model the cart state?
/ask-interviewer is useReducer worth it here?
/ask-interviewer stuck — the filtered list re-renders on every keystroke

# 4. Time's up — get the verdict
/interview-veredict
→ writes training-<slug>-YYYY-MM-DD/VEREDICT.md
→ enters coaching mode for the top gaps
```

## Repo layout

```
.claude/skills/          # Claude Code skills (interview trilogy + general-purpose tools)
training-<slug>-<date>/  # one-shot exercise workspaces — one per session, never re-run
  BRIEF.md               # exercise spec written by train-live-coding-interview
  VEREDICT.md            # scored report + coaching outcomes written by interview-veredict
  src/                   # your solution
```

Each `training-*` directory is a **one-shot** exercise — the goal is reproducing interview pressure, not iterating endlessly on one problem. If you want another crack at the same shape of problem, start a fresh round.

## Requirements

- [Claude Code](https://claude.com/claude-code) CLI, with the skills in `.claude/skills/` discoverable.
- Node 20+, [pnpm](https://pnpm.io/) (via `corepack enable`).
- macOS for the timer's desktop notifications (`osascript`). Other platforms work for everything except the timer.
- IntelliJ IDEA / VS Code / any editor — **with AI autocomplete disabled during practice**.

## Ground rules

- No AI autocomplete during the coding hour (Copilot, JetBrains AI, Cursor Tab).
- Think out loud. Ask clarifying questions via `ask-interviewer`.
- Commit at meaningful checkpoints — commit hygiene is graded.
- The interviewer will not write code for you. Not mid-session, not during coaching.
