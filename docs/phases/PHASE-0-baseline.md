# Phase 0 — Baseline & Guardrails

**Effort:** 0.5 day · **Blocks:** nothing · **Do first**

Establish a trustworthy baseline before touching code, so each later phase's impact is provable.

---

## 0.1 — Re-run Lighthouse cleanly

The current baseline run was polluted — Lighthouse itself warned:

> There may be stored data affecting loading performance in this location: IndexedDB. Audit this page in an incognito window to prevent those resources from affecting your scores.

**Do:**
- [ ] Open an **incognito window** with all extensions disabled.
- [ ] Run Lighthouse (Mobile preset) on each of these routes and save the reports as JSON, not just screenshots:
  - `/`
  - `/collections/home`
  - `/about`
  - `/quotation`
- [ ] Store reports in `docs/lighthouse/baseline/` so later runs can be diffed.

**Why JSON:** screenshots can't be diffed. `lighthouse --output=json --output-path=...` (or the "Save as JSON" button in DevTools) lets you compare audit-by-audit after each phase.

**Also run against a production build**, not `next dev` — dev mode is unoptimized and unminified, and will make every number look far worse than reality:
```bash
cd frontend
npm run build
npm run start
```

---

## 0.2 — Fix the production API URL fallback

Multiple components hardcode a localhost fallback that will silently break in production if the env var is missing:

- `frontend/src/components/Home/Hero.js:192`
- `frontend/src/app/collections/[category]/Client.js:248`
- `frontend/src/app/quotation/page.js:402`

All use the pattern:
```js
process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
```

**Do:**
- [ ] Create `frontend/.env.production` with the real production API URL.
- [ ] Confirm the value is actually present in the built output (it's inlined at build time, so it must be set *during* `npm run build`, not at runtime).
- [ ] Consider removing the `|| "http://localhost:8000/api"` fallback entirely, or replacing it with a build-time assertion — a loud failure beats browsers silently calling `localhost` in production.

> This isn't a perf fix, but it's a silent-breakage risk that would invalidate every measurement taken against a production deploy.

---

## 0.3 — Decide the production media strategy

Phase 1 (image optimization) and Phase 6 (backend caching) both depend on this decision, so make it now to avoid redoing work.

**Current state:** `backend/media` is 97MB, served by Django's `static()` dev helper (`backend/backend/urls.py:17`) with no cache headers, no compression, no CDN.

**Decide between:**

| Option | Pros | Cons |
|---|---|---|
| **Nginx/Caddy serves `/media/`** | Simple, no code change, fast | Still origin-bound, no edge caching |
| **WhiteNoise** | Pure-Python, easy deploy | Designed for static, not user uploads |
| **S3 / R2 / Spaces + CDN** | Best perf, offloads origin, scales | Requires `django-storages` + migration of existing files |

**Recommendation:** object storage + CDN if uploads will keep growing (admin edit UI means they will); Nginx if this is a small fixed-content site and you want to ship fast.

**Do:**
- [ ] Pick one and record the decision here.
- [ ] Note the resulting media hostname — **Phase 1 needs it** for `images.remotePatterns` in `next.config.mjs`.

Decision: _______________________
Media hostname: _______________________

---

## 0.4 — Add a bundle analyzer (optional but recommended)

Phase 5 needs before/after bundle numbers.

```bash
cd frontend
npm install --save-dev @next/bundle-analyzer
```

Wire it into `next.config.mjs` behind an `ANALYZE=true` env flag, then capture a baseline:
```bash
ANALYZE=true npm run build
```
- [ ] Save the baseline bundle report alongside the Lighthouse JSON.

---

## Exit criteria

- [ ] Clean incognito, production-build Lighthouse JSON saved for all 4 routes
- [ ] `NEXT_PUBLIC_API_URL` confirmed set for production builds
- [ ] Media hosting strategy decided and hostname recorded
- [ ] Baseline bundle report captured

**Do not start Phase 1 until the baseline is saved** — otherwise you lose the ability to prove the improvement.
