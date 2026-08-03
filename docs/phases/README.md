# Rawasy Metal — Optimization & SEO Phase Docs

Phase-by-phase implementation guide. Each phase is independently shippable and testable.

**Baseline (2026-08-01, Lighthouse):** Performance **36** · Accessibility 85 · Best Practices 96 · SEO 91
LCP 35.5s · TBT 2,480ms · Speed Index 11.1s · Payload 12.4MB · Main-thread 9.0s · Unused JS 1,154KB

**Root cause:** every page is `"use client"`, fetches content after hydration with no caching or dedup, ships full admin-CRUD UI to every visitor, and serves multi-MB unoptimized images/video straight out of Django with no CDN or cache headers.

---

## Phase index

| # | Phase | Effort | Primary impact | Blocks |
|---|---|---|---|---|
| [0](./PHASE-0-baseline.md) | Baseline & guardrails | 0.5d | Measurement integrity | — |
| [1](./PHASE-1-images.md) | Images & static assets ✅ **done** | 1–2d | **LCP, payload** | — |
| [2](./PHASE-2-rendering.md) | Rendering strategy per page | 2–3d | **TBT, LCP, unlocks SEO** | Phase 4 |
| [3](./PHASE-3-data-fetching.md) | Data fetching & race conditions ✅ **done** | 1d | Correctness, wasted requests | — |
| [4](./PHASE-4-seo.md) | SEO implementation ✅ **done** | 1–2d | **SEO score, rankings** | — |
| [5](./PHASE-5-bundle.md) | JS bundle trimming ✅ **done** | 0.5–1d | Install size, CI | — |
| [6](./PHASE-6-backend.md) | Backend delivery & caching ✅ **done** | 1d | TTFB, repeat visits | CDN needs infra |

## Where things stand

**Phases 1, 3, 4, 5, 6 are implemented. Phase 2 is the only one outstanding** —
and Phase 4 already did its server-wrapper half, so what remains is moving data
fetching server-side and code-splitting the admin UI (§2.5).

> **Phase 2 is now the only remaining lever on shipped JavaScript.** Phase 5
> confirmed by measurement that Lighthouse's "unused JavaScript — 1,154 KiB"
> comes from the admin edit UI shipping to anonymous visitors, not from
> dependencies. Code-splitting it (§2.5) is the highest-value work left.

**Two things need a human, not code:**
1. **Rotate the SMTP password** — it is in git history (Phase 6).
2. **Re-run the Lighthouse baseline** in incognito against a production build —
   the original 36 was measured against a dev build in a browser that may have
   been pointed at a different app (Phase 0).

## Recommended execution order

1. **Phase 0** — establish a clean baseline first, or you can't attribute later gains.
2. **Phase 1** — biggest score jump for least risk, no architecture change.
3. **Phase 2** — the structural fix; also unblocks Phase 4.
4. **Phase 4** — route by route, as each page is converted in Phase 2.
5. **Phase 3** — mostly resolved as a side effect of Phase 2; mop up the rest.
6. **Phase 5** — cheap cleanup once the above stabilizes.
7. **Phase 6** — coordinate with hosting/infra decisions.

End every phase with a Lighthouse re-run on the same 4 routes (`/`, `/collections/home`, `/about`, `/quotation`) so score movement is attributable to that phase.

## Target outcome

| Metric | Baseline | Target |
|---|---|---|
| Performance | 36 | 85+ |
| LCP | 35.5s | < 2.5s |
| TBT | 2,480ms | < 200ms |
| Payload | 12.4MB | < 2MB |
| SEO | 91 | 100 |
