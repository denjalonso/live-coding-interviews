# Live Coding Exercise — Shopping Cart

**Level:** Intermediate
**Time box:** 60 minutes (aim to finish core scope in ~45 min, leave ~10 min for polish, ~5 min buffer)
**Stack:** React 19 + TypeScript + Vite, Jest + React Testing Library, Prettier (already scaffolded)

---

## Problem statement

Build a small shopping cart experience: a product grid where the user can add items to a cart, adjust quantities, see
line totals and a grand total, persist the cart across reloads, and clear it. Assume the product catalog is a hardcoded
in-memory list — no network.

## Core requirements (~45 min)

- **Product grid** renders a hardcoded list of at least 6 products (id, name, price in cents, optional image
  placeholder). Each card has an "Add to cart" button.
- **Cart panel** shows line items with product name, unit price, quantity, line total, and a remove button. Show an
  empty state when the cart has no items.
- **Quantity controls** — increment, decrement, and a way to remove an item entirely. Decrementing to zero removes the
  item. Guard against negative quantities.
- **Totals** — per-line total and a grand total, formatted as currency. Totals must be derived from cart state, not
  stored separately.
- **Persistence** — cart survives a full page reload via `localStorage`. Reads on mount, writes on change. Handle a
  corrupted/missing value gracefully.
- **Clear cart** button with no-op when already empty.

## Stretch goals (only if core is solid)

- **Discount code input** — e.g. `SAVE10` applies 10% off the grand total. Invalid codes show an inline error.
- **Stock limits** — each product has a `stock` field; the "Add" button disables when the line quantity hits stock.
- **Unit tests** — at least one RTL test covering "add item updates grand total" and one for the localStorage
  round-trip (you can mock `localStorage`).

## Evaluation signals

I'll be paying attention to:

- **Component decomposition** — where state lives, what's a leaf vs. container, no prop-drilling soup.
- **State modeling** — shape of the cart (array vs. map keyed by productId?), how quantity updates are expressed, how
  totals are derived.
- **TypeScript quality** — no `any`, discriminated unions where they help, types that make illegal states
  unrepresentable.
- **Derivation vs. storage** — totals, line totals, item count should be computed, not synced.
- **Effects hygiene** — localStorage reads/writes in the right place, no re-write loops, handles JSON parse errors.
- **Testability** — can a reasonable RTL test be written against your components without heroic setup?
- **Accessibility** — buttons are buttons, quantity controls are reachable by keyboard, the cart announces changes in a
  sensible way (e.g. a live region or at least a focus-preserving update).
- **Loading / empty / error states** — empty cart, empty state on clear, corrupted localStorage recovery.
- **Keyboard UX** — you can add and remove items without touching the mouse.

## Ground rules

- **No AI autocomplete.** Disable Copilot, JetBrains AI Assistant, Cursor Tab — anything that completes more than the
  editor's built-in IntelliSense. You may read docs (MDN, React docs, TS handbook).
- **Think out loud.** Narrate the trade-offs as you make them. "I'm choosing a `Map` here because..." is the signal I'm
  hiring for.
- **Ask clarifying questions.** Any ambiguity in this brief is fair game — I'd rather you ask than guess silently.
- **Commit at checkpoints.** At minimum: after the product grid renders, after add-to-cart works, after persistence
  works. Meaningful commit messages, please.
- **Vanilla first.** Don't reach for Redux, Zustand, or a form library for this scope. If you feel the pull, justify it
  out loud.

Good luck — clock starts when you open the project.
