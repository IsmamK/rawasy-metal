/**
 * Central SEO configuration.
 *
 * Everything canonical-URL shaped flows through here so there is one place to
 * change when the production domain moves. `NEXT_PUBLIC_SITE_URL` overrides the
 * default at build time.
 */

// Matches ALLOWED_HOSTS / CORS_ALLOWED_ORIGINS in backend/backend/settings.py.
const DEFAULT_SITE_URL = "https://skfcurtains.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
).replace(/\/$/, "");

export const SITE_NAME = "SKF Curtains";

export const DEFAULT_DESCRIPTION =
  "Premium designer curtains and blinds for homes, offices and clinics. Custom designs, professional installation and exceptional quality.";

export const DEFAULT_KEYWORDS = [
  "curtains",
  "window treatments",
  "luxury curtains",
  "custom curtains",
  "blinds",
  "home decor",
];

// NOTE: there is deliberately no OG_IMAGE constant. The share card is generated
// at the correct 1200x630 by `app/opengraph-image.js`, which Next attaches to
// every route automatically. Declaring `openGraph.images` anywhere would
// override that convention and win — so pages stay silent unless they genuinely
// have their own artwork to pass to `buildMetadata`.

// NOTE: there is deliberately no PRICE_CURRENCY constant. The site is a
// showcase catalogue — no page renders a price, and quotes are given per-job
// over WhatsApp. Structured data must mirror what the page visibly shows, so
// Product nodes carry no `offers`.

/**
 * Real-world business details, used to build the LocalBusiness structured data
 * that drives Google Maps / local-pack results.
 *
 * ACTION REQUIRED: the fields marked below are unverified and are therefore
 * left empty on purpose — `businessJsonLd()` omits any empty field rather than
 * guessing. Publishing a wrong address or opening hours is worse than
 * publishing none, because Google cross-checks them against your Business
 * Profile and inconsistency suppresses the listing. Fill these in and they
 * appear automatically.
 */
export const BUSINESS = {
  // Verified: the number every WhatsApp button on the site already dials.
  telephone: "+971547219791",
  email: "skfcurtains@gmail.com",

  // No street/postal code given yet — only "Dubai" as the city. Left blank
  // rather than guessed; add them and they'll flow into the address block
  // automatically (see businessJsonLd() below).
  streetAddress: "",
  addressLocality: "Dubai",
  addressRegion: "Dubai",
  postalCode: "",
  // ISO 3166-1 alpha-2. "AE" is implied by the +971 dialling code above.
  addressCountry: "AE",

  sameAs: [
    "https://web.facebook.com/skfcurtains",
    // Tracking params (fbclid etc.) stripped — canonical profile URL only.
    "https://www.instagram.com/skfcurtains",
  ],

  // Sat-Thu 10:00-22:00, Fri 14:00-22:00 (schema.org opening-hours syntax).
  openingHours: ["Sa-Th 10:00-22:00", "Fr 14:00-22:00"],

  /** Dubai (and wider UAE) communities/areas the business serves. */
  areaServed: [
    "Dubai",
    "Sharjah",
    "Abu Dhabi",
    "Ras Al Khaimah",
    "Al Ain",
    "EMAAR South",
    "Dubai South",
    "Makhtoum City",
    "Remraam",
    "DAMAC Hills 1",
    "DAMAC Hills 2",
    "Mudon",
    "DAMAC Lagoons",
    "Dubai Sports City",
    "Dubai Motor City",
    "Jumeirah Village Circle",
    "Jumeirah Village Triangle",
    "Jumeirah Park",
    "Jumeirah Golf Estates",
    "Studio City",
    "Discovery Gardens",
    "The Gardens",
    "Jebel Ali",
    "Jebel Ali Free Zone",
    "Al Sufouh",
    "Dubai Industrial City",
    "Jumeirah Lakes Towers",
    "Dubai Marina",
    "Jumeirah Beach Residence",
    "Bluewaters Island",
    "Dubai Harbour",
    "Jumeirah",
    "Umm Suqeim",
    "The Springs",
    "Emirates Hills",
    "Jumeirah Islands",
    "Tecom",
    "Al Barsha",
    "Al Barsha South",
    "Dubai Hills Estate",
    "Arjan",
    "Arabian Ranches 1",
    "Arabian Ranches 2",
    "Arabian Ranches 3",
    "Dubai Land Residence Complex",
    "Dubai Silicon Oasis",
    "Nad Al Sheba",
    "Meydan",
    "Business Bay",
    "Downtown Dubai",
    "Dubai Creek Harbour",
    "Al Jadaf",
    "Nad Al Hamar",
    "Rashidiya",
    "Deira",
    "Bur Dubai",
    "Karama",
    "Al Jafiliya",
    "Al Wasl",
    "Dubai Maritime City",
    "Mirdif",
    "Al Mizhar",
    "Al Khawaneej",
    "Oud Metha",
    "Oud Al Muteena",
    "Al Warqa",
  ],
};

/** Drop keys whose value is empty, so no blank fields reach the JSON-LD. */
function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
  );
}

/**
 * LocalBusiness node. A curtains company selling measuring and installation is
 * a local service business, so this is the highest-value schema on the site —
 * it is what makes the map pack and "curtains near me" eligible.
 */
export function businessJsonLd() {
  const address = compact({
    "@type": "PostalAddress",
    streetAddress: BUSINESS.streetAddress,
    addressLocality: BUSINESS.addressLocality,
    addressRegion: BUSINESS.addressRegion,
    postalCode: BUSINESS.postalCode,
    addressCountry: BUSINESS.addressCountry,
  });

  return compact({
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl("/curtains-logo.png"),
    logo: absoluteUrl("/curtains-logo.png"),
    description: DEFAULT_DESCRIPTION,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    // Only meaningful once it has more than just a country code.
    address: Object.keys(address).length > 2 ? address : "",
    sameAs: BUSINESS.sameAs,
    openingHours: BUSINESS.openingHours,
    areaServed: BUSINESS.areaServed,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  });
}

export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Build a page's metadata with canonical URL and social tags filled in.
 * Root-level defaults (see app/layout.js) cover anything omitted.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  images,
  // Set when `title` already contains the brand, so the root layout's
  // "%s | SKF Curtains" template does not append it a second time.
  absoluteTitle = false,
  // Page-specific terms. Merged with (not replacing) the root layout's
  // site-wide list, since Next only applies the closest `keywords` it finds
  // rather than combining ancestor values itself.
  keywords,
}) {
  const canonical = absoluteUrl(path);
  // Social cards get no template applied, so build the full title here.
  const socialTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords
      ? { keywords: [...new Set([...keywords, ...DEFAULT_KEYWORDS])] }
      : {}),
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      // Omitted unless a caller passes artwork, so the generated
      // `opengraph-image` applies. Spreading `undefined` would blank it out.
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      ...(images
        ? { images: images.map((image) => image.url ?? image) }
        : {}),
    },
  };
}

/** Serialise a JSON-LD object for embedding in a <script> tag. */
export function jsonLd(data) {
  // Escape `<` so a value containing "</script>" cannot break out of the tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
