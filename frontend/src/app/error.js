"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary. Without one, an uncaught render error shows
 * Next's unstyled default page with no way back into the site.
 *
 * Must be a client component — `reset` re-runs the failed render.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Digest is the only identifier available for a server error in production;
    // the message itself is redacted before it reaches the browser.
    console.error("Route error:", error?.digest ?? error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#8f744e]">
          Something went wrong
        </h1>

        <p className="mt-4 text-gray-600">
          We hit an unexpected problem loading this page. Please try again.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl text-white font-semibold bg-[#8f744e] hover:opacity-90 transition"
          >
            Try again
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-[#8f744e]/30 text-[#8f744e] font-semibold hover:bg-[#8f744e] hover:text-white transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
