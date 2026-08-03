import { ImageResponse } from "next/og";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

/**
 * Social share card, generated at build time.
 *
 * Replaces the old approach of reusing /curtains-hero.png: that was 1536x1024,
 * so every platform cropped it to an unpredictable 1.91:1 slice, and at 702 KB
 * it was slow for crawlers to fetch. This renders exactly 1200x630.
 *
 * The background is flat rather than a gradient on purpose: ImageResponse emits
 * PNG, and a smooth gradient dithers into a ~256 KB file where flat colour
 * fields compress to a fraction of that.
 *
 * File-based convention: Next attaches this to every route automatically,
 * including og:image:width/height/type, so no route has to declare it.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} — luxury curtains and window treatments`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "90px",
          background: "#2d2419",
          borderLeft: "28px solid #8f744e",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#e4d8c4",
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Luxury Curtains &amp; Window Treatments
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 30,
            lineHeight: 1.4,
            maxWidth: 860,
            color: "#efe7db",
          }}
        >
          {DEFAULT_DESCRIPTION}
        </div>

        <div
          style={{
            marginTop: 44,
            height: 8,
            width: 200,
            background: "#e4d8c4",
            borderRadius: 4,
          }}
        />
      </div>
    ),
    size
  );
}
