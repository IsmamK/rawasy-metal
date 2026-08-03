# Phase 6 — Backend Delivery & Caching

**Status: IMPLEMENTED** (2026-08-01) — everything achievable in-repo. CDN/proxy
provisioning still needs infra access.

| Item | State |
|---|---|
| `Cache-Control` on media | ✅ done (middleware) |
| `Cache-Control` on read API endpoints | ✅ done (all 80, one place) |
| Decouple media serving from `DEBUG` | ✅ done — **fixes a latent outage** |
| Duplicate settings cleanup | ✅ done |
| CORS allowlist actually enforced | ✅ done |
| Secrets moved to environment | ✅ done — **password still needs rotating** |
| Compression | ✅ verified working (80% reduction) |
| Nginx/CDN in front of `/media/` | ⏸️ needs infra access |

**Measured results**

| Response | Before | After |
|---|---|---|
| `/media/<image>` | no `Cache-Control` — refetched every visit | `public, max-age=31536000, immutable` |
| `/api/home/*`, `/api/about/*` | no cache headers | `public, max-age=60, s-maxage=300, stale-while-revalidate=600` |
| `/api/home/cards/` gzip | 20,926 B | **4,150 B** (80% smaller) |
| 404 from a content endpoint | — | correctly **not** cached |
| CORS from an unknown origin (`DEBUG=False`) | allowed (wide open) | **rejected** |

**Files:** `backend/backend/settings.py`, `backend/backend/urls.py`,
`backend/backend/middleware.py` (new), `backend/api/views.py`.

---

## ⚠️ The latent production outage this fixed

`backend/urls.py` served media with `django.conf.urls.static.static()`. That
helper returns an **empty list whenever `DEBUG` is `False`** — verified by
reading Django's source.

So `DEBUG = True` was not merely a security problem: it was **load-bearing**.
Turning it off — the single most important production hardening step, and one
the file's own comments told you to do — would have silently 404'd every
uploaded image on the site.

Media serving is now controlled by its own `SERVE_MEDIA_FROM_DJANGO` setting
(default on), so `DEBUG=False` is safe to adopt. Verified: with
`DJANGO_DEBUG=false`, media returns 200 with cache headers, and CORS correctly
rejects unknown origins while allowing `skfcurtains.com`.

---

## Environment variables

None are required — every one falls back to the previous behaviour, so nothing
breaks if they are unset. Django does not read `.env` files on its own; set
these in the deployment environment.

| Variable | Default | Notes |
|---|---|---|
| `DJANGO_SECRET_KEY` | the old committed key | **Set in production.** The fallback is in git history. |
| `DJANGO_DEBUG` | `true` | Set `false` in production — now safe to do. |
| `EMAIL_HOST_PASSWORD` | *(empty)* | No fallback on purpose — see below. |
| `SERVE_MEDIA_FROM_DJANGO` | `true` | Set `false` once Nginx/CDN serves `/media/`. |
| `MEDIA_CACHE_MAX_AGE` | `31536000` | 1 year; safe because upload names are collision-suffixed. |
| `API_CACHE_MAX_AGE` | `60` | Browser TTL for content endpoints. |
| `API_CACHE_SHARED_MAX_AGE` | `300` | Shared/CDN TTL. Aligned with the Next.js `revalidate: 300`. |

### The SMTP password has no fallback — deliberately

`EMAIL_HOST_PASSWORD` was committed in plain text (`settings.py`) and is in git
history, so it must be treated as compromised. It now reads from the
environment with **no default**: mail fails loudly rather than a leaked
credential continuing to work silently.

**Rotate that password.** Removing it from the file does not un-leak it.

---

**Effort:** 1 day · **Impact:** TTFB, repeat visits, origin load

Once Phase 2 moves data fetching server-side, the Django API sits directly in the critical rendering path — every page render waits on it. And media files currently stream through Python on every single request.

---

## 6.1b — Remaining infra work (needs server access)

The in-repo half is done; these need someone with deployment access.

- [ ] Put Nginx/Caddy or a CDN in front of `/media/`, then set
      `SERVE_MEDIA_FROM_DJANGO=false`. Django ties up a worker for the whole of
      each file transfer and has no edge cache — the middleware headers are a
      stopgap, not a destination.
- [ ] Prefer brotli at the proxy layer (better ratio than Django's gzip).
- [ ] Set `DJANGO_SECRET_KEY` and `DJANGO_DEBUG=false`.
- [ ] Rotate and set `EMAIL_HOST_PASSWORD`.

Suggested Nginx block:

```nginx
location /media/ {
    alias /path/to/backend/media/;
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

---

## 6.1 — Stop serving media through Django

`backend/backend/urls.py:17` serves `/media/` via Django's `static()` helper with `document_root=settings.MEDIA_ROOT`.

This helper is **explicitly documented as development-only.** In production it:
- Serves binary files synchronously through Python/WSGI (blocking a worker per image)
- Sends **no `Cache-Control` headers** — browsers re-download every image on every visit
- Applies no gzip/brotli compression
- Provides no CDN or edge caching

With 97MB of media and multi-MB images, every visitor round-trips through Django for every image.

**Fix per the Phase 0.3 decision:**

| Strategy | Implementation |
|---|---|
| **Nginx/Caddy** | `location /media/ { alias /path/to/media/; expires 1y; add_header Cache-Control "public, immutable"; }` and remove the `static()` line from `urls.py` |
| **S3/R2/Spaces + CDN** | `django-storages` + `boto3`, set `DEFAULT_FILE_STORAGE`, migrate existing files, update `MEDIA_URL` to the CDN domain |

**Do:**
- [ ] Media served by something other than Django in production
- [ ] `Cache-Control: public, max-age=31536000, immutable` on media responses
- [ ] gzip/brotli enabled for compressible types
- [ ] If the media hostname changed, **update `images.remotePatterns` in `next.config.mjs`** (Phase 1.1)
- [ ] Verify with `curl -I` against a real media URL

> **`immutable` requires versioned/hashed filenames.** Django's upload handler already appends random suffixes on collision (e.g. `image_qCUdGAp.jpg`), but if a file can be overwritten in place, use a shorter `max-age` instead or you'll serve stale images for a year.

---

## 6.2 — Add cache headers to read-mostly API endpoints

None of the reviewed views in `backend/api/views.py` or `backend/contact/views.py` set caching headers. After Phase 2, these endpoints are hit on every server render.

The homepage/collections/about content changes rarely — only when an admin edits it.

**Do:**
- [ ] Add `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600` (or similar) to the read endpoints: `/home/hero/`, `/home/about/`, `/home/service/`, `/home/industry/`, `/home/cards/`, `/about/capabilities/`
- [ ] Use `@cache_control` / `@vary_on_headers` decorators, or DRF's `method_decorator(cache_page(...))`
- [ ] **Never cache** the contact submission POST or the `/showforms` admin listing — those must stay fresh
- [ ] Consider ETag/`Last-Modified` so unchanged content returns `304`

**Coordinate with Next.js:** Phase 2 sets `{ next: { revalidate: 300 } }` on server fetches. Align the two TTLs so an admin edit doesn't take an unpredictable amount of time to appear. Document the expected propagation delay.

- [ ] Cache TTLs aligned between Next.js and Django
- [ ] Propagation delay documented: ______ seconds

---

## 6.3 — Response compression

`GZipMiddleware` was added to `settings.py` in recent changes — verify it's actually active and ordered correctly (it must come **before** anything that modifies the response body).

- [ ] `GZipMiddleware` present and correctly ordered in `MIDDLEWARE`
- [ ] Confirm with `curl -H "Accept-Encoding: gzip" -I <api-url>` → `Content-Encoding: gzip`
- [ ] Prefer brotli at the reverse-proxy layer if available (better ratio than gzip)

---

## 6.4 — Clean up duplicated settings

`backend/backend/settings.py` has several duplicated definitions from recent edits — config drift waiting to happen, since the second definition silently wins:

| Setting | Duplicated at |
|---|---|
| `MEDIA_URL` / `MEDIA_ROOT` | lines 241–242 **and** 292–293 |
| `CORS_ALLOW_ALL_ORIGINS = True` | lines 78 **and** 145 |

- [ ] Each setting defined exactly once
- [ ] **Resolve the CORS contradiction:** `CORS_ALLOW_ALL_ORIGINS = True` is set alongside a `CORS_ALLOWED_ORIGINS` list (localhost:3000, skfcurtains.com). The blanket `True` overrides the list, so the allowlist is dead config. Combined with `CORS_ALLOW_CREDENTIALS = True`, this is a real security issue, not just untidiness — gate it on `DEBUG`.

---

## 6.5 — Security hygiene (adjacent, worth doing here)

Found during the audit — not performance, but you're already in this file:

- [ ] **`SECRET_KEY` is hardcoded** in `settings.py` → move to an environment variable
- [ ] **SMTP password is hardcoded** (`Stechgroup@2025` for `no-reply@jgalfalah.com`) → move to an environment variable and **rotate it**, since it's in git history
- [ ] Confirm `DEBUG = False` in production
- [ ] Review `ALLOWED_HOSTS` for production correctness
- [ ] Add a backend `.env` (none exists) and ensure it's gitignored

> The SMTP credential is committed to the repository. Rotating it should not wait for this phase.

---

## 6.6 — Database cache backend

`settings.py:299-303` configures `DatabaseCache` (a DB-backed cache table). This is the slowest cache backend and isn't currently used for HTTP response caching.

- [ ] Confirm the cache table exists (`python manage.py createcachetable`) if anything relies on it
- [ ] Consider Redis if 6.2's caching becomes significant — but `DatabaseCache` is adequate for low traffic; don't add infrastructure prematurely

---

## Verification

```bash
curl -I https://<domain>/media/<some-image>.jpg     # expect long-lived Cache-Control
curl -I https://<domain>/api/home/hero/             # expect Cache-Control + gzip
```

- [ ] Media returns long-lived `Cache-Control` and is **not** served by Django
- [ ] API endpoints return cache headers and compress
- [ ] Repeat-visit Lighthouse run shows a much smaller transfer size
- [ ] Server-render TTFB improved

---

## Exit criteria

- [ ] Media served by Nginx/CDN with immutable caching
- [ ] Read API endpoints send cache headers, aligned with Next.js `revalidate`
- [ ] Compression verified
- [ ] No duplicated settings; CORS allowlist actually enforced
- [ ] Secrets moved to environment variables and the exposed SMTP password rotated
