import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

/**
 * Web app manifest. Gives the site a proper name and theme colour when it is
 * added to a phone home screen, and clears the Lighthouse PWA/installability
 * warnings that a missing manifest triggers.
 */
export default function manifest() {
  return {
    name: `${SITE_NAME} — Luxury Curtains & Window Treatments`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#8f744e",
    icons: [
      {
        src: "/curtains-logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
