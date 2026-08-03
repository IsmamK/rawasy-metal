/**
 * Generic server-side reader for the editable CMS endpoints.
 *
 * Every page built on `useEditableContent` used to fetch its copy in the
 * browser, which meant the server HTML was a loading spinner: headings, body
 * text and links existed only after hydration, so crawlers indexed an empty
 * page. Fetching here and seeding the hook via its `initialContent` option puts
 * the real content in the HTML.
 *
 * Mirrors `collectionsData.js`, which does the same job for the catalogue.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * @param {string} path Endpoint path relative to the API root, e.g.
 *   "contact/contact1/".
 * @returns {Promise<object|null>} Raw payload, or null if unavailable.
 */
export async function getServerContent(path) {
  const normalizedPath = String(path).replace(/^\//, "");
  const url = `${API_URL}/${normalizedPath}`;

  try {
    const response = await fetch(url, {
      // Matches the collections window: content changes only on an admin save.
      // Tagged so a save can force-bust this immediately via `revalidateTag`
      // (see app/api/revalidate/route.js) — otherwise an edit saved just now
      // can still be invisible to the next server render for up to 5 minutes,
      // and since server-provided content wins on first render (see
      // useEditableContent), that stale copy overwrites the fresh edit on
      // reload instead of the other way around.
      next: { revalidate: 300, tags: [`content:${normalizedPath}`] },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    // A backend outage must degrade to the client fetch, never fail the build.
    return null;
  }
}
