// Define the available built-in category keys. These are used to
// pre-generate the original category routes. Categories created later
// from the editor still work through the same dynamic [category] route.

import CollectionsCategoryClient from "./Client";
import {
  getCategories,
  getCategory,
  getCollectionsContent,
  humanizeCategoryKey,
} from "@/lib/collectionsData";
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  buildMetadata,
  jsonLd,
} from "@/lib/seo";

const CATEGORIES = [
  { key: "home" },
  { key: "office" },
  { key: "medical-clinic" },
  { key: "accessories" },
];

// Existing fallback product data is preserved.
const DUMMY_PRODUCTS = [
  { id: 1, name: "Luxury Velvet Curtain", image: "/curtain_home.png", category: "home" },
  { id: 2, name: "Minimal Sheer Curtain", image: "/curtain_home.png", category: "home" },
  { id: 9, name: "Luxury Velvet Curtain", image: "/curtain_home.png", category: "home" },
  { id: 10, name: "Minimal Sheer Curtain", image: "/curtain_home.png", category: "home" },
  { id: 11, name: "Luxury Velvet Curtain", image: "/curtain_home.png", category: "home" },
  { id: 12, name: "Minimal Sheer Curtain", image: "/curtain_home.png", category: "home" },
  { id: 3, name: "Premium Office Blind", image: "/curtain_office.png", category: "office" },
  { id: 4, name: "Executive Office Curtain", image: "/curtain_office.png", category: "office" },
  { id: 5, name: "Hospital Privacy Curtain", image: "/curtain_medical.png", category: "medical-clinic" },
  { id: 6, name: "Clinic Divider Curtain", image: "/curtain_medical.png", category: "medical-clinic" },
  { id: 7, name: "Industrial Heat Resistant Curtain", image: "/curtain_industry.png", category: "accessories" },
  { id: 8, name: "Warehouse Partition Curtain", image: "/curtain_industry.png", category: "accessories" },
];

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.key }));
}

// Keep runtime-created category paths available even though they were
// not present during the build.
export const dynamicParams = true;

/**
 * Per-category metadata. This is the most valuable SEO surface on the site —
 * one indexable page per category, each targeting its own keywords, instead of
 * every route inheriting a single site-wide title.
 */
export async function generateMetadata({ params }) {
  const { category: categoryKey } = await params;
  const { category, products } = await getCategory(categoryKey);

  const label = category?.label || humanizeCategoryKey(categoryKey);
  const productCount = products.length;

  const description = productCount
    ? `Browse ${productCount} ${label.toLowerCase()} curtain and blind designs. Custom sizing, premium fabrics, professional measuring and installation from ${SITE_NAME}.`
    : `Explore our ${label.toLowerCase()} curtain and blind collection. Custom sizing, premium fabrics and professional installation from ${SITE_NAME}.`;

  return buildMetadata({
    title: `${label} Curtains & Blinds`,
    description,
    path: `/collections/${categoryKey}`,
    keywords: [
      `${label} curtains`,
      `${label} blinds`,
      `${label.toLowerCase()} window treatments`,
    ],
  });
}

function buildJsonLd(categoryKey, label, products) {
  const categoryUrl = absoluteUrl(`/collections/${categoryKey}`);

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: absoluteUrl("/collections"),
      },
      { "@type": "ListItem", position: 3, name: label, item: categoryUrl },
    ],
  };

  const itemList = {
    "@type": "ItemList",
    name: `${label} Curtains & Blinds`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description || undefined,
        image: product.image ? absoluteUrl(product.image) : undefined,
        url: categoryUrl,
        // No `offers` node: this is a showcase catalogue, not a shop. Prices are
        // quoted per-job over WhatsApp, so declaring an Offer would publish a
        // price the page never shows — which Google treats as a mismatch.
        brand: { "@type": "Brand", name: SITE_NAME },
        ...(product.rating && product.reviews
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: Number(product.rating),
                reviewCount: Number(product.reviews),
              },
            }
          : {}),
      },
    })),
  };

  return { "@context": "https://schema.org", "@graph": [breadcrumb, itemList] };
}

export default async function Page({ params }) {
  const { category: rawCategory } = await params;
  const categoryKey = String(rawCategory || "home");

  const { category, products } = await getCategory(categoryKey);
  const label = category?.label || humanizeCategoryKey(categoryKey);

  // Same request as getCategory above — `fetch` dedupes it within a render, so
  // this costs nothing and gives the client its content without a second trip.
  const initialContent = await getCollectionsContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(buildJsonLd(categoryKey, label, products)),
        }}
      />

      <CollectionsCategoryClient
        categoryKey={categoryKey}
        categories={CATEGORIES}
        products={DUMMY_PRODUCTS}
        initialContent={initialContent}
      />
    </>
  );
}
