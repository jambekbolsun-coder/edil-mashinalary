"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { hasAnalyticsConsent, trackEvent } from "@/lib/analytics-client";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const trackPage = () => {
      if (!hasAnalyticsConsent()) return;
      void trackEvent(pathname.startsWith("/catalog/") ? "equipment_view" : "page_view");
    };
    trackPage();
    window.addEventListener("edil-consent-changed", trackPage);
    return () => window.removeEventListener("edil-consent-changed", trackPage);
  }, [pathname, searchParams]);

  return null;
}
