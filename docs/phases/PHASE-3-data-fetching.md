# Phase 3 — Data Fetching & Race Conditions

**Status: IMPLEMENTED** (2026-08-01) — done *before* Phase 2, so it covers all
nine client fetches rather than just the leftovers.

| Item | State |
|---|---|
| Abort/cleanup on every mount fetch | ✅ done |
| Stale-response guarding | ✅ done |
| Request de-duplication | ✅ done |
| Response caching across mounts | ✅ done |
| Duplicated lang/dir effects | ⏭️ deferred to Phase 2.6 |

**What was built**

- `src/lib/contentCache.js` — shared fetch layer: TTL cache, request
  de-duplication, and **reference-counted cancellation** (the underlying request
  aborts only once every consumer detaches, so one unmounting component cannot
  kill another's in-flight data).
- `src/hooks/useEditableContent.js` — replaces the copy-pasted
  `useEffect`+`fetch`+`setData`/`setTempData` block in **9 components**.

**Components converted:** `Hero`, `AboutFeatures`, `CollectionsSection`,
`FeaturedProductsSection`, `CurtainHelpSection`, `Footer`, `about/page`,
`quotation/page`, `collections/[category]/Client`. Plus `showforms/page`, which
keeps its own fetch (filters/pagination) but gained `AbortController`.

> `CurtainHelpSection.js` also fetched (`/home/contact/`) — it was missing from
> the original audit list. Nine fetches, not eight.

**Verified:** 7/7 unit tests on the cache layer (dedup, partial release, final
release aborts, double-release safety, cache round-trip); production build
clean; all 7 API endpoints and 5 routes return 200.

---

**Effort:** 1 day · **Impact:** correctness, wasted network/CPU

Originally scoped to run *after* Phase 2, on the assumption most client fetches
would have moved server-side. Phase 2 has not run yet, so all nine were fixed
in place — none of this work is wasted, since the hook is what Phase 2 will feed
server-fetched data into.

---

## The three problems

### 1. No cleanup on any client fetch

Not a single `useEffect` fetch in the codebase uses an `AbortController` or returns a cleanup function:

| File | Lines | Endpoint |
|---|---|---|
| `frontend/src/components/Home/Hero.js` | 200–224 | `/home/hero/` |
| `frontend/src/components/Home/FeaturedProductsSection.js` | 250–274 | `/home/industry/` |
| `frontend/src/components/Home/CollectionsSection.js` | 254–278 | `/home/service/` |
| `frontend/src/components/Home/AboutFeatures.js` | 197–221 | `/home/about/` |
| `frontend/src/components/Footer.js` | 218–242 | — |
| `frontend/src/app/collections/[category]/Client.js` | 257–305 | `/home/cards/` |
| `frontend/src/app/about/page.js` | 379–403 | `/about/capabilities/` |
| `frontend/src/app/quotation/page.js` | 420–444 | — |
| `frontend/src/app/showforms/page.js` | 117–154 | contact submissions |

**Consequence:** if a user navigates away mid-fetch, the request completes anyway (wasted bandwidth and CPU) and `setState` fires on an unmounted component. React 19 no-ops this rather than warning, so it's silent — but on a slow connection with a user clicking through nav links, it's several abandoned in-flight requests competing for bandwidth with the page they actually want.

### 2. No request de-duplication or shared cache

On `/` alone, four components independently hit four different endpoints with no shared fetcher, no cache, and no coordination. There's no SWR, no React Query, and no use of Next.js `fetch` cache options.

Every full page load = 4 sequential client round trips *after* hydration, each with its own spinner. This is the direct cause of the LCP/TBT numbers — nothing is visible until JS parses, hydrates, *then* fetches.

### 3. Duplicated side effects

`Navbar.js:33-46` manages language/direction state in a `useEffect` that duplicates the inline script in `layout.js:39-53` **and** the `useEffect` in `page.js:13-20`. Three separate places writing `document.documentElement.lang/dir` on load.

*(Covered in Phase 2.6 — listed here for completeness.)*

---

## 3.1 — Add AbortController to remaining client fetches

After Phase 2, the fetches that legitimately stay client-side are:
- `quotation/page.js` — form submission and admin data
- `showforms/page.js` — admin dashboard with filters/pagination
- Post-mutation refresh calls in admin edit components

**Standard pattern:**
```js
useEffect(() => {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(endpoint, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) {
      if (err.name === 'AbortError') return;   // expected on unmount
      setError(err);
    } finally {
      setLoading(false);
    }
  })();

  return () => controller.abort();
}, [endpoint]);
```

- [ ] Applied to every remaining client-side fetch
- [ ] `AbortError` explicitly swallowed (not surfaced as a user-facing error)
- [ ] `finally` block doesn't set loading state after an abort

> **Careful with `finally`:** on abort, the component is unmounting — setting `loading` there is harmless but pointless. If your error UI flashes on navigation, move the `setLoading(false)` into the success/error branches instead.

---

## 3.2 — Stale-response guarding on `/showforms`

`showforms/page.js` is the one place with genuinely racing requests: filters and pagination can change faster than responses return, so an older slower request can overwrite a newer one.

Its structure is already the best in the codebase — endpoint memoized via `useMemo` on `[apiUrl, page, pageSize, appliedFilters]` (`94-109`), fetch memoized with `useCallback` (`117-154`). It just needs abort:

- [ ] `AbortController` keyed to the memoized endpoint — when the endpoint changes, the previous request aborts, which inherently prevents stale overwrites

---

## 3.3 — Shared fetching for anything still duplicated client-side

If, after Phase 2, multiple client components still call the same endpoint, add a shared layer rather than letting each fetch independently.

**Options, cheapest first:**
1. **Next.js server-side `fetch` caching** — free deduplication if the data moved server-side in Phase 2. Prefer this.
2. **A tiny in-memory cache** keyed by URL, if only 2–3 call sites remain.
3. **SWR or React Query** — only if you end up with meaningful client-side data needs (revalidation, optimistic updates on admin saves). Adds a dependency; don't add it just for the homepage.

- [ ] No endpoint is fetched by more than one client component
- [ ] Decision recorded: _______________________

---

## 3.4 — Modal body-scroll effect

`Client.js:307-317` toggles `document.body.style.overflow` in a `useEffect` for modal state. This is correct and has cleanup — no change needed. Noted only because it's one more effect that can't run before hydration, so the modal is non-functional until JS loads. Acceptable for a modal.

- [ ] Confirmed no change needed

---

## Verification

- [ ] Open DevTools Network, throttle to Slow 3G, click rapidly between routes — abandoned requests should show as **cancelled**, not completed
- [ ] On `/showforms`, change filters rapidly — the final rendered result must match the *last* filter applied, never an earlier one
- [ ] React DevTools Profiler: confirm no repeated re-render loops from unstable effect dependencies
- [ ] No console errors on rapid navigation

---

## Exit criteria

- [ ] Every remaining client-side fetch has `AbortController` cleanup
- [ ] `AbortError` handled distinctly from real errors
- [ ] No duplicate fetches of the same endpoint across components
- [ ] Rapid filter/navigation changes produce correct final state
