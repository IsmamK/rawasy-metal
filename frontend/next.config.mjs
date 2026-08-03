/**
 * Derive the image host from NEXT_PUBLIC_API_URL so admin-uploaded media served
 * by Django can be optimized by next/image in every environment without having
 * to hardcode a domain here. Falls back to the local dev backend.
 */
function backendImagePattern() {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000/api";

  try {
    const { protocol, hostname, port } = new URL(raw);
    return {
      protocol: protocol.replace(":", ""),
      hostname,
      ...(port ? { port } : {}),
      pathname: "/media/**",
    };
  } catch {
    return null;
  }
}

const remotePatterns = [
  // Local Django dev server.
  {
    protocol: "http",
    hostname: "localhost",
    port: "8000",
    pathname: "/media/**",
  },
  backendImagePattern(),
].filter(Boolean);

// Opt-in bundle inspection: `ANALYZE=true npm run build` writes treemap
// reports to .next/analyze. Dev-only — it does not affect production output.
const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Keep server rendering enabled for dynamic routes.
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [64, 128, 256, 384, 475, 640],
    minimumCacheTTL: 2592000,
    remotePatterns,
  },
  /**
   * Files in /public are served with `cache-control: public, max-age=0` by
   * default, so the ~1 MB hover-preview videos and the hero artwork are
   * re-fetched on every visit. Unlike /_next/static these filenames are not
   * content-hashed, so `immutable` would strand a replaced asset in caches —
   * hence a one-day freshness window with a week of stale-while-revalidate,
   * which serves instantly and refreshes in the background.
   */
  async headers() {
    return [
      {
        source: "/:path*.(mp4|webm|gif|png|jpg|jpeg|svg|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  // NOTE: no `experimental.optimizePackageImports` here on purpose — Next 15
  // already applies it to react-icons and lucide-react by default. Setting it
  // explicitly measured as a byte-for-byte no-op.
};

export default withBundleAnalyzer(nextConfig);
