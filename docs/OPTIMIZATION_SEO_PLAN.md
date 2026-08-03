# Performance & SEO Remediation Plan

> **This is the summary overview.** The detailed, implementable per-phase docs live in [`docs/phases/`](./phases/README.md) — start there when doing the work.

Baseline (Lighthouse, mobile-ish run, 2026-08-01): **Performance 36**, Accessibility 85, Best Practices 96, SEO 91.
Key numbers: LCP 35.5s, TBT 2,480ms, Speed Index 11.1s, total network payload 12.4MB, main-thread work 9.0s, unused JS 1,154KB, image savings available 1,475KB.

Root cause in one sentence: **every page is `"use client"`, fetches its content after hydration with no caching/dedup, ships full admin-CRUD UI to every visitor, and serves multi-MB unoptimized images/video straight out of Django with no CDN or cache headers.**

This doc is findings → phases, ordered so each phase is independently shippable and testable, with the highest score-impact work first.

---

## Phase 0 — Baseline & guardrails (0.5 day)
Do this before touching code so you can prove each later phase's impact.

- [ ] Run Lighthouse in incognito (the current run flagged IndexedDB skew) on `/`, `/collections/home`, `/about`, `/quotation`. Save as new baseline screenshots.
- [ ] Add `NEXT_PUBLIC_API_URL` to a real `.env.production` — several components fall back to `http://localhost:8000/api` when the env var is unset (`Hero.js:192`, `Client.js:248`, `quotation/page.js:402`). Confirm prod build actually has it set; this is a silent-breakage risk independent of perf.
- [ ] Decide/confirm the production media strategy (see Phase 3) before optimizing images, so work isn't redone.

---

## Phase 1 — Images & static assets (highest impact, ~1–2 days)
This alone should fix most of the 35.5s LCP and the 1.4MB+ image savings flagged by Lighthouse.

1. **Whitelist the backend image domain** in `frontend/next.config.mjs` via `images.remotePatterns` (dev `localhost:8000` + prod domain). This is *why* every product image currently has `unoptimized` forced on it.
2. **Remove `unoptimized` from `next/image` usages** now that remote patterns are set:
   - `frontend/src/app/collections/[category]/Client.js:1044-1051, 1250-1259, 1322-1328`
   - `frontend/src/components/Home/CollectionsSection.js:573-579`
   - `frontend/src/components/Footer.js:549-557`
   - `frontend/src/components/Home/FeaturedProductsSection.js:30-53` (`OptimizedImage`'s `isLocalImage` check — fix so backend-hosted images are treated as optimizable, not excluded)
3. **Shrink oversized static assets in `frontend/public`**: `curtains-logo.ico` (1.56MB serving as a 50×50 nav icon) → replace with a proper small favicon + separate optimized PNG/SVG for the nav logo; `curtains-hero.png` (2.39MB) and `curtains-background.png` (1.25MB, used as CSS `background-image` in `page.js:36` and `quotation/page.js:757`) → convert to WebP/AVIF and route through `next/image` instead of raw CSS `background-image` (CSS backgrounds bypass all Next.js image optimization).
4. **Re-encode/resize backend media** (`backend/media`, 97MB total, includes 3.6MB PNGs and duplicate ~730KB JPGs) — resize to realistic display dimensions and re-save as WebP before/at upload time, not just at render time.
5. **Videos**: 4 autoplaying MP4s (`home.mp4`/`office.mp4`/`medical.mp4`/`others.mp4`, ~1MB each) in `CollectionsSection.js:584-592` — add explicit `poster` images, keep `preload="metadata"`, and defer loading the `<video>` element itself until hover/intersection instead of mounting all 4 upfront.
6. Swap `bg-attachment: fixed` on `page.js:34-40` and `quotation/page.js:769-776` for a non-fixed background or a `next/image` layer — `bg-fixed` is a known scroll-jank cost, especially on mobile.

**Verify:** re-run Lighthouse; expect LCP to drop dramatically once the hero image path is optimized and no longer `unoptimized`.

---

## Phase 2 — Rendering strategy per page (page-by-page conversion, ~2–3 days)
Goal: move static/public content to the server, keep only genuinely interactive bits (admin edit mode, forms, modals) as client islands.

Recommended per-page target:

| Route | Current | Target | Why |
|---|---|---|---|
| `/` (`app/page.js`) | client, wraps 4 client sections | **server** page; each section (`Hero`, `AboutFeatures`, `CollectionsSection`, `FeaturedProductsSection`) fetches its data server-side and passes it as props into a small client component that only handles the admin edit toggle | No user interactivity needed for 99% of visitors; removes the post-hydration fetch waterfall that's the main TBT/LCP driver |
| `/collections` (`collections/page.js`) | client-side `router.replace` in `useEffect` | **server** `redirect()` from `next/navigation` | Avoids a blank-page flash and gives a real 308 instead of client-JS-dependent redirect |
| `/collections/[category]` | server wrapper (good) → `Client.js` (client, fetches in `useEffect`) | Keep server wrapper; have it fetch category data server-side via `generateMetadata`/page function and pass as initial props to `Client.js`, which keeps its edit/modal/upload interactivity but renders from server-provided data instead of an empty→loading→loaded flash | Already half-correct; just needs data pushed down instead of re-fetched client-side |
| `/about` | client, fetches in `useEffect`, has admin edit UI mixed with public content | **Split**: server component renders public content (fetched server-side, enables `generateMetadata`); extract the edit-mode UI into a small client child (`AboutEditControls`) mounted only when `isAdmin` | Public visitors get server-rendered content + real metadata; admin bundle isolated |
| `/quotation` | client, form + admin edit fetch | Stays client (form state, validation) — but split the admin edit UI into a lazy-loaded (`next/dynamic`) child so the public form path doesn't ship admin CRUD code | Genuine interactivity requirement, but bundle can still shrink |
| `/showforms` | client, admin dashboard | Stays client — add `export const metadata = { robots: { index: false } }` via a thin server wrapper, or a `robots.txt` disallow rule, since it's an internal admin page that shouldn't be indexed | Not a perf issue, but currently has no noindex directive |

Cross-cutting for this phase:
- Every admin-only edit UI (`isAdmin` checked via `localStorage.getItem("authToken")` in `Hero.js:195-198`, `Client.js:252-255`, and equivalents in `AboutFeatures.js`, `CollectionsSection.js`, `FeaturedProductsSection.js`, `Footer.js`) should be code-split with `next/dynamic(() => import(...), { ssr: false })` so the CRUD forms/upload handlers aren't in the initial bundle for anonymous visitors.
- Collapse the triple-redundant lang/dir logic (`layout.js:39-53` inline script, `Navbar.js:33-46` `useEffect`, `page.js:13-20` `useEffect`) into one place.

**Verify:** confirm `generateMetadata`/`metadata` exports now work per-page (impossible today since every page is client) and check Lighthouse SEO score improvement + reduced TBT from smaller client bundles.

---

## Phase 3 — Data fetching & race conditions (~1 day)
- Add `AbortController` cleanup to every `useEffect` fetch: `Hero.js:200-224`, `FeaturedProductsSection.js:250-274`, `CollectionsSection.js:254-278`, `AboutFeatures.js:197-221`, `Footer.js:218-242`, `Client.js:257-305`, `about/page.js:379-403`, `quotation/page.js:420-444`. Prevents wasted requests and setState-after-unmount when users navigate quickly.
- Once Phase 2 moves the homepage sections to server-side fetching, most of this client-fetch duplication disappears naturally — do Phase 2 first where possible, and only add AbortController to the fetches that genuinely must stay client (quotation form, showforms dashboard, admin edit saves).
- For any fetch that remains client-side and is called from multiple components, consider a shared fetch layer (even a simple in-memory cache keyed by URL) instead of each component independently calling the same `/home/...` endpoints.

**Verify:** rapid route-switching in dev tools Network tab should show cancelled (not completed) requests for abandoned fetches.

---

## Phase 4 — SEO implementation (~1–2 days, can run parallel to Phase 2)
Currently only `layout.js:11-22` has any `metadata` export, so every page shares one generic title/description with zero per-page SEO. This phase depends on Phase 2's server-component conversion (client components can't export `metadata`).

- [ ] Add `generateMetadata`/`metadata` per route once converted to server components: `/`, `/collections/[category]` (per-category title/description using the fetched category name), `/about`. Include unique `<title>`, meta description, canonical URL.
- [ ] Add Open Graph + Twitter card tags (none exist anywhere currently) — at minimum `og:title`, `og:description`, `og:image`, `twitter:card`.
- [ ] Add `frontend/src/app/robots.js` and `frontend/src/app/sitemap.js` (Next.js file-convention generators) — neither exists today. Sitemap should enumerate collection categories dynamically from the backend.
- [ ] Add JSON-LD structured data (Organization + Product/ItemList for collections) — none exists today.
- [ ] Set `robots: { index: false }` on `/showforms` (internal admin dashboard, currently fully indexable).
- [ ] Audit alt text: most images already have reasonable `alt` (`Client.js:1046`, `Footer.js:551`, `Navbar.js:81`) but confirm none are left empty/generic beyond intentionally-decorative ones (`Hero.js:20`'s empty alt on the background image is correct to keep).

**Verify:** Lighthouse SEO should move from 91 toward 100; spot-check rendered `<head>` per route (view-source, not devtools, since some pages are still partially client) for unique titles.

---

## Phase 5 — JS bundle trimming (~0.5–1 day)
- Remove unused dependencies from `frontend/package.json` if confirmed genuinely unused: `axios` (all fetches use native `fetch`), `sweetalert2` (no references found), and check whether `@react-three/fiber`/`@react-three/drei`/`@react-spring/three`/`three` are used anywhere — if not, remove; if used somewhere not yet reviewed, confirm and lazy-load via `next/dynamic`.
- Confirm `gsap` vs `framer-motion` — two animation libraries present; standardize on one where feasible to cut duplicate weight.
- Adopt `next/font` for whatever font is currently loaded (no `next/font` usage found anywhere) — self-hosts and preloads instead of a render-blocking external link.

**Verify:** `next build` bundle analyzer (`@next/bundle-analyzer`) before/after to confirm KB reduction; Lighthouse "Reduce unused JavaScript" and "Legacy JavaScript" audits should clear.

---

## Phase 6 — Backend delivery & caching (~1 day, infra-dependent)
- Django currently serves `/media/` via `static()` (`backend/backend/urls.py:17`), which is a **dev-only** helper — no `Cache-Control`, no gzip/brotli, no CDN, single-threaded-ish WSGI serving of binary files. For production, front media with Nginx/whitenoise/S3+CDN and set long `Cache-Control: public, max-age=31536000, immutable` on hashed/versioned assets.
- Add `Cache-Control` headers to the read-mostly API endpoints (home sections, collections, about) — currently none of the reviewed `api`/`contact` views set caching headers, so every visitor's server-side fetch (once Phase 2 lands) hits Django fresh every time.
- Fix duplicate `MEDIA_URL`/`MEDIA_ROOT` definitions in `backend/backend/settings.py:241-242` and `292-293`, and duplicate `CORS_ALLOW_ALL_ORIGINS = True` at lines 78 and 145 — config drift risk, not itself a perf fix but should be cleaned up while touching this file.

**Verify:** check response headers on `/media/...` and API endpoints in prod; confirm CDN/cache hit rate if a CDN is added.

---

## Suggested execution order
1. Phase 1 (images) — biggest score jump for least risk, no architecture change.
2. Phase 2 (rendering) — the structural fix that also unblocks Phase 4 (SEO metadata).
3. Phase 4 (SEO) — do alongside/immediately after Phase 2, route by route as each is converted.
4. Phase 3 (race conditions) — mostly resolved as a side effect of Phase 2; mop up what remains.
5. Phase 5 (bundle trimming) — cheap cleanup once the above stabilizes.
6. Phase 6 (backend caching/CDN) — coordinate with hosting/infra decisions.

Each phase should end with a Lighthouse re-run on the same 4 routes so you can attribute the score movement to the specific phase.
