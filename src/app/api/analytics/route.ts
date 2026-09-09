import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const eventSchema = z.object({
  eventName: z.enum(["page_view", "equipment_view", "catalog_search", "form_started", "form_submitted", "whatsapp_clicked", "instagram_clicked", "phone_clicked"]),
  path: z.string().max(500).nullable(),
  equipmentSlug: z.string().max(100).nullable(),
  anonymousId: z.string().uuid(),
  sessionId: z.string().uuid(),
  locale: z.enum(["ru", "ky", "en", "tr", "zh"]),
  referrerHost: z.string().max(160).nullable(),
  utmSource: z.string().max(120).nullable(),
  utmMedium: z.string().max(120).nullable(),
  utmCampaign: z.string().max(120).nullable(),
  metadata: z.record(z.string(), z.union([z.string().max(200), z.number(), z.boolean(), z.null()])).default({}),
});

export async function POST(request: Request) {
  if (!request.headers.get("cookie")?.includes("edil_cookie_consent=analytics")) return new Response(null, { status: 204 });
  if (!hasSupabaseEnv()) return new Response(null, { status: 204 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 8_000) return new Response(null, { status: 413 });
  try {
    const data = eventSchema.parse(await request.json());
    const supabase = await createClient();
    const { error } = await supabase.from("analytics_events").insert({
      event_name: data.eventName,
      path: data.path,
      equipment_slug: data.equipmentSlug,
      anonymous_id: data.anonymousId,
      session_id: data.sessionId,
      locale: data.locale,
      referrer_host: data.referrerHost,
      utm_source: data.utmSource,
      utm_medium: data.utmMedium,
      utm_campaign: data.utmCampaign,
      metadata: data.metadata,
    });
    return new Response(null, { status: error ? 400 : 201 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
