import { redirect } from "next/navigation";

// /collections has no content of its own — it sends visitors to the default
// category. This used to happen in a client `useEffect`, which shipped a JS
// bundle, hydrated, and only then navigated: users saw a blank flash and
// crawlers could index an empty page. A server redirect issues a real 307
// before anything renders.
export default function CollectionsRootPage() {
  redirect("/collections/home");
}
