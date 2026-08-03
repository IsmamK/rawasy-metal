import {
  getAllProducts,
  getCategories,
  getCollectionsLastModified,
  productSlug,
} from "@/lib/collectionsData";
import { absoluteUrl } from "@/lib/seo";

/**
 * Fallback <lastmod> for routes whose content is hardcoded rather than stored
 * in the CMS. Bump it when you meaningfully rewrite those pages.
 *
 * It is a fixed date on purpose: `new Date()` would restamp every URL on every
 * build, telling crawlers the whole site changed when nothing did — a signal
 * they learn to ignore.
 */
const STATIC_CONTENT_LAST_MODIFIED = new Date("2026-08-01T00:00:00Z");

// Freshness is governed by the revalidate window on the underlying content
// fetch (see lib/collectionsData.js), so categories added through the admin
// editor appear without a redeploy.
export default async function sitemap() {
  // /collections is intentionally absent: it 307s to /collections/home, and
  // listing a redirecting URL in a sitemap is a crawl error.
  const staticRoutes = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/quotation"), changeFrequency: "monthly", priority: 0.8 },
  ];

  // Pulled from the backend so editor-created categories are included.
  const categories = await getCategories();

  // Category pages render CMS content, so their real edit time is the one the
  // backend reports. It falls back to the static date when Django is
  // unreachable (e.g. during a CI build).
  const categoryLastModified =
    (await getCollectionsLastModified()) || STATIC_CONTENT_LAST_MODIFIED;

  const categoryRoutes = categories
    .filter((category) => category?.key)
    .map((category) => ({
      url: absoluteUrl(`/collections/${category.key}`),
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: categoryLastModified,
    }));

  // One entry per product page.
  const products = await getAllProducts();
  const productRoutes = products
    .filter((product) => product?.category && product?.name)
    .map((product) => ({
      url: absoluteUrl(
        `/collections/${product.category}/${productSlug(product)}`
      ),
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: categoryLastModified,
    }));

  return [
    ...staticRoutes.map((route) => ({
      ...route,
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
    })),
    ...categoryRoutes,
    ...productRoutes,
  ];
}
