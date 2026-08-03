# Phase 5 — JS Bundle Trimming

**Status: IMPLEMENTED** (2026-08-01)

| Item | State |
|---|---|
| Remove unused dependencies | ✅ 6 removed |
| gsap vs framer-motion | ✅ gsap removed; framer-motion is the standard |
| `next/font` | ❌ **not applicable** — no webfont exists (see 5.4) |
| Bundle analyzer | ✅ added, `ANALYZE=true npm run build` |
| Minify / legacy-JS audits | ✅ verified already clean in prod (see 5.5) |

**Removed:** `axios`, `sweetalert2`, `gsap`, `@react-three/fiber`,
`@react-three/drei`, `@react-spring/three` — plus `three` transitively. All
confirmed at **zero import sites** by exhaustive grep before removal.

| Metric | Before | After |
|---|---|---|
| `node_modules` | 621 MB | **544 MB** |
| Production dependency tree | — | **60 packages, 6 direct** |
| First Load JS (shared) | 99.7 kB | 99.7 kB — **unchanged** |
| Homepage route JS | 599 KB | 599 KB — **unchanged** |

> ### The bundle did not shrink, and that is the expected result
>
> These packages were never imported, so tree-shaking had already excluded them
> from every bundle. Removing them buys a **77 MB smaller install**, faster CI,
> and less supply-chain surface — not fewer bytes shipped to users.
>
> Lighthouse's "Reduce unused JavaScript — 1,154 KiB" is therefore **not** about
> these packages. It is about code that genuinely ships: the admin edit UI in
> every section component, which loads for anonymous visitors who can never use
> it. That is **Phase 2.5**, and it remains the single largest bundle lever.

**Measured per-route JS** (uncompressed, production build):

| Route | Total JS | framer-motion? |
|---|---|---|
| `/` | 599 KB | yes |
| `/quotation` | 536 KB | yes |
| `/about` | 523 KB | yes |
| `/showforms` | 496 KB | yes |
| `/collections/[category]` | 417 KB | no |

Homepage serves 728 KB across 14 chunks uncompressed (~200 KB over the wire
with compression).

**Two findings that changed the plan** — see 5.4 and 5.5 below.

---

**Effort:** 0.5–1 day · **Impact:** install size, CI; *not* shipped bytes

Cheap cleanup once the architecture stabilizes. Lighthouse flags **1,154 KiB of unused JavaScript**, **22 KiB unminified**, **10 KiB legacy JS**, 5.0s of JS execution time, and 9.0s of main-thread work.

Phase 2.5 (code-splitting the admin UI) already addresses the largest chunk of this. This phase removes dead weight.

---

## 5.1 — Audit likely-dead dependencies

**Verify each before removing** — a single import anywhere keeps it in the bundle, and the audit that produced this list didn't read every file.

```bash
cd frontend
grep -rn "@react-three\|from 'three'\|sweetalert2\|axios\|gsap" src/
```

| Package | Version | Evidence | Action |
|---|---|---|---|
| `@react-three/fiber` | 9.3.0 | No usage found in any reviewed component | Remove if grep confirms zero imports |
| `@react-three/drei` | 10.6.1 | Same | Remove if unused |
| `@react-spring/three` | 10.0.1 | Same | Remove if unused |
| `three` | transitive | Pulled in by the above | Falls out with them |
| `axios` | ^1.11.0 | **Every** fetch in the codebase uses native `fetch` | Remove if grep confirms |
| `sweetalert2` | ^11.26.3 | No references found in any reviewed file | Remove if grep confirms |
| `gsap` | ^3.13.0 | No usage seen; `framer-motion` is used pervasively | See 5.2 |

The `@react-three/*` + `three` stack is a full 3D/WebGL runtime. If it's genuinely unused, that's the largest single removable item on the list.

- [ ] Grep run; results recorded
- [ ] Confirmed-unused packages removed from `package.json`
- [ ] `npm install` + `npm run build` clean
- [ ] Bundle analyzer confirms the size drop

---

## 5.1b — The remaining lever: framer-motion (deliberately not done)

`framer-motion` is the largest single library still shipping — a **108 KB chunk
loaded on 4 of 6 routes, including the homepage**. It is genuinely used:
71 references across 4 files (29 `motion.*` components, 13 `AnimatePresence`,
plus `whileInView` / `whileHover` / `whileTap`).

Two options, neither taken here:

1. **`LazyMotion` + `domAnimation`** — swap `motion.div` → `m.div` and wrap the
   trees in `<LazyMotion features={domAnimation}>`. Roughly halves the motion
   payload with no change to the animations themselves. This is the idiomatic
   fix and the one to try first.
2. **Replace with CSS** — viable for the plain fade/slide-ins, but
   `AnimatePresence` exit animations have no straightforward CSS equivalent, so
   this is a rewrite, not a trim.

**Why it was left alone:** both touch 71 animation call sites, and the browser
available in this environment does not reach this machine's dev server (it
resolves `localhost:3000` to an unrelated app), so the result could not be
visually verified. Silently broken animations are a worse outcome than 108 KB.
Do this when someone can watch the pages.

---

## 5.2 — Resolve the duplicate animation libraries

Both `framer-motion` (^12.23.12) and `gsap` (^3.13.0) are dependencies.

`framer-motion` (`motion` / `AnimatePresence`) is used pervasively:
- `frontend/src/app/about/page.js`
- `frontend/src/app/quotation/page.js`
- `frontend/src/components/Home/FeaturedProductsSection.js`
- `frontend/src/app/showforms/page.js`

`gsap` usage wasn't found in any reviewed file.

**Do:**
- [ ] If `gsap` is unused → remove it
- [ ] If it's used in one or two places → port those to `framer-motion` and remove `gsap`
- [ ] Standardize on one animation library going forward

> Even `framer-motion` is heavy. Where an animation is a simple fade/slide, a CSS transition is free and runs on the compositor. Worth revisiting if TBT is still high after this phase.

---

## 5.3 — Icon imports (already correct — verify only)

Both icon libraries use the correct tree-shakeable per-icon pattern, **not** barrel imports:
- `react-icons` — `import { FiEdit2, FiSave } from "react-icons/fi"` ✅
- `lucide-react` — `import { Edit, Save, X, Plus, Trash2 } from "lucide-react"` (`Footer.js:12`, `AboutFeatures.js`, `CollectionsSection.js`) ✅

- [ ] Confirmed no `import * as Icons` anywhere
- [ ] Consider standardizing on **one** icon library — two are currently shipping

---

## 5.4 — `next/font` — NOT APPLICABLE (verified)

> **Do not do this.** The original audit correctly found no `next/font` usage,
> but the recommendation does not apply here.
>
> `src/app/globals.css` contains exactly one line — `@import "tailwindcss";`.
> There is **no `@font-face`, no Google Fonts `<link>`, no `font-family`
> declaration anywhere** in the codebase. `layout.js` uses `font-sans`, which in
> Tailwind v4 resolves to the system UI font stack.
>
> The site loads **zero webfonts**, which is already the fastest possible
> outcome and contributes 0 ms of render-blocking time. Adopting `next/font`
> would *introduce* a font download that does not currently exist and make
> performance worse.
>
> If a brand typeface is wanted, that is a **design decision**, not a
> performance one — and `next/font` would then be the right way to load it.

### Related finding: dead Tailwind classes

`layout.js:91` applies `bg-lightBg text-textDark`, but there is no
`tailwind.config.js` and no `@theme` block in `globals.css`, so under Tailwind
v4 these class names resolve to nothing. Harmless today (the body just gets
default colours) but worth fixing or removing so it does not read as intentional
styling.

---

## 5.4b — Original `next/font` guidance (superseded)

No `next/font` usage anywhere (`grep next/font` → 0 matches). `globals.css:1` contains only `@import "tailwindcss";`, and `layout.js:27` uses `font-sans`.

Either the site relies on the system font stack (fine — nothing to do) or a webfont is loaded via a manual `<link>` somewhere, which would be **render-blocking and unpreloaded** — a direct contributor to the "Render-blocking requests — 310 ms" audit.

**Do:**
- [ ] Determine which is the case (check `globals.css` and `layout.js` for any font `<link>` or `@import`)
- [ ] If a webfont is used, migrate to `next/font/google` or `next/font/local` — self-hosts, preloads, and eliminates layout shift via automatic `size-adjust` fallback metrics
- [ ] If it's system fonts, document that and move on

---

## 5.5 — Minification and legacy JS — ALREADY CLEAN (verified)

The audit's hypothesis was right: those Lighthouse flags were **artifacts of
measuring a dev build**.

Verified against `next build && next start`:

- **Minified.** `964-*.js` is 165,726 bytes on a **single line** — fully minified.
- **Legacy JS is gated.** Polyfills ship as
  `<script src="/_next/static/chunks/polyfills-*.js" noModule>` — modern
  browsers never download that 109 KB file.

No action needed. Re-running Lighthouse against a production build should clear
"Minify JavaScript", "Minify CSS" and "Legacy JavaScript" on its own.

### Also measured and rejected

Setting `experimental.optimizePackageImports: ["react-icons", "lucide-react"]`
was tested and produced a **byte-for-byte identical build** — Next 15 already
applies it to both libraries by default. The config was reverted rather than
left in place implying it does something.

---

## 5.5b — Original minification guidance (superseded)

Lighthouse flags "Minify JavaScript — 22 KiB", "Minify CSS — 2 KiB", and "Legacy JavaScript — 10 KiB".

These should not appear in a correct Next.js production build. Their presence suggests **the audit was run against `next dev`**, not `next build && next start`.

- [ ] Re-run Lighthouse against a production build (Phase 0.1 covers this)
- [ ] If they persist in production, check `browserslist` in `package.json` — an overly broad target forces legacy transpilation and polyfills
- [ ] Verify no unminified third-party script is being included manually

---

## 5.6 — bfcache

"Page prevented back/forward cache restoration — 2 failure reasons."

bfcache makes back/forward navigation instant. Common blockers: an open WebSocket, an `unload` handler, or `no-store` cache headers.

- [ ] Expand the audit in the Lighthouse report to see the two specific reasons
- [ ] Check for `unload`/`beforeunload` listeners (use `pagehide` instead)
- [ ] Check whether Django is sending `Cache-Control: no-store` on document responses (relates to Phase 6)

---

## Verification

```bash
cd frontend
ANALYZE=true npm run build
```

- [ ] Compare against the Phase 0.4 baseline bundle report
- [ ] Confirm admin chunks are separate from the main bundle (Phase 2.5)
- [ ] Lighthouse: "Reduce unused JavaScript", "Legacy JavaScript", "Minify JS/CSS" should clear
- [ ] Main-thread work and JS execution time meaningfully reduced

First-load JS: ______ → ______  ·  Unused JS: 1,154KB → ______  ·  TBT: ______ → ______

---

## Exit criteria

- [ ] All confirmed-unused dependencies removed
- [ ] One animation library, ideally one icon library
- [ ] Font strategy documented and optimized
- [ ] Minification/legacy-JS audits pass against a production build
- [ ] bfcache blockers identified
