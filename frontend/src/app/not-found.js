import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

// The root layout sets a site-wide `index, follow`, which this route inherits
// and which directly contradicts the `noindex` Next emits for not-found. The
// explicit override below replaces the inherited value so the two robots tags
// agree.
export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections/home", label: "Home Curtains" },
  { href: "/collections/office", label: "Office Curtains" },
  { href: "/collections/medical-clinic", label: "Medical & Clinic Curtains" },
  { href: "/collections/accessories", label: "Curtain Accessories" },
  { href: "/quotation", label: "Request a Quotation" },
];

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#b4a389]">
          404
        </p>

        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-[#8f744e]">
          We couldn&apos;t find that page
        </h1>

        <p className="mt-4 text-gray-600">
          The page you were looking for may have moved or no longer exists.
          Browse our curtain collections below, or ask us directly.
        </p>

        {/* Internal links give the crawler somewhere to go instead of a dead
            end, and give a lost visitor a route back into the catalogue. */}
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-block px-4 py-2 rounded-xl border border-[#8f744e]/30 text-[#8f744e] font-medium hover:bg-[#8f744e] hover:text-white transition"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-gray-500">
          {SITE_NAME} — luxury curtains, blinds and window treatments.
        </p>
      </div>
    </div>
  );
}
