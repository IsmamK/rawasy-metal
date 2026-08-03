"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  invalidateContent,
  isAbortError,
  readCachedContent,
  requestContent,
  writeCachedContent,
} from "@/lib/contentCache";

/**
 * Loads content for one of the editable CMS endpoints.
 *
 * Replaces the copy-pasted `useEffect` + `fetch` + `setData`/`setTempData`
 * block that appeared in every section component. On top of removing the
 * duplication it fixes three problems those copies shared:
 *
 *   1. No cleanup — a request left running after unmount both wasted bandwidth
 *      and resolved into a component that no longer existed.
 *   2. No cache — every mount refetched, so navigating back to a page showed a
 *      loading spinner for content that had not changed.
 *   3. Stale responses could overwrite fresh ones when `endpoint` changed
 *      mid-flight; results from a superseded request are now discarded.
 *
 * `normalize` and `buildFallback` are held in refs, so callers can pass inline
 * functions without retriggering the fetch on every render.
 *
 * @param {string} endpoint
 * @param {object} options
 * @param {(json: unknown) => object} options.normalize   Shape the API response.
 * @param {() => object} options.buildFallback            Content to use if the request fails.
 * @param {object}   [options.initialContent]             Raw API payload already
 *   fetched on the server. Seeding with it means the very first client render
 *   matches the server HTML, so the real content is present for crawlers and
 *   there is no post-hydration content swap.
 */
export default function useEditableContent(
  endpoint,
  { normalize, buildFallback, initialContent }
) {
  const normalizeRef = useRef(normalize);
  const buildFallbackRef = useRef(buildFallback);

  useEffect(() => {
    normalizeRef.current = normalize;
    buildFallbackRef.current = buildFallback;
  });

  // Seed straight from cache so a remount renders real content immediately
  // instead of flashing a spinner. With no cache entry we seed the fallback,
  // matching what these components previously used as initial state, so `data`
  // is never null and consumers need no extra guards.
  const [initial] = useState(() => {
    // Server-provided content wins on the first render. Reading the cache here
    // instead would let a stale client cache produce markup that differs from
    // the server HTML, which React reports as a hydration mismatch.
    if (initialContent !== undefined && initialContent !== null) {
      const value = normalizeRef.current(initialContent);
      // Seed the cache too, so the mount-time `load()` short-circuits instead
      // of refetching content the server just handed us. Writing the same value
      // twice under StrictMode's double-invoke is harmless.
      writeCachedContent(endpoint, value);
      return { value, fromCache: true };
    }

    const cached = readCachedContent(endpoint);
    return {
      // Cached content is stored already normalized.
      value: cached === undefined ? buildFallbackRef.current() : cached,
      fromCache: cached !== undefined,
    };
  });

  const [data, setDataState] = useState(initial.value);
  const [tempData, setTempData] = useState(initial.value);
  const [isLoading, setIsLoading] = useState(!initial.fromCache);

  // Mirrors `data` so the exported setter can resolve updater functions without
  // doing cache writes inside a state updater (React may invoke those twice).
  const dataRef = useRef(initial.value);

  const commit = useCallback(
    (value, { cache = true } = {}) => {
      dataRef.current = value;
      if (cache) writeCachedContent(endpoint, value);
      setDataState(value);
      setTempData(value);
    },
    [endpoint]
  );

  /**
   * Exposed as `setData`. Admin saves call it with the server's response, so it
   * writes through to the cache — otherwise a later remount would resurrect the
   * pre-edit content.
   */
  const setData = useCallback(
    (next) => {
      const resolved = typeof next === "function" ? next(dataRef.current) : next;
      dataRef.current = resolved;
      writeCachedContent(endpoint, resolved);
      setDataState(resolved);
    },
    [endpoint]
  );

  const load = useCallback(
    ({ force } = {}) => {
      const cached = force ? undefined : readCachedContent(endpoint);

      if (cached !== undefined) {
        commit(cached, { cache: false });
        setIsLoading(false);
        return undefined;
      }

      let active = true;
      setIsLoading(true);

      const { promise, release } = requestContent(endpoint, { force });

      promise
        .then((json) => {
          // `active` is false when the endpoint changed or the component
          // unmounted, so a slow earlier response can never land on top of a
          // newer one.
          if (!active) return;
          commit(normalizeRef.current(json));
        })
        .catch((error) => {
          if (!active || isAbortError(error)) return;
          console.error(`Error fetching ${endpoint}:`, error);
          // Fallback content is not cached — it is a placeholder for a failed
          // request, not a real response.
          commit(buildFallbackRef.current(), { cache: false });
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });

      return () => {
        active = false;
        release();
      };
    },
    [endpoint, commit]
  );

  useEffect(() => load(), [load]);

  /** Refetch, bypassing the cache. Call after saving an admin edit. */
  const refresh = useCallback(() => {
    invalidateContent(endpoint);
    load({ force: true });
  }, [endpoint, load]);

  return { data, setData, tempData, setTempData, isLoading, refresh };
}
