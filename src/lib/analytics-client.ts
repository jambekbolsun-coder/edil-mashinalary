"use client";

export type AnalyticsEventName =
  | "page_view"
  | "equipment_view"
  | "catalog_search"
  | "form_started"
  | "form_submitted"
  | "whatsapp_clicked"
  | "instagram_clicked"
  | "phone_clicked";

const consentCookie = "edil_cookie_consent=analytics";

function getId(storage: Storage, key: string) {
  const current = storage.getItem(key);
  if (current) return current;
  const value = crypto.randomUUID();
  storage.setItem(key, value);
  return value;
}

export function hasAnalyticsConsent() {
  return typeof document !== "undefined" && document.cookie.includes(consentCookie);
}

export async function trackEvent(eventName: AnalyticsEventName, details: Record<string, string | number | boolean | null> = {}) {
  if (!hasAnalyticsConsent()) return;
  const url = new URL(window.location.href);
  const referrerHost = document.referrer ? new URL(document.referrer).hostname.slice(0, 160) : null;
  const payload = {
    eventName,
    path: `${url.pathname}${url.search}`.slice(0, 500),
    equipmentSlug: url.pathname.startsWith("/catalog/") ? url.pathname.split("/")[2]?.slice(0, 100) : null,
    anonymousId: getId(localStorage, "edil_analytics_id"),
    sessionId: getId(sessionStorage, "edil_analytics_session"),
    locale: localStorage.getItem("edil-locale") || "ru",
    referrerHost,
    utmSource: url.searchParams.get("utm_source")?.slice(0, 120) || null,
    utmMedium: url.searchParams.get("utm_medium")?.slice(0, 120) || null,
    utmCampaign: url.searchParams.get("utm_campaign")?.slice(0, 120) || null,
    metadata: details,
  };
  await fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
