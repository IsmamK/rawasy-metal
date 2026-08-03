import CollectionsAllClient from "./Client";
import { buildMetadata } from "@/lib/seo";
import { getCollectionsPage } from "@/lib/serverContent";

const PAGE_SIZE = 16;

export function generateMetadata() {
  return buildMetadata({
    title: "All Curtain Collections",
    description:
      "Browse every curtain collection — home, office, medical & clinic, accessories and more.",
    path: "/collections/all",
  });
}

// Server-rendered: the first 16 collections are fetched here and sent down as
// real HTML, not fetched client-side after mount. The client component only
// takes over to fetch further pages as the visitor scrolls past this first
// batch.
export default async function CollectionsAllPage() {
  const firstPage = await getCollectionsPage({ pageSize: PAGE_SIZE });

  return (
    <CollectionsAllClient
      initialItems={firstPage?.results || []}
      initialNextCursor={firstPage?.next_cursor || null}
      initialCount={firstPage?.count || 0}
      pageSize={PAGE_SIZE}
    />
  );
}
