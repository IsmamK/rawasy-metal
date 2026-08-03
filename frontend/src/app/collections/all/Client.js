"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PageBackdrop from "@/components/PageBackdrop";

const HEADINGS = {
  EN: "All Curtain Collections",
  DE: "Alle Vorhangkollektionen",
  AR: "جميع مجموعات الستائر",
  FR: "Toutes les collections de rideaux",
  IT: "Tutte le collezioni di tende",
  ES: "Todas las colecciones de cortinas",
};

// Mirrors `normalizeCollectionHref` in Home/CollectionsSection.js — the
// "Link / Href" field admins fill in is free text, so a bare category key
// (e.g. "office") needs to resolve to "/collections/office" rather than be
// treated as a path relative to this page.
const normalizeCollectionHref = (href) => {
  const trimmed = String(href || "").trim();
  if (!trimmed) return "/collections/home";
  if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) return trimmed;
  return `/collections/${trimmed.replace(/^collections\//, "")}`;
};

/**
 * Full listing of every curtain collection, cursor-paginated against
 * `/api/home/service/collections/` (see backend/api/views.py's
 * `HomeServiceCollectionsView`). The first page is rendered server-side (see
 * `page.js`) and passed in as props so it's part of the real HTML; this
 * component only fetches further pages, quietly, as the visitor scrolls near
 * the bottom — no "Load More" button and no loading indicator, since each
 * page is small enough to arrive well before the sentinel comes into view.
 */
export default function CollectionsAllClient({
  initialItems = [],
  initialNextCursor = null,
  initialCount = 0,
  pageSize = 16,
}) {
  const { lang } = useLanguage();

  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [count, setCount] = useState(initialCount);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const requestId = useRef(0);
  const fetchingRef = useRef(false);
  const sentinelRef = useRef(null);

  // The server rendered the first page in English. If the visitor's stored
  // language preference is something else, this replaces it client-side —
  // the only place this component ever shows anything resembling a loading
  // state is this one-time swap, not the scroll-triggered pagination below.
  const initialLangRef = useRef(lang);

  const fetchPage = useCallback(
    async (cursor, { replace }) => {
      const thisRequest = ++requestId.current;
      fetchingRef.current = true;

      const params = new URLSearchParams({
        lang,
        page_size: String(pageSize),
      });
      if (cursor) params.set("cursor", cursor);

      try {
        const response = await fetch(
          `${apiUrl}/home/service/collections/?${params.toString()}`
        );
        if (!response.ok) throw new Error("Failed to load collections");

        const data = await response.json();
        if (thisRequest !== requestId.current) return;

        const results = Array.isArray(data.results) ? data.results : [];
        setItems((prev) => (replace ? results : [...prev, ...results]));
        setNextCursor(data.next_cursor || null);
        setCount(typeof data.count === "number" ? data.count : results.length);
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        if (thisRequest === requestId.current) {
          fetchingRef.current = false;
        }
      }
    },
    [apiUrl, lang, pageSize]
  );

  useEffect(() => {
    if (lang === initialLangRef.current) return;
    initialLangRef.current = lang;
    fetchPage(null, { replace: true });
  }, [lang, fetchPage]);

  // Infinite scroll: observe a sentinel just below the grid and load the
  // next cursor page the moment it approaches the viewport, so the next
  // batch is already in place before the visitor actually reaches the
  // bottom — no visible loading pause, no button to click.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          nextCursor &&
          !fetchingRef.current
        ) {
          fetchPage(nextCursor, { replace: false });
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextCursor, fetchPage]);

  const heading = HEADINGS[lang] || HEADINGS.EN;

  return (
    <>
      {/* Same viewport-anchored parallax backdrop used on Home/About. */}
      <PageBackdrop />

      <section
        className="relative min-h-screen"
        style={{ paddingTop: "var(--navbar-h)" }}
      >
        {/* A soft white "glass" wash over the backdrop, matching the tone
            used on the About page's story/capabilities sections — not a
            dark tint, since this page shares the same light backdrop. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/60 via-white/40 to-white/60 backdrop-blur-[2px]" />

        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 xl:px-20 2xl:px-32">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#07619b] to-[#279ccb] bg-clip-text text-transparent">
              {heading}
            </h1>
            <div className="w-24 h-[5px] mx-auto mt-4 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {items.map((item, index) => (
              <Link
                key={`${item.key}-${index}`}
                href={normalizeCollectionHref(item.href)}
                className="group collections-reveal"
              >
                <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_25px_60px_rgba(212,175,55,0.35)]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-all duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[#D4AF37]/20 to-transparent transition duration-500 pointer-events-none" />

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl md:text-2xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <div className="w-10 h-[2px] mt-2 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] group-hover:w-20 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Scroll sentinel — invisible, just a trigger for the next page. */}
          {nextCursor && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}

          {!nextCursor && count > 0 && (
            <p className="text-center text-[#4b3f32]/50 text-sm mt-14">
              {items.length} / {count}
            </p>
          )}
        </div>
      </section>

      <FloatingWhatsApp />
    </>
  );
}
