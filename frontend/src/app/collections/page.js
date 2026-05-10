"use client";

// This page acts as a simple redirect to the default category
// ("home").  It runs on the client to avoid a full page refresh.
// When a user navigates to /collections without a category
// specified, they are automatically sent to /collections/home.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CollectionsRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/collections/home");
  }, [router]);
  return null;
}