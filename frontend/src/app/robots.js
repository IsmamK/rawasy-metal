import { SITE_URL, absoluteUrl } from "@/lib/seo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // NOTE: /showforms is deliberately NOT disallowed here. It carries a
      // `noindex` robots tag, and a crawler blocked by robots.txt never fetches
      // the page, so it would never see that tag — the URL could still surface
      // in results as a bare link. Allowing the crawl lets noindex do its job.
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
