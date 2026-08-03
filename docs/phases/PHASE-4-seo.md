# Phase 4 — SEO Implementation

**Status: IMPLEMENTED** (2026-08-01)

| Item | State |
|---|---|
| Per-route metadata (title/description/canonical) | ✅ done |
| Open Graph + Twitter cards | ✅ done |
| `robots.js` + dynamic `sitemap.js` | ✅ done |
| JSON-LD (Organization, WebSite, Breadcrumb, ItemList/Product) | ✅ done |
| `/showforms` noindex | ✅ done |
| Alt-text audit | ✅ done — no changes needed |
| Search Console submission | ⏸️ requires domain access |

**Unblocking note:** this phase needed metadata exports, which client components
cannot do. Rather than waiting for all of Phase 2, each route was given a thin
**server wrapper** — the interactive body moved to a sibling client file:

| Route | Server wrapper | Client body |
|---|---|---|
| `/` | `app/page.js` | `app/HomeClient.js` |
| `/about` | `app/about/page.js` | `app/about/AboutClient.js` |
| `/quotation` | `app/quotation/page.js` | `app/quotation/QuotationClient.js` |
| `/showforms` | `app/showforms/page.js` | `app/showforms/ShowFormsClient.js` |
| `/collections` | `app/collections/page.js` — now a real server `redirect()` (307) | — |
| `/collections/[category]` | already server; gained `generateMetadata` + JSON-LD | `Client.js` |

This is a strict subset of Phase 2 and does not conflict with it: Phase 2 now
only has to move *data fetching* into these existing wrappers.

**Verified rendered output** (production build, `view-source`):

| Route | Title | Canonical |
|---|---|---|
| `/` | SKF Curtains — Luxury Curtains & Window Treatments | `/` |
| `/about` | About Us \| SKF Curtains | `/about` |
| `/quotation` | Request a Free Quotation \| SKF Curtains | `/quotation` |
| `/collections/home` | Home Curtains & Blinds \| SKF Curtains | `/collections/home` |
| `/collections/office` | Office Curtains & Blinds \| SKF Curtains | `/collections/office` |
| `/showforms` | Contact Submissions (noindex, nofollow, no canonical) | — |

Category descriptions are generated from live data and include real product
counts ("Browse 6 home curtain and blind designs…"). Sitemap emits 8 URLs
including editor-created categories. `/collections` returns a genuine 307.

**New files:** `src/lib/seo.js`, `src/lib/collectionsData.js`,
`src/app/robots.js`, `src/app/sitemap.js`.

---

**Effort:** 1–2 days · **Impact:** SEO 91 → 100, plus actual ranking ability

Lighthouse reports SEO 91, which is misleadingly high — it checks technical basics, not whether the site can actually compete in search. The real situation:

> **Every page on the site shares one identical title and description.** There are no Open Graph tags, no canonical URLs, no sitemap, no robots.txt, and no structured data anywhere in the codebase.

---

## Why this was blocked

`frontend/src/app/layout.js:11-22` exports `metadata` (title, description, keywords, icons) — and it is the **only** metadata in the entire application.

Every page file starts with `"use client"` on line 1: `page.js`, `about/page.js`, `quotation/page.js`, `collections/page.js`, `showforms/page.js`. **Next.js ignores `metadata` and `generateMetadata` exports in client components** — silently. So every route inherits the root's generic "CurtainCo - Luxury Curtains..." title.

This is why Phase 2 comes first. Work through this phase route-by-route as each page gets converted.

---

## 4.1 — Per-route metadata

Add to each server-converted page:

### `/` — `frontend/src/app/page.js`
```js
export const metadata = {
  title: '...',            // primary keyword + brand
  description: '...',      // 150–160 chars, compelling, includes location if local SEO matters
  alternates: { canonical: 'https://<domain>/' },
};
```

### `/collections/[category]` — `frontend/src/app/collections/[category]/page.js`
This is the **highest-value** metadata on the site — one page per category, each targeting distinct keywords. The file is already a server component with `generateStaticParams` (line 30), so this works today.

```js
export async function generateMetadata({ params }) {
  const { category } = await params;
  const data = await getCategory(category);   // same fetch used in Phase 2.3
  return {
    title: `${data.name} — ...`,
    description: data.description?.slice(0, 160),
    alternates: { canonical: `https://<domain>/collections/${category}` },
  };
}
```

- [ ] Reuse the Phase 2.3 server fetch — don't fetch twice. Next.js dedupes identical `fetch` calls within a request, so calling the same helper in both `generateMetadata` and the page body is fine.

### `/about` — after Phase 2.4 conversion
- [ ] Unique title + description

### `/quotation` — needs a thin server wrapper
The page stays client for form state, so wrap it: keep `page.js` as a server component exporting `metadata`, and move the form into a client child.
- [ ] Title/description added (this page currently has **no** title of its own at all)

### `/showforms` — internal admin dashboard
```js
export const metadata = { robots: { index: false, follow: false } };
```
- [ ] Added — this page is currently fully indexable

**Checklist:**
- [ ] Every public route has a unique `<title>` (verify in view-source, not DevTools)
- [ ] Every public route has a unique meta description, 150–160 chars
- [ ] Canonical URL on every route

---

## 4.2 — Open Graph & Twitter cards

None exist anywhere in the codebase. Without these, every share on WhatsApp, LinkedIn, or X renders as a bare URL — which matters a lot for a visual/interiors product.

Add to root `layout.js` as defaults, then override per-route:
```js
openGraph: {
  title: '...',
  description: '...',
  images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  type: 'website',
  locale: 'en_US',
  siteName: '...',
},
twitter: {
  card: 'summary_large_image',
  title: '...',
  description: '...',
  images: ['/og-image.jpg'],
},
```

- [ ] Root defaults set
- [ ] Category pages override `openGraph.images` with the actual category image
- [ ] A 1200×630 OG image exists and is **optimized** (don't reintroduce a 2MB asset — see Phase 1)
- [ ] Validated with the Facebook Sharing Debugger and X Card Validator

---

## 4.3 — `robots.txt` and `sitemap.xml`

Neither exists. Use Next.js file conventions so they're generated at build time.

### `frontend/src/app/robots.js`
```js
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/showforms', '/api/'] }],
    sitemap: 'https://<domain>/sitemap.xml',
  };
}
```

### `frontend/src/app/sitemap.js`
Must enumerate collection categories **dynamically** from the backend — a hardcoded list will drift as admins add categories.
```js
export default async function sitemap() {
  const categories = await getCategories();
  return [
    { url: 'https://<domain>/',          changeFrequency: 'weekly',  priority: 1 },
    { url: 'https://<domain>/about',     changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://<domain>/quotation', changeFrequency: 'monthly', priority: 0.8 },
    ...categories.map((c) => ({
      url: `https://<domain>/collections/${c.slug}`,
      changeFrequency: 'weekly',
      priority: 0.9,
    })),
  ];
}
```

- [ ] `robots.js` created, `/showforms` disallowed
- [ ] `sitemap.js` created, categories pulled from the API
- [ ] Both verified at `/robots.txt` and `/sitemap.xml` in a production build
- [ ] Sitemap submitted in Google Search Console

---

## 4.4 — Structured data (JSON-LD)

None exists. This is what earns rich results in the SERP.

**Add:**
- [ ] `Organization` (or `LocalBusiness` if there's a physical showroom — includes address, phone, opening hours, and feeds Google Business) in root `layout.js`
- [ ] `BreadcrumbList` on `/collections/[category]`
- [ ] `ItemList` / `Product` on category pages, listing the products in the grid
- [ ] `WebSite` with `SearchAction` if site search exists

Render via a `<script type="application/ld+json">` with `dangerouslySetInnerHTML` in the server component — no client JS required.

- [ ] Validated with Google's Rich Results Test

---

## 4.5 — Accessibility (also an 85 → higher win)

Accessibility scored 85, and a11y and SEO overlap substantially.

**Image alt text** is mostly in good shape already:
- `Client.js:1046` — `alt={p.name}` ✅
- `Footer.js:551`, `Navbar.js:81` — static alts ✅
- `FeaturedProductsSection.js:730` — `alt={feature.title || "Curtain product"}` fallback ✅
- `Hero.js:20` — `alt=""` on the decorative background ✅ *(correct — leave it)*

**Do:**
- [ ] Run the Lighthouse a11y audit and address the specific failures behind the 85
- [ ] Verify one `<h1>` per page and a sensible heading hierarchy (server rendering in Phase 2 makes this auditable in view-source)
- [ ] Check color contrast on the gold/dark theme
- [ ] Confirm the language switcher sets `lang`/`dir` correctly (Phase 2.6 consolidates this)

---

## 4.7 — Open decisions (need a human)

Three things were found during implementation that code cannot resolve:

1. **Currency conflict.** Prices render as `৳` with the `en-BD` locale
   (`collections/[category]/Client.js:211`), but the WhatsApp number is UAE
   (+971) and the domain is `.com`. Product structured data must match visible
   page content, so `PRICE_CURRENCY` in `src/lib/seo.js` is set to `BDT` to
   agree with the page. **If the business trades in AED, fix the on-page
   formatter and that constant together** — mismatched prices in structured
   data are a rich-results violation.

2. **Brand naming.** The old metadata said "CurtainCo"; components say "SKF
   Curtains"; the domain is skfcurtains.com; the repo is `rawasy-metal`. All
   metadata now uses **SKF Curtains**. Confirm that is right.

3. **Thin category in the sitemap.** An editor-created category
   `category-1784316140330` (label "category") is live in the backend and
   therefore appears in the sitemap. It looks like a test entry with no
   products. Deleting it in the admin removes it from the sitemap
   automatically — it was not filtered in code, because silently hiding real
   categories would be worse.

Also: `SITE_URL` defaults to `https://skfcurtains.com` (taken from
`ALLOWED_HOSTS`/`CORS_ALLOWED_ORIGINS`). Override with `NEXT_PUBLIC_SITE_URL`
if that is wrong — every canonical, OG URL and sitemap entry depends on it.

---

## 4.6 — Post-launch

- [ ] Google Search Console verified; sitemap submitted
- [ ] Bing Webmaster Tools submitted
- [ ] Request indexing for key pages
- [ ] Core Web Vitals monitored in Search Console (field data differs from lab Lighthouse — this is what actually affects ranking)

---

## Verification

- [ ] **View source** each route and confirm a unique `<title>`, description, canonical, and OG tags — use view-source, not DevTools, since DevTools shows post-hydration DOM
- [ ] `/robots.txt` and `/sitemap.xml` return valid content in production
- [ ] Rich Results Test passes on the homepage and a category page
- [ ] Lighthouse SEO reaches 100

SEO: 91 → ______  ·  Accessibility: 85 → ______

---

## Exit criteria

- [ ] Unique title + description + canonical on every public route
- [ ] OG/Twitter tags site-wide, validated by the platform debuggers
- [ ] `robots.js` + dynamic `sitemap.js` live
- [ ] JSON-LD on homepage and category pages
- [ ] `/showforms` noindexed
- [ ] Search Console configured
