# Exercise Catalog

Each exercise is scoped to ~60 minutes for a live coding round. Deliver the core first, then stretch. Vanilla React + TS by default — only reach for a library if it genuinely saves time and the candidate can justify it.

Levels follow midudev/preguntas-entrevista-react conventions: **beginner** (fundamentals, local state, events), **intermediate** (effects, data fetching, derived state, forms, a11y), **expert** (architecture, generics, state machines, perf, complex UX).

## Beginner

1. **Counter with history** — `+` / `-` / `reset`; render last 10 values; undo button.
2. **Tic Tac Toe** — 3x3 board, win and draw detection, reset, winner banner.
3. **Password generator** — length slider, toggles (lower / upper / digits / symbols), copy-to-clipboard button.
4. **Dice roller (D&D style)** — roll N dice of M sides, show each face and the total, roll history.
5. **FizzBuzz component** — numeric input N, render the list, bonus: configurable word mapping.
6. **Stopwatch** — start / stop / lap / reset, millisecond precision, laps list.
7. **Rock / Paper / Scissors** — pick vs. random CPU, score, best-of-5 mode.
8. **Temperature converter** — Celsius ↔ Fahrenheit, bidirectional inputs, graceful handling of non-numeric input.

## Intermediate

1. **Movie search** — debounced search against OMDB or a mocked API; loading / empty / error states; typed fetch layer; abort on unmount.
2. **Pokedex** — infinite scroll list, per-card detail fetch on click, in-memory cache, skeleton loaders.
3. **Shopping cart** — product grid, add / remove / quantity, line totals + grand total, persisted to localStorage, clear cart.
4. **Tip calculator** — bill amount, tip %, party size; derived per-person total; a11y-correct labels and live regions.
5. **Form with validation (no library)** — multi-field form (name, email, password, confirm), per-field errors, submit-disabled rule, show errors on blur.
6. **Giphy infinite scroll** — search + IntersectionObserver-driven pagination, request deduping, cancel stale fetches.
7. **Notion-lite outliner** — add / delete / reorder blocks, keyboard-only navigation (arrows, enter, backspace, tab to indent).
8. **Weather dashboard** — city search, current conditions + 5-day forecast, unit toggle (°C / °F), handle API errors.
9. **Markdown previewer** — textarea on the left, rendered preview on the right, debounced render, XSS-safe.

## Expert

1. **Trello-lite kanban** — columns and cards, drag-and-drop (HTML5 DnD or dnd-kit), optimistic updates, persist to localStorage.
2. **Twitter-lite feed** — infinite scroll, compose box, like / unlike with optimistic update, normalized client state.
3. **Chat UI with streaming reply** — message list, token-by-token streaming reply (mocked), auto-scroll-to-bottom with user-override, virtualized list.
4. **File uploader with chunking** — parallel chunk upload (mocked endpoint), progress per chunk and overall, retry on failure, resume support.
5. **Generic `<DataGrid<T>>`** — column config (key, header, render, sort fn), sort, filter, keyboard navigation, strong generics, no `any`.
6. **`useFetch` custom hook** — generic, typed, in-memory cache, abort, stale-while-revalidate; prove correctness with RTL + Jest tests.
7. **Spotify-lite player** — player state machine (`idle` / `loading` / `playing` / `paused` / `buffering` / `error`), mocked audio, queue with next / prev, keyboard shortcuts.
8. **Real-time collaborative counter** — two tabs sync via `BroadcastChannel`, last-write-wins conflict resolution, show peer count.
9. **Autocomplete combobox (ARIA-compliant)** — async options, keyboard nav, screen-reader-friendly (`role="combobox"`, `aria-activedescendant`), debounced fetch.
