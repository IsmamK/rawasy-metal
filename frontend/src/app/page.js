import HomeClient from "./HomeClient";
import { SITE_NAME, buildMetadata } from "@/lib/seo";
import { getServerContent } from "@/lib/serverContent";

/**
 * Server wrapper. The interactive homepage lives in HomeClient; this file
 * exists so the route can export metadata, which a client component cannot do.
 */
export const metadata = buildMetadata({
  title: `${SITE_NAME} — Luxury Curtains & Window Treatments`,
  description:
    "Discover premium curtains and blinds for homes, offices and clinics. Custom-made designs, expert measuring and professional installation.",
  path: "/",
  absoluteTitle: true,
  keywords: ["curtains Dubai", "curtain shop UAE", "made-to-measure curtains"],
});

export default async function Page() {
  /**
   * Every homepage section used to fetch its own copy in the browser and render
   * a spinner until it arrived. That put the LCP element behind
   * bundle-download -> hydrate -> API round-trip, which Lighthouse measured as
   * ~6.6s of "element render delay", and left the served HTML with no <h1> and
   * no body copy for crawlers.
   *
   * Fetching here instead means the markup ships complete. Requests run in
   * parallel so the page costs one round-trip, not five chained ones.
   */
  const [hero, about, collections, featured, help] = await Promise.all([
    getServerContent("home/hero/"),
    getServerContent("home/about/"),
    getServerContent("home/service/"),
    getServerContent("home/industry/"),
    getServerContent("home/contact/"),
  ]);

  return (
    <HomeClient
      content={{ hero, about, collections, featured, help }}
    />
  );
}
