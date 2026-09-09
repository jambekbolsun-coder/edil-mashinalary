import { leadSchema } from "@/lib/validation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16_000) {
    return Response.json({ error: "Слишком большой запрос" }, { status: 413 });
  }

  try {
    const payload = leadSchema.parse(await request.json());
    if (!hasSupabaseEnv()) {
      return Response.json({ error: "Сервис заявок временно недоступен. Напишите нам в WhatsApp." }, { status: 503 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("leads").insert({
      name: payload.name,
      phone: payload.phone,
      preference: payload.preference,
      interest: payload.interest,
      comment: payload.comment,
      consent: payload.consent,
      source: payload.source,
      locale: payload.locale,
      landing_page: payload.landingPage || null,
      utm_source: payload.utmSource || null,
      utm_medium: payload.utmMedium || null,
      utm_campaign: payload.utmCampaign || null,
      utm_content: payload.utmContent || null,
      utm_term: payload.utmTerm || null,
      consent_version: "2026-09-09",
      consented_at: new Date().toISOString(),
    });
    if (error) throw error;
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сохранить заявку";
    return Response.json({ error: message }, { status: 400 });
  }
}
