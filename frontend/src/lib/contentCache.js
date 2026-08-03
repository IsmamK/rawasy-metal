/**
 * Shared fetch layer for the editable CMS-style content endpoints.
 *
 * Every section component used to fetch its endpoint independently with a bare
 * `fetch()` inside `useEffect`, with no cleanup and no coordination. That meant
 * a full round trip per component on every mount (so revisiting a page refetched
 * content that had not changed), duplicate concurrent requests when two
 * components shared an endpoint, and in-flight requests left running after the
 * user had already navigated away.
 *
 * This module provides:
 *   - a short-lived response cache, so remounting does not refetch
 *   - request de-duplication, so concurrent callers share one network request
 *   - reference-counted cancellation: the underlying request is aborted only
 *     once every consumer has detached, so a real abort still shows up in
 *     DevTools without one unmounting component killing another's data
 */

const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * url -> { data, storedAt }
 *
 * Holds content in its *normalized* shape, so a cache hit can be rendered
 * without re-running the caller's normalizer (and so an admin save can write
 * the updated content straight back in).
 */
const responseCache = new Map();

/** url -> { promise, controller, consumers } */
const inFlight = new Map();

export function readCachedContent(url) {
  const entry = responseCache.get(url);
  if (!entry) return undefined;

  if (Date.now() - entry.storedAt > CACHE_TTL_MS) {
    responseCache.delete(url);
    return undefined;
  }

  return entry.data;
}

export function writeCachedContent(url, data) {
  responseCache.set(url, { data, storedAt: Date.now() });
}

export function invalidateContent(url) {
  responseCache.delete(url);
}

/**
 * Start (or join) a request for `url`.
 *
 * Returns the shared promise plus a `release` callback the caller must invoke
 * when it no longer wants the result — typically from an effect cleanup.
 */
export function requestContent(url, { force = false } = {}) {
  if (force) {
    responseCache.delete(url);
  }

  let entry = inFlight.get(url);

  if (!entry) {
    const controller = new AbortController();
    entry = { controller, consumers: 0, promise: null };

    entry.promise = (async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed (${response.status}): ${url}`);
        }

        // Caching is left to the caller, which stores the normalized shape.
        return await response.json();
      } finally {
        inFlight.delete(url);
      }
    })();

    // Keep an abandoned request (every consumer released) from surfacing as an
    // unhandled rejection. Live consumers still receive it through their own
    // await, and treat AbortError as a non-error.
    entry.promise.catch(() => {});

    inFlight.set(url, entry);
  }

  entry.consumers += 1;
  let released = false;

  const release = () => {
    if (released) return;
    released = true;
    entry.consumers -= 1;

    if (entry.consumers <= 0) {
      entry.controller.abort();
      inFlight.delete(url);
    }
  };

  return { promise: entry.promise, release };
}

export function isAbortError(error) {
  return error?.name === "AbortError";
}

/** Test/debug helper — drops all cached content and pending requests. */
export function resetContentCache() {
  responseCache.clear();
  inFlight.clear();
}
