# Autocomplete Combobox (ARIA-compliant)

**Level:** Expert · **Time budget:** 60 minutes

## Problem statement

Build a reusable `<Combobox>` component: the user types into a text input, an async data source returns matching
options, and a listbox pops up below the input so the user can pick one with mouse or keyboard. It must be accessible to
screen-reader users following the WAI-ARIA 1.2 combobox pattern.

## Core requirements (~45 min)

- **Async options** — accept an `onSearch(query: string, signal: AbortSignal) => Promise<Option[]>` prop. Debounce
  input (~250ms) and abort stale requests so results never arrive out of order.
- **Keyboard navigation** — `ArrowDown` / `ArrowUp` move the active option (with wrap-around), `Home` / `End` jump to
  first / last, `Enter` selects, `Escape` closes the popup, `Tab` commits the active option (or closes without
  selecting — justify your choice).
- **ARIA wiring** — input has `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`,
  `aria-activedescendant` pointing at the active option's id. Listbox has `role="listbox"`; each option has
  `role="option"` and `aria-selected`. Do not move DOM focus into the list.
- **Loading / empty / error states** — render a visible status inside the popup for each, and mirror it via `aria-live`
  so screen readers hear it.
- **Strong types** — `<Combobox<T>>` is generic over the option type. Consumers pass `getOptionLabel` / `getOptionKey`.
  No `any`, no `unknown` leaks.

## Stretch goals (only if time permits)

- **Controlled + uncontrolled** modes for the selected value (`value` / `defaultValue` / `onChange`).
- **Highlight matched substring** inside each option label.
- **Jest + RTL test** covering: debounce, arrow-key navigation, Enter selection, Escape close, and
  `aria-activedescendant` updates.

## Evaluation signals

- **State shape first** — can you name every state slice (query, options, activeIndex, isOpen, status) and justify each
  before writing JSX?
- Component decomposition — what's the `<Combobox>` vs. what's a sub-component vs. what's a hook?
- TypeScript — generic constraints, discriminated union for the async status, no `any`.
- Accessibility — correct ARIA attributes, focus stays on the input, live region for async states.
- Race conditions — debounce + abort, never show stale results.
- Testability — is the logic in a hook you could unit-test?
- Loading / empty / error coverage.

## Ground rules

- **No AI autocomplete.** Disable Copilot / JetBrains AI / Cursor Tab before you start.
- **Think out loud.** I want to hear your reasoning, not just see the diff.
- **Ask clarifying questions.** Assumptions you don't surface are assumptions I'll challenge at review.
- **Commit at meaningful checkpoints** — roughly every 10–15 minutes. If you fall behind, cut scope rather than skip
  commits.
- **Vanilla first.** You may reach for a library only if you can justify the time saved on the spot.
