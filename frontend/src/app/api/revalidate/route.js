import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Busts a Next.js Data Cache tag right after an admin save.
 *
 * Server-rendered pages (e.g. /collections/[category]) fetch content with a
 * 300s `revalidate` window, so a category or product added via the client
 * PATCH would be invisible to the next server navigation for up to 5 minutes
 * without this — long enough to look like "adding it just doesn't work".
 */
export async function POST(request) {
  const { tag } = await request.json().catch(() => ({}));

  if (!tag || typeof tag !== "string") {
    return NextResponse.json({ error: "tag is required" }, { status: 400 });
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, tag });
}
