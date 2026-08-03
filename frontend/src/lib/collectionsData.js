/**
 * Server-side reader for the collections content used by `generateMetadata`
 * and the sitemap.
 *
 * This is deliberately separate from the client `useEditableContent` hook: this
 * runs during rendering/build on the server, where the goal is a cached fetch
 * that degrades gracefully rather than a React state machine.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/** Built-in categories, used when the backend is unreachable (e.g. at build time). */
export const FALLBACK_CATEGORIES = [
  { key: "home", label: "Home" },
  { key: "office", label: "Office" },
  { key: "medical-clinic", label: "Medical Clinic" },
  { key: "accessories", label: "Accessories" },
];

/**
 * Fetch the raw payload plus its edit time.
 *
 * `Last-Modified` is set by the Django content view from `ComponentData
 * .updated_at`, so the sitemap can publish a real <lastmod> instead of the
 * build timestamp.
 */
export async function getCollectionsPayload() {
  try {
    const response = await fetch(`${API_URL}/home/cards/`, {
      // Content changes only when an admin edits it, so a short revalidate
      // window keeps metadata fresh without hitting Django on every render.
      // Tagged so an admin save can force-bust this immediately via
      // `revalidateTag` (see app/api/revalidate/route.js) instead of waiting
      // out the window — otherwise a category/product added just now can be
      // invisible to the next server-rendered navigation for up to 5 minutes.
      next: { revalidate: 300, tags: ["collections-content"] },
    });

    if (!response.ok) return { data: null, lastModified: null };

    const header = response.headers.get("last-modified");
    const parsed = header ? new Date(header) : null;

    return {
      data: await response.json(),
      // An unparseable header must not become an "Invalid Date" in the XML.
      lastModified:
        parsed && !Number.isNaN(parsed.getTime()) ? parsed : null,
    };
  } catch {
    // The backend being down must never fail a build or a page render.
    return { data: null, lastModified: null };
  }
}

export async function getCollectionsContent() {
  const { data } = await getCollectionsPayload();
  return data;
}

/** Edit time of the collections content, or null if the backend is unreachable. */
export async function getCollectionsLastModified() {
  const { lastModified } = await getCollectionsPayload();
  return lastModified;
}

/**
 * Every language keeps its own independent `categories`/`products` arrays
 * (the admin can rename a category's key differently per language), but the
 * URL itself carries no language segment — `/collections/<category>` is the
 * same route no matter which language is displayed. EN is checked first
 * since it's the default/most complete language, but a category or product
 * added while editing in another language only exists in THAT language's
 * arrays, so every language has to be checked or that content 404s forever.
 */
function languagesEnFirst(translations) {
  return ["EN", ...Object.keys(translations || {}).filter((l) => l !== "EN")];
}

export async function getCategories() {
  const content = await getCollectionsContent();
  const translations = content?.translations || {};

  const seen = new Set();
  const merged = [];

  for (const lang of languagesEnFirst(translations)) {
    const categories = translations[lang]?.categories;
    if (!Array.isArray(categories)) continue;

    for (const category of categories) {
      if (seen.has(category.key)) continue;
      seen.add(category.key);
      merged.push(category);
    }
  }

  return merged.length > 0 ? merged : FALLBACK_CATEGORIES;
}

export async function getCategory(categoryKey) {
  const content = await getCollectionsContent();
  const translations = content?.translations || {};

  for (const lang of languagesEnFirst(translations)) {
    const translation = translations[lang];
    const categories = Array.isArray(translation?.categories)
      ? translation.categories
      : [];

    const category = categories.find((entry) => entry.key === categoryKey);
    if (!category) continue;

    const products = Array.isArray(translation?.products)
      ? translation.products.filter((product) => product.category === categoryKey)
      : [];

    return { category, products };
  }

  // Not found under any language — fall back to the built-in defaults so a
  // stale/mistyped URL still gets a sane category object rather than null.
  const category =
    FALLBACK_CATEGORIES.find((entry) => entry.key === categoryKey) || null;

  return { category, products: [] };
}

/**
 * URL slug for a product.
 *
 * The name alone is not unique — the catalogue legitimately repeats names like
 * "Luxury Velvet Curtain" across variants — so the id is appended. That keeps
 * the URL readable for humans and search engines while guaranteeing one page
 * per product.
 */
function slugify(value) {
  return String(value)
    .normalize("NFKD")
    // Strip accents so "Café" becomes "cafe" rather than dropping the letter.
    .replace(/[̀-ͯ]/g, "")
    // Split camelCase before lowercasing, so an editor key like
    // "luxuryVelvetCurtain1" becomes "luxury-velvet-curtain-1" rather than one
    // unreadable run of letters.
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productSlug(product) {
  // Prefer the current name — a product's name is what an admin actually
  // edits, but a freshly-added product's `key` is an opaque auto-generated
  // id (e.g. "product-1785697036585") that never gets updated when the name
  // does, so keying off it first left the URL stuck showing that id forever.
  // The id is appended because names are not unique (variants legitimately
  // repeat "Luxury Velvet Curtain"), which keeps one page per product.
  const name = slugify(product?.name || "");
  if (name) {
    return product?.id ? `${name}-${product.id}` : name;
  }

  // No name at all (shouldn't normally happen) — fall back to the key.
  const key = product?.key ? slugify(product.key) : "";
  return key || "product";
}

/** Look up a single product within a category by its slug. */
export async function getProduct(categoryKey, slug) {
  const { category, products } = await getCategory(categoryKey);
  const product =
    products.find((entry) => productSlug(entry) === slug) || null;

  return { category, product, products };
}

/** Every product across all categories and languages, for generateStaticParams and sitemap. */
export async function getAllProducts() {
  const content = await getCollectionsContent();
  const translations = content?.translations || {};

  const seen = new Set();
  const merged = [];

  for (const lang of languagesEnFirst(translations)) {
    const products = translations[lang]?.products;
    if (!Array.isArray(products)) continue;

    for (const product of products) {
      const dedupeKey = `${product.category}::${productSlug(product)}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      merged.push(product);
    }
  }

  return merged;
}

/** Turn a slug into a readable label when the API has no entry for it. */
export function humanizeCategoryKey(categoryKey) {
  return String(categoryKey)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
