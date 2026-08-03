# Phase 2 — Rendering Strategy Per Page

**Effort:** 2–3 days · **Depends on:** Phase 1 recommended first · **Unblocks:** Phase 4 (SEO) · **Impact:** TBT 2,480ms → target < 200ms

The structural fix. Every page currently carries `"use client"` and fetches its content *after* hydration, producing a waterfall of: blank HTML → download JS → parse/hydrate → fetch → render. That waterfall is why LCP is 35.5s and TBT is 2,480ms.

It also means **no page can export `metadata`** — Next.js ignores metadata exports in client components — which is why all of Phase 4 is blocked until this lands.

---

## Guiding principle

> Render the public content on the server. Keep only genuinely interactive pieces — admin edit mode, forms, modals — as small client islands.

The admin edit UI is the reason most of these files became client components. But `isAdmin` is false for essentially every real visitor (checked via `localStorage.getItem("authToken")` in `Hero.js:195-198`, `Client.js:252-255`, and equivalents elsewhere). Everyone is paying the bundle and hydration cost for UI that only an admin ever sees.

---

## Target per route

| Route | Current | Target | Rationale |
|---|---|---|---|
| `/` (`app/page.js`) | client; wraps 4 client sections | **Server** page; each section fetches server-side, passes data as props into a thin client edit-toggle | No interactivity needed for public visitors; removes the 4-request post-hydration waterfall |
| `/collections` | client `router.replace` in `useEffect` | **Server** `redirect()` from `next/navigation` | Real 308 instead of a JS-dependent redirect + blank flash |
| `/collections/[category]` | server wrapper ✅ → `Client.js` fetches client-side | Keep wrapper; fetch server-side, pass as initial props | Already half-correct; just push data down |
| `/about` | client; fetch + admin UI mixed | **Split**: server public content + client `AboutEditControls` island | Enables `generateMetadata`; isolates admin bundle |
| `/quotation` | client; form + admin edit | **Stays client**; lazy-load admin UI via `next/dynamic` | Genuine form interactivity, but bundle can still shrink |
| `/showforms` | client admin dashboard | **Stays client**; add `noindex` | Internal tool; correctness fix only |

---

> **Phase 4 already landed the server-wrapper half of this phase.** Every route
> now has a thin server `page.js` rendering a sibling client component
> (`HomeClient.js`, `AboutClient.js`, `QuotationClient.js`,
> `ShowFormsClient.js`), and `/collections` is already a server `redirect()`.
> What remains here is moving **data fetching** into those wrappers and
> code-splitting the admin UI (§2.5) — the file surgery is done.

> **Phase 3 already landed.** All nine client fetches now go through
> `useEditableContent` / `contentCache`. When moving a section to the server,
> seed the hook with the server-fetched content rather than reinstating a bare
> `fetch` — the abort/dedup/cache behaviour still matters for the admin-edit
> path, which stays client-side.

## 2.1 — `/collections` → server redirect

Smallest change, do it first as a warm-up.

`frontend/src/app/collections/page.js:14-16` currently does a client-side `router.replace('/collections/home')` inside `useEffect`. This ships a JS bundle, hydrates, and *then* navigates — users see a blank flash, and crawlers may index an empty page.

**Replace the entire file with:**
```js
import { redirect } from 'next/navigation';

export default function CollectionsPage() {
  redirect('/collections/home');
}
```

- [ ] Converted; no `"use client"` remains
- [ ] Verify a real 307/308 in the Network tab, not a client navigation

---

## 2.2 — `/` homepage → server component

`frontend/src/app/page.js` has `"use client"` (line 1) but does no fetching itself. Its only client logic is a `useEffect` (13–20) setting `localStorage` lang/dir — which is **already duplicated** in two other places (see 2.6).

Its four children each fetch independently after hydration:

| Component | Endpoint | Fetch site |
|---|---|---|
| `Hero.js` | `/home/hero/` | `200-224` |
| `AboutFeatures.js` | `/home/about/` | `197-221` |
| `CollectionsSection.js` | `/home/service/` | `254-278` |
| `FeaturedProductsSection.js` | `/home/industry/` | `218-242` |

Four separate client round trips, each with its own loading spinner, none cached or shared.

**Do:**
- [ ] Remove `"use client"` from `app/page.js`
- [ ] Move the four fetches server-side. Either fetch in the page and pass props down, or make each section an `async` server component that fetches its own data (simpler, and they parallelize automatically).
- [ ] Use Next.js fetch caching (`{ next: { revalidate: 300 } }`) so the Django API isn't hit on every request
- [ ] Extract the WhatsApp button / any remaining `localStorage` logic into a tiny client child

### The Hero CLS problem

`Hero.js:461-470` renders a completely different DOM tree while `isLoading` — a plain black spinner section — then swaps in the real hero. Heights differ between states (`min-h-[650px]` vs. conditional `min-h-[1120px]`/`min-h-[720px]` at lines 474–481), causing a large content swap.

Server-rendering the hero eliminates this entirely: there is no loading state, because the data is already in the HTML. This should also improve the 0.055 CLS and fix the "Layout shift culprits" audit.

- [ ] Hero loading branch removed once data arrives via props

---

## 2.3 — `/collections/[category]` → push data down

`frontend/src/app/collections/[category]/page.js` is **already a server component** (good) with `generateStaticParams` (line 30) and `dynamicParams = true` (line 36). But it just renders `<CollectionsCategoryClient>`, which then fetches `/home/cards/` client-side (`Client.js:257-305`).

`Client.js` genuinely must stay client — it has edit mode, image upload, modals, and router navigation.

**Do:**
- [ ] Fetch the category data in the **server** `page.js` and pass it to `Client.js` as an `initialData` prop
- [ ] `Client.js` initializes its state from `initialData` instead of `null`, and skips the initial fetch
- [ ] Keep the client fetch only for post-mutation refresh (after an admin edit saves)
- [ ] The loading spinner path becomes unreachable on first paint

This is the pattern to follow for every "must stay client" component: **server fetches, client hydrates from props.**

---

## 2.4 — `/about` → split server content from admin island

`frontend/src/app/about/page.js` is `"use client"` (line 1) with a fetch at `379-403` and admin edit UI (`FiEdit2`/save/etc.) interleaved with public content.

**Do:**
- [ ] Convert `page.js` to a server component that fetches `/about/capabilities/` and renders the public content
- [ ] Extract edit-mode UI into `AboutEditControls.js` (client), mounted only when `isAdmin`
- [ ] Load it with `next/dynamic(() => import('./AboutEditControls'), { ssr: false })` so the CRUD code isn't in the public bundle
- [ ] Add `generateMetadata` (Phase 4 will fill in the content)

---

## 2.5 — Code-split every admin edit UI

This applies across the whole app and is worth a dedicated pass. Every one of these ships full admin CRUD — text inputs, selects, upload handlers, `FormData` logic — to anonymous visitors:

- `frontend/src/components/Home/Hero.js`
- `frontend/src/components/Home/AboutFeatures.js`
- `frontend/src/components/Home/CollectionsSection.js`
- `frontend/src/components/Home/FeaturedProductsSection.js`
- `frontend/src/components/Footer.js`
- `frontend/src/app/collections/[category]/Client.js`
- `frontend/src/app/about/page.js`
- `frontend/src/app/quotation/page.js`

**Pattern for each:**
```js
const EditPanel = dynamic(() => import('./EditPanel'), { ssr: false });
// ...
{isAdmin && <EditPanel {...props} />}
```

- [ ] Admin UI extracted into separate components
- [ ] All lazy-loaded via `next/dynamic` with `ssr: false`
- [ ] Verified in the bundle analyzer that admin code is in its own chunk

> This should be the largest single contributor to clearing the **"Reduce unused JavaScript — 1,154 KiB"** audit.

---

## 2.6 — Collapse the triple-redundant lang/dir logic

The same `document.documentElement.lang/dir` write happens in **three places**:

1. `frontend/src/app/layout.js:39-53` — inline `<script dangerouslySetInnerHTML>`
2. `frontend/src/components/Navbar.js:33-46` — `useEffect`
3. `frontend/src/app/page.js:13-20` — `useEffect`

Three redundant DOM writes on load, with possible layout thrash.

**Do:**
- [ ] Keep **only** the inline script in `layout.js` — it runs before paint and avoids a flash of wrong direction
- [ ] Delete the `useEffect` in `Navbar.js` and `page.js`
- [ ] Verify RTL still applies correctly on first paint with JS throttled

---

## 2.7 — `/quotation` and `/showforms`

Both stay client — but:

**`/quotation`** (`page.js:1`, fetches at `420-444`, POSTs at `561-567`):
- [ ] Lazy-load the admin edit UI (covered in 2.5)
- [ ] Consider a thin server wrapper so `metadata` can be exported (Phase 4)

**`/showforms`** (`page.js:117-154`):
- [ ] Leave the rendering as-is — it's an admin dashboard and correctly client-side. Its fetch logic is actually the cleanest in the codebase (`useMemo` endpoint at `94-109`, `useCallback` + effect at `117-154`).
- [ ] Add `robots: { index: false }` — this internal dashboard is currently fully indexable

---

## Verification

- [ ] View **source** (not DevTools Elements) on `/`, `/collections/home`, `/about` — the actual content text should be present in the HTML response
- [ ] Disable JavaScript entirely and reload — public content should still render
- [ ] Confirm `metadata` exports now work on converted pages (they'll be silently ignored if a page is still client)
- [ ] Bundle analyzer: admin chunks separated from the main bundle
- [ ] Lighthouse re-run on all 4 routes

**Expect:** large TBT drop (no more hydrate-then-fetch), LCP improvement, CLS improvement from removing the Hero loading swap.

Performance: ______ → ______  ·  TBT: ______ → ______  ·  Unused JS: 1,154KB → ______

---

## Exit criteria

- [ ] `/`, `/collections`, `/about` are server components
- [ ] `/collections/[category]` receives server-fetched initial data
- [ ] All admin edit UI is code-split behind `next/dynamic`
- [ ] Lang/dir logic exists in exactly one place
- [ ] Public content renders with JS disabled
- [ ] Lighthouse re-run captured

**Phase 4 (SEO) can now begin** — server components can export metadata.
