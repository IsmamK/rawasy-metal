import AboutClient from "./AboutClient";
import { buildMetadata } from "@/lib/seo";
import { getServerContent } from "@/lib/serverContent";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about our curtain and blind manufacturing, custom tailoring capabilities, and the team behind every installation.",
  path: "/about",
  keywords: ["curtain manufacturer", "curtain tailoring", "curtain installation team"],
});

export default async function Page() {
  // Seeds the client hook so the about copy is in the server HTML rather than
  // appearing only after hydration.
  const initialContent = await getServerContent("about/capabilities/");

  return <AboutClient initialContent={initialContent} />;
}
