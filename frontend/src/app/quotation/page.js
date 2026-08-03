import QuotationClient from "./QuotationClient";
import { buildMetadata } from "@/lib/seo";
import { getServerContent } from "@/lib/serverContent";

export const metadata = buildMetadata({
  title: "Request a Free Quotation",
  description:
    "Tell us about your windows and get a free, no-obligation quote for custom curtains and blinds, including measuring and installation.",
  path: "/quotation",
  keywords: ["curtain quotation", "free curtain quote", "curtain measuring service"],
});

export default async function Page() {
  // Seeds the client hook so the heading and body copy are in the server HTML
  // instead of behind a loading spinner.
  const initialContent = await getServerContent("contact/contact1/");

  return <QuotationClient initialContent={initialContent} />;
}
