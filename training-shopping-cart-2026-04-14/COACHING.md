# Coaching Outcomes — Shopping Cart (2026-04-14)

Interviewer feedback on the 60-minute shopping cart round, plus the state-shape-first walkthrough to study for next time. Keep your own `src/` untouched — this file is the reference, the assembly is still your exercise.

---

## Verdict

**Level:** Intermediate
**Result:** Below the intermediate bar. At 60 minutes you had ~15% of core scope working (product grid + naive add-to-cart pushing duplicates into an array). A passing attempt would have had all six core requirements working by ~45 minutes.

**Root cause:** You started writing JSX before modeling the state. Everything else downstream (broken type, no quantity controls, no totals, no persistence) traced back to that one missed decision.

**Process red flag:** Zero commits in 60 minutes, scaffold test left failing — both signals that "commit at checkpoints" and "run tests as you go" weren't habits yet.

## Requirements status

| Requirement | Status |
|---|---|
| Product grid (6+ items) | ✅ renders |
| Add to cart | ⚠️ partial — pushes a new entry on every click instead of incrementing quantity |
| Quantity controls (+/−/remove) | ❌ missing |
| Line total + grand total | ❌ missing |
| Currency formatting | ❌ missing |
| Empty state | ❌ missing |
| Persistence (localStorage) | ❌ missing |
| Clear cart | ❌ missing |

## Code-level feedback

**1. The cart type was broken.** `src/App.tsx:26-29`:

```ts
type CartProducts = { quantity: number; total: number } & Products[]
```

`Products` is already `ProductProps[]`, so `Products[]` is a 2D array, and `&`-ing an object type onto an array type is nonsense — `quantity` and `total` are unreachable and never used. The working model is:

```ts
type CartLine = { productId: string; quantity: number }
type Cart = CartLine[]
```

**A cart line is not a product.** Don't spread a product into cart state — store the id + quantity, look up the product by id when rendering. This alone makes "add same item twice → quantity becomes 2" trivial.

**2. Totals should be derived, not stored.** The brief called this out explicitly. `total` in the type was the right instinct, wrong place — compute it in the render (or `useMemo`) from `cart.reduce(...)`.

**3. Circular import.** `App.tsx` imports `Product`, `Product.tsx` imports `Card` from `App.tsx`. ESM hoisting saves you here, but it's a smell. `Card`/`Grid` belong in their own file, or inline.

**4. Dead abstractions.** `Grid` uses `display: grid` with no `grid-template-columns`, and `Card` uses `gridRow: 'auto'` which does nothing. `ProductGrid` is a one-line wrapper around `Grid`. Three components, zero layout.

**5. Add-to-cart duplicated rows.** Click "Add" twice on product 1 and you saw it twice in the cart — no dedupe, no quantity increment. Direct consequence of the broken state shape.

**6. The scaffold test was failing.** `src/__tests__/App.test.tsx` still looked for an `<h1>`, which `App.tsx` never rendered. Leaving it red is a signal that you weren't running tests during the hour.

**7. Currency as raw integers.** `price: 100` rendered as `100` — for an e-commerce UI, unshippable. `new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price / 100)` is 3 lines and a huge polish signal. The brief hinted: *"price in cents"*.

**8. No a11y.** `<ul>` of stringified products, no labels on quantity controls (because there were none), no live region when the cart updates. Table stakes for senior.

---

## State-shape-first walkthrough

### Step 1 — Model the data before any JSX

```ts
type Product = {
  id: string
  name: string
  priceCents: number  // always integer cents
  image?: string
}

type CartLine = {
  productId: Product['id']
  quantity: number  // invariant: always >= 1
}

type Cart = CartLine[]
```

Two invariants baked in:
1. **Prices are integers** (cents). Floats + money = rounding bugs.
2. **Quantity is always ≥ 1.** Decrementing at 1 removes the line, it doesn't set quantity to 0.

Why `CartLine[]` and not `Record<string, number>`? Both work. Array preserves insertion order (items stay where you added them). For 6 products the perf difference is zero — pick the array for the ordering.

### Step 2 — Pure operations on the cart

Write these as plain functions outside the component. Trivial to unit-test, force you to think in transitions.

```ts
function addToCart(cart: Cart, productId: string): Cart {
  const existing = cart.find(line => line.productId === productId)
  if (existing) {
    return cart.map(line =>
      line.productId === productId
        ? { ...line, quantity: line.quantity + 1 }
        : line
    )
  }
  return [...cart, { productId, quantity: 1 }]
}

function setQuantity(cart: Cart, productId: string, quantity: number): Cart {
  if (quantity <= 0) {
    return cart.filter(line => line.productId !== productId)
  }
  return cart.map(line =>
    line.productId === productId ? { ...line, quantity } : line
  )
}

function removeFromCart(cart: Cart, productId: string): Cart {
  return cart.filter(line => line.productId !== productId)
}
```

**Decrement is just `setQuantity(cart, id, currentQty - 1)`** — the `quantity <= 0` branch handles removal. Three operations do the work of five.

For bonus points, a `useReducer` with a discriminated union — exhaustiveness checking makes illegal states unrepresentable:

```ts
type CartAction =
  | { type: 'add'; productId: string }
  | { type: 'setQuantity'; productId: string; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }

function cartReducer(cart: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'add':         return addToCart(cart, action.productId)
    case 'setQuantity': return setQuantity(cart, action.productId, action.quantity)
    case 'remove':      return removeFromCart(cart, action.productId)
    case 'clear':       return []
  }
}
```

For 60 min, `useState` + the pure functions is fine. For 90 min or a take-home, `useReducer` is cleaner.

### Step 3 — Derive everything else

Nothing below this line belongs in state. All of it is a function of `cart` + `products`.

```ts
const productsById = useMemo(
  () => new Map(products.map(p => [p.id, p])),
  [products]
)

const lineItems = useMemo(
  () =>
    cart
      .map(line => {
        const product = productsById.get(line.productId)
        if (!product) return null
        return {
          ...line,
          product,
          lineTotalCents: product.priceCents * line.quantity,
        }
      })
      .filter(Boolean),
  [cart, productsById]
)

const subtotalCents = useMemo(
  () => lineItems.reduce((sum, li) => sum + li!.lineTotalCents, 0),
  [lineItems]
)
```

Currency formatter — **once, outside the component**:

```ts
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function formatCents(cents: number): string {
  return currency.format(cents / 100)
}
```

### Step 4 — Persistence

```ts
const STORAGE_KEY = 'cart-v1'  // version the key

const [cart, setCart] = useState<Cart>(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []  // corrupted JSON — recover silently
  }
})

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}, [cart])
```

Three things to watch for:
1. **Lazy initializer** (`useState(() => ...)`). NOT `useState(JSON.parse(...))` — the latter parses every render.
2. **Try/catch on the parse.** Corrupted JSON is a real production bug.
3. **Versioned key** (`cart-v1`). When you change the shape later, you don't explode existing users' carts.

What to **not** do: read from localStorage inside `useEffect` on mount. That causes a render with `[]`, then a render with the real cart — flicker.

### Step 5 — Accessibility, cheaply

Four moves buy most of the a11y points:

1. Use real elements. `<button>`, `<ul><li>`, `<label htmlFor=...>`.
2. Label quantity controls with `aria-label`:
   ```tsx
   <button aria-label={`Decrease quantity of ${product.name}`}>−</button>
   ```
3. Announce totals changes with a live region:
   ```tsx
   <p aria-live="polite" aria-atomic="true">
     Subtotal: {formatCents(subtotalCents)}
   </p>
   ```
4. Keyboard works for free if you used real buttons. Never put click handlers on `<div>`.

### Step 6 — One RTL test that proves the pipeline

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('shopping cart', () => {
  it('updates the subtotal when an item is added', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText(/subtotal: \$0\.00/i)).toBeInTheDocument()

    const firstAdd = screen.getAllByRole('button', { name: /add to cart/i })[0]
    await user.click(firstAdd)

    expect(screen.getByText(/subtotal: \$1\.00/i)).toBeInTheDocument()
  })
})
```

One test, six requirements covered: grid renders, add wired, state update works, derivation works, formatting works, cart panel renders.

---

## Pacing checklist for next round

Write this into a scratch file at the start of every training session and tick as you go.

```
[ ] 0:05 — types defined (Product, CartLine, Cart)
[ ] 0:15 — product grid renders, FIRST COMMIT
[ ] 0:30 — add/remove/setQuantity working in memory, SECOND COMMIT
[ ] 0:40 — currency formatting + empty state + clear, THIRD COMMIT
[ ] 0:50 — localStorage round-trip, FOURTH COMMIT
[ ] 1:00 — one RTL test + a11y polish, FINAL COMMIT
```

**If you slip a checkpoint, cut scope — don't catch up.** Missing persistence with everything else solid beats having all features half-broken.

## Concepts to drill

- **State shape design** — write `type State` + `type Action` before any component.
- **Derived state with `useMemo`** — totals, filtered lists, counts.
- **Functional state updates** — `setCart(cart => ...)`, pure updater functions.
- **`Intl.NumberFormat` / `Intl.DateTimeFormat`** — constant in frontend rounds.
- **`useLocalStorage` pattern** — lazy initializer + `useEffect` pair, or a custom hook.
- **`useReducer` vs. `useState`** — know when each fits; reducer is textbook for 4+ actions.
- **RTL fundamentals** — `getByRole`, `userEvent.click`, asserting on rendered text.
- **Pacing discipline** — commit every 10–15 min, cut scope not corners.

## Overall verdict

Not a passing round, but the fix is a **concept gap, not a React gap**. You can type React fine — you just started coding before you modeled the problem. That's the most fixable interview failure mode there is.
