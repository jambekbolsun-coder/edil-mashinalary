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
    });
    if (error) throw error;
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сохранить заявку";
    return Response.json({ error: message }, { status: 400 });
  }
}
