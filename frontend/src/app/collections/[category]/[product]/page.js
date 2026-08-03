import { notFound } from "next/navigation";
import {
  getAllProducts,
  getCategory,
  getProduct,
  humanizeCategoryKey,
  productSlug,
} from "@/lib/collectionsData";
import { SITE_NAME, SITE_URL, absoluteUrl, buildMetadata, jsonLd } from "@/lib/seo";
import ProductDetail from "./ProductDetail";

/**
 * One indexable page per curtain.
 *
 * Previously products existed only inside a category's ItemList, so a search
 * for a specific curtain had nothing to land on. Each product now has its own
 * URL, heading, description and Product structured data.
 */

// Products are CMS-managed and can be created after a deploy, so unknown slugs
// must still render rather than 404 at the routing layer.
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getAllProducts();

  return products
    .filter((product) => product?.category && product?.name)
    .map((product) => ({
      category: String(product.category),
      product: productSlug(product),
    }));
}

export async function generateMetadata({ params }) {
  const { category: categoryKey, product: slug } = await params;
  const { category, product } = await getProduct(categoryKey, slug);

  if (!product) {
    // A missing product renders notFound() below; keep it out of the index.
    return { title: "Product Not Found", robots: { index: false, follow: true } };
  }

  const label = category?.label || humanizeCategoryKey(categoryKey);
  const description =
    product.description ||
    `${product.name} — a premium ${label.toLowerCase()} curtain from ${SITE_NAME}. Custom sizing, expert measuring and professional installation.`;

  return buildMetadata({
    title: product.name,
    description,
    path: `/collections/${categoryKey}/${slug}`,
    // Uses the product's own photo as the share card when it has one.
    images: product.image
      ? [{ url: absoluteUrl(product.image), alt: product.name }]
      : undefined,
    keywords: [product.name, `${label} curtains`, `${product.name} curtain`],
  });
}

function buildJsonLd({ categoryKey, label, product, slug }) {
  const productUrl = absoluteUrl(`/collections/${categoryKey}/${slug}`);

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: absoluteUrl(`/collections/${categoryKey}`),
      },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };

  const productNode = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: product.description || undefined,
    image: product.image ? absoluteUrl(product.image) : undefined,
    url: productUrl,
    category: label,
    brand: { "@type": "Brand", name: SITE_NAME },
    // No `offers`: this is a showcase catalogue and no price is shown. See
    // lib/seo.js.
    ...(product.rating && product.reviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.rating),
            reviewCount: Number(product.reviews),
          },
        }
      : {}),
  };

  return { "@context": "https://schema.org", "@graph": [breadcrumb, productNode] };
}

export default async function Page({ params }) {
  const { category: rawCategory, product: slug } = await params;
  const categoryKey = String(rawCategory || "");

  const { category, product } = await getProduct(categoryKey, slug);

  if (!product) notFound();

  const label = category?.label || humanizeCategoryKey(categoryKey);

  // Sibling products power the "more from this collection" links, which give
  // each product page internal links instead of leaving it an orphan.
  const { products: siblings } = await getCategory(categoryKey);
  const related = siblings
    .filter((entry) => productSlug(entry) !== slug)
    .slice(0, 4)
    .map((entry) => ({ ...entry, slug: productSlug(entry) }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(buildJsonLd({ categoryKey, label, product, slug })),
        }}
      />

      <ProductDetail
        product={product}
        categoryKey={categoryKey}
        categoryLabel={label}
        related={related}
      />
    </>
  );
}
