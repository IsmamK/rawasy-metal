

// Define the available category keys.  These keys should correspond
// exactly to the translation keys defined under the `collections`

import CollectionsCategoryClient from "./Client";

// section of your LanguageContext (e.g. "home" -> "collections.home").
const CATEGORIES = [
  { key: "home" },
  { key: "office" },
  { key: "medical-clinic" },
  { key: "accessories" },
];

// Example product data.  Replace this with a real data source (API
// fetch, CMS, etc.) in a production application.  Each product
// includes a `category` field that must match one of the keys in
// CATEGORIES.
const DUMMY_PRODUCTS = [
  { id: 1, name: "Luxury Velvet Curtain", price: 4500, image: "/curtain_home.png", category: "home" },
  { id: 2, name: "Minimal Sheer Curtain", price: 1800, image: "/curtain_home.png", category: "home" },
  { id: 9, name: "Luxury Velvet Curtain", price: 4500, image: "/curtain_home.png", category: "home" },
  { id: 10, name: "Minimal Sheer Curtain", price: 1800, image: "/curtain_home.png", category: "home" },
  { id: 11, name: "Luxury Velvet Curtain", price: 4500, image: "/curtain_home.png", category: "home" },
  { id: 12, name: "Minimal Sheer Curtain", price: 1800, image: "/curtain_home.png", category: "home" },
  { id: 3, name: "Premium Office Blind", price: 3200, image: "/curtain_office.png", category: "office" },
  { id: 4, name: "Executive Office Curtain", price: 5200, image: "/curtain_office.png", category: "office" },
  { id: 5, name: "Hospital Privacy Curtain", price: 2600, image: "/curtain_medical.png", category: "medical-clinic" },
  { id: 6, name: "Clinic Divider Curtain", price: 2100, image: "/curtain_medical.png", category: "medical-clinic" },
  { id: 7, name: "Industrial Heat Resistant Curtain", price: 7900, image: "/curtain_industry.png", category: "accessories" },
  { id: 8, name: "Warehouse Partition Curtain", price: 6400, image: "/curtain_industry.png", category: "accessories" },
];

// In the Next.js App Router, defining this function generates
// static routes for each category at build time (e.g. /collections/home,
// /collections/office, etc.).  If you add new categories, update
// the CATEGORIES array and this will automatically adjust.
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.key }));
}

// The page component reads the dynamic segment from `params` and
// passes the appropriate category key into the client component along
// with the full list of categories and products.  If no category is
// specified, "home" is used as the default.
export default function Page({ params }) {
  const categoryKey = String(params?.category || "home");
  return (
    <CollectionsCategoryClient
      categoryKey={categoryKey}
      categories={CATEGORIES}
      products={DUMMY_PRODUCTS}
    />
  );
}