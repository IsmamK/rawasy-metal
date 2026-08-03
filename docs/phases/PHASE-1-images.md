# Phase 1 — Images & Static Assets

**Status: IMPLEMENTED** (2026-08-01) — one optional step deferred, see §1.5.

| Step | State |
|---|---|
| 1.1 Whitelist backend image host | ✅ done |
| 1.2 Remove `unoptimized` workarounds | ✅ done |
| 1.3 Shrink oversized `public/` assets | ✅ done |
| 1.4 CSS backgrounds → `next/image` | ✅ done |
| 1.5 Re-encode existing backend media | ⏸️ tool built + dry-run; `--apply` not run |
| 1.6 Defer collection videos | ✅ done |

**Measured results**

| Asset / path | Before | After |
|---|---|---|
| `curtains-logo` (nav + footer + favicon) | 1,527KB `.ico` served raw | 12KB PNG → **3KB AVIF** |
| `curtains-hero.png` | 2,333KB | 686KB source → **66KB AVIF** @1200w |
| `curtains-background.png` (was CSS bg, unoptimized) | 1,217KB served raw | 197KB source → **8KB AVIF** @1200w |
| Backend media image (3.5MB PNG) | served raw (`unoptimized`) | **30KB AVIF** @640w |
| Homepage videos | 4 × MP4 (~4MB) on load | **0 bytes** until hover |
| New uploads (26.7MB test PNG) | stored as-is | **111KB WebP**, max 2000px |

`public/` total: **11.9MB → 6.5MB**. Verified against a production build (`next build && next start`).

---

**Effort:** 1–2 days · **Depends on:** Phase 0 (media hostname decision) · **Impact:** LCP 35.5s → target < 2.5s

The single highest-impact phase. Lighthouse flags **1,475 KiB** of image savings and a **12,394 KiB** total payload. Nearly every product image on the site currently bypasses Next.js image optimization entirely.

---

## The core bug

`frontend/next.config.mjs` already has a good baseline image config — `unoptimized: false`, `formats: [avif, webp]`, `deviceSizes`, `imageSizes`, `minimumCacheTTL: 2592000`.

**But it has no `remotePatterns` / `domains` entry.** Next.js refuses to optimize images from non-whitelisted hosts, so every admin-uploaded image served from Django (`http://localhost:8000/media/...` or the prod domain) would throw. The workaround someone applied was to force `unoptimized` on those components — which disables optimization site-wide for exactly the images that need it most.

**Fix the root cause first, then remove the workarounds.**

---

## 1.1 — Whitelist the backend image host

In `frontend/next.config.mjs`, add `remotePatterns` covering both dev and production media hosts (use the hostname decided in Phase 0.3):

```js
images: {
  // ...existing formats / deviceSizes / imageSizes / minimumCacheTTL
  remotePatterns: [
    { protocol: 'http',  hostname: 'localhost', port: '8000', pathname: '/media/**' },
    { protocol: 'https', hostname: '<PROD_MEDIA_HOST>', pathname: '/media/**' },
  ],
},
```

- [ ] Added, with the real production hostname
- [ ] Verified a backend-hosted image renders without a Next.js host error

---

## 1.2 — Remove the `unoptimized` workarounds

Only after 1.1 is in place. Each of these currently ships full-size originals to the browser:

| File | Lines | What |
|---|---|---|
| `frontend/src/app/collections/[category]/Client.js` | 1044–1051 | Product grid thumbnails |
| `frontend/src/app/collections/[category]/Client.js` | 1250–1259 | Product modal image |
| `frontend/src/app/collections/[category]/Client.js` | 1322–1328 | Fullscreen viewer image |
| `frontend/src/components/Home/CollectionsSection.js` | 573–579 | The 4 collection cards |
| `frontend/src/components/Footer.js` | 549–557 | Footer logo |

- [ ] `unoptimized` removed from all five
- [ ] Each still renders correctly (check the modal and fullscreen paths specifically — they're easy to miss)

### The `OptimizedImage` wrapper

`frontend/src/components/Home/FeaturedProductsSection.js:30-53` defines a wrapper that sets:
```js
unoptimized={!isLocalImage(src)}
```
`isLocalImage` only returns true for paths starting with `/` — so **every backend-hosted image is excluded from optimization**, which is precisely backwards. With `remotePatterns` configured, this check is no longer needed.

- [ ] `isLocalImage` gate removed (or the wrapper simplified to a plain `next/image`)

> **Note:** `Hero.js:17-27`'s `OptimizedBackground` is already correct — it has no `unoptimized` and uses `priority`. Leave it alone; it's the model the others should follow.

---

## 1.3 — Shrink oversized static assets in `frontend/public`

| Asset | Size | Used as | Action |
|---|---|---|---|
| `curtains-logo.ico` | **1.56 MB** | 50×50 nav logo (`Navbar.js:79-86`), 75×75 footer default | Split into a proper small `favicon.ico` (~15KB) **and** an optimized SVG/PNG for the nav/footer logo. A 1.5MB icon for a 50px render is the worst ratio on the site. |
| `curtains-hero.png` | **2.39 MB** | Hero imagery | Convert to WebP/AVIF, resize to max needed dimensions |
| `curtains-background.png` | **1.25 MB** | CSS `background-image` in `page.js:36`, `quotation/page.js:757` | Convert to WebP **and** move off CSS — see 1.4 |

- [ ] Favicon split from logo asset
- [ ] Hero and background re-encoded to WebP/AVIF
- [ ] Originals removed from `public/` (not just left alongside)

---

## 1.4 — Move CSS background images into `next/image`

CSS `background-image` bypasses Next.js optimization completely — no AVIF/WebP negotiation, no responsive `srcset`, no lazy loading.

Affected:
- `frontend/src/app/page.js:34-40`
- `frontend/src/app/quotation/page.js:769-776`

Both also use `bg-fixed` (`background-attachment: fixed`), a well-known scroll-jank cost on mobile that contributes to the "Avoid non-composited animations" audit.

**Do:**
- [ ] Replace with an absolutely-positioned `<Image fill priority={aboveFold} />` layer behind the content
- [ ] Drop `bg-fixed`, or reimplement the parallax effect with a compositor-friendly `transform` if the visual is important

---

## 1.5 — Re-encode the backend media library

> **Implemented as `python manage.py optimize_media`.** Upload-time compression is
> live (see below). The bulk re-encode of *existing* files has been dry-run only:
>
> ```
> Would rewrite 66 file(s): 66MB -> 41MB (saving 25MB). 22 skipped.
> ```
>
> It was not applied because it rewrites 66 git-tracked binaries and the
> user-facing bytes are already handled by `next/image`. To apply:
>
> ```bash
> python manage.py optimize_media --apply --backup-dir ../media_backup
> ```
>
> Files keep their original name and format, so no DB rows or JSON component
> data need updating. Rewrites go via a temp file + atomic swap.


`backend/media` totals **97 MB**. Notable offenders:
- `backend/media/uploaded_images/uploaded_images/screenshot-2025-04-07-at-51413pm*.png` — 3.6MB and 3.3MB, **multiple duplicate copies**
- Several ~730KB `calltoaction_*.jpg` duplicates

These are raw screenshots and unprocessed uploads being served as production imagery.

**Do:**
- [ ] **One-off cleanup:** resize existing media to realistic display dimensions and re-save as WebP; delete the duplicate copies
- [ ] **Prevent recurrence:** process images at upload time in the Django admin/upload view — resize to a max dimension (e.g. 2000px) and convert to WebP before writing to disk. Otherwise the admin edit UI will refill the folder with 3MB screenshots.
- [ ] Consider `django-imagekit` or a Pillow post-save hook on the upload model

> Even with `next/image` optimizing on the fly, the origin still transfers the full 3.6MB to the Next.js server on first request. Fixing at the source matters.

---

## 1.6 — Defer the collection videos

`frontend/src/components/Home/CollectionsSection.js:584-592` mounts **4 autoplaying MP4s** (`home.mp4`, `office.mp4`, `medical.mp4`, `others.mp4`, ~1MB each) that play on hover. All four `<video>` elements mount on page load; `preload="metadata"` limits but does not eliminate the cost, and videos are not lazy-loaded by default.

**Do:**
- [ ] Add an explicit `poster` image to each `<video>` so something paints immediately
- [ ] Keep `preload="none"` (stronger than `metadata`) until interaction
- [ ] Defer mounting the `<video>` element itself until hover or `IntersectionObserver` visibility — render the poster `<Image>` first and swap in the video on demand

---

## Verification

Re-run the Phase 0 Lighthouse suite (incognito, production build) on all 4 routes.

**Expect:**
- LCP to drop dramatically — the hero image path is the main LCP element and is currently unoptimized
- "Improve image delivery" (1,475 KiB) to largely clear
- Total payload to fall well below 12.4MB
- "Avoid enormous network payloads" to pass

- [ ] New Lighthouse JSON saved to `docs/lighthouse/phase-1/`
- [ ] Score delta recorded below

Performance: 36 → ______  ·  LCP: 35.5s → ______  ·  Payload: 12.4MB → ______

---

## Exit criteria

- [ ] `remotePatterns` configured; no `unoptimized` flags remain on content images
- [ ] No static asset in `public/` exceeds ~200KB
- [ ] CSS background images converted to `next/image`
- [ ] Backend media re-encoded + upload-time processing in place
- [ ] Videos deferred behind poster images
- [ ] Lighthouse re-run captured
