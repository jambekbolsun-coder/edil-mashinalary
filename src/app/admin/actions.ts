"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { equipmentSchema } from "@/lib/validation";

function optionalNumber(value: FormDataEntryValue | null) {
  if (!value || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
}

export async function loginAction(formData: FormData) {
  if (!hasSupabaseEnv()) redirect("/admin/login?error=not-configured");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/admin/login?error=missing");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=credentials");
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createEquipmentAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = equipmentSchema.safeParse({
    name: formData.get("name"), slug: formData.get("slug"), brand: formData.get("brand"),
    category: formData.get("category"), status: formData.get("status"),
    description: formData.get("description"), price: optionalNumber(formData.get("price")),
    published: formData.get("published") === "on", featured: formData.get("featured") === "on",
  });
  if (!parsed.success) redirect("/admin/catalog/new?error=validation");

  const files = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 6);
  const imageUrls: string[] = [];
  for (const file of files) {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/) || file.size > 8 * 1024 * 1024) continue;
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${parsed.data.slug}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from("equipment").upload(path, file, { contentType: file.type, upsert: false });
    if (!error) imageUrls.push(supabase.storage.from("equipment").getPublicUrl(path).data.publicUrl);
  }

  const shortDescription = String(formData.get("short_description") ?? parsed.data.description.slice(0, 180)).trim();
  const equipment = String(formData.get("equipment") ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
  const keywords = String(formData.get("keywords") ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  const { error } = await supabase.from("equipment").insert({
    ...parsed.data,
    old_price: optionalNumber(formData.get("old_price")), down_payment: optionalNumber(formData.get("down_payment")), monthly_payment: optionalNumber(formData.get("monthly_payment")),
    installment_months: optionalNumber(formData.get("installment_months")) ?? 12,
    bucket: String(formData.get("bucket") ?? "").trim() || null, load_capacity: String(formData.get("load_capacity") ?? "").trim() || null,
    power: optionalNumber(formData.get("power")), engine: String(formData.get("engine") ?? "").trim() || null,
    warranty_hours: optionalNumber(formData.get("warranty_hours")) ?? 3000,
    promo: String(formData.get("promo") ?? "").trim() || null, short_description: shortDescription,
    images: imageUrls.length ? imageUrls : ["/images/hero-fleet.png"], specs: [], equipment, keywords,
  });
  if (error) redirect(`/admin/catalog/new?error=${encodeURIComponent(error.code ?? "database")}`);
  revalidatePath("/catalog"); revalidatePath("/admin/catalog");
  redirect("/admin/catalog?created=1");
}

export async function toggleEquipmentAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  await supabase.from("equipment").update({ published: !published }).eq("id", id);
  revalidatePath("/catalog"); revalidatePath("/admin/catalog");
}

export async function updateEquipmentAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = equipmentSchema.safeParse({
    name: formData.get("name"), slug: formData.get("slug"), brand: formData.get("brand"), category: formData.get("category"),
    status: formData.get("status"), description: formData.get("description"), price: optionalNumber(formData.get("price")),
    published: formData.get("published") === "on", featured: formData.get("featured") === "on",
  });
  if (!id || !parsed.success) redirect(`/admin/catalog/${id}/edit?error=validation`);
  const files = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 6);
  const imageUrls: string[] = [];
  for (const file of files) {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/) || file.size > 8 * 1024 * 1024) continue;
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${parsed.data.slug}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from("equipment").upload(path, file, { contentType: file.type });
    if (!error) imageUrls.push(supabase.storage.from("equipment").getPublicUrl(path).data.publicUrl);
  }
  const update: Record<string, unknown> = {
    ...parsed.data, short_description: String(formData.get("short_description") ?? "").trim(), old_price: optionalNumber(formData.get("old_price")),
    down_payment: optionalNumber(formData.get("down_payment")), monthly_payment: optionalNumber(formData.get("monthly_payment")),
    installment_months: optionalNumber(formData.get("installment_months")) ?? 12, bucket: String(formData.get("bucket") ?? "").trim() || null,
    load_capacity: String(formData.get("load_capacity") ?? "").trim() || null, power: optionalNumber(formData.get("power")),
    engine: String(formData.get("engine") ?? "").trim() || null, warranty_hours: optionalNumber(formData.get("warranty_hours")) ?? 3000,
    promo: String(formData.get("promo") ?? "").trim() || null,
    equipment: String(formData.get("equipment") ?? "").split("\n").map((item) => item.trim()).filter(Boolean),
    keywords: String(formData.get("keywords") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
  };
  if (imageUrls.length) update.images = imageUrls;
  const { error } = await supabase.from("equipment").update(update).eq("id", id);
  if (error) redirect(`/admin/catalog/${id}/edit?error=${encodeURIComponent(error.code ?? "database")}`);
  revalidatePath("/catalog"); revalidatePath(`/catalog/${parsed.data.slug}`); revalidatePath("/admin/catalog");
  redirect("/admin/catalog?updated=1");
}

export async function deleteEquipmentAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("equipment").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/catalog"); revalidatePath("/admin/catalog");
}

export async function updateLeadStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const status = String(formData.get("status") ?? "new");
  if (!["new", "in-progress", "won", "lost"].includes(status)) return;
  await supabase.from("leads").update({ status }).eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin/leads");
}

export async function createChatAnswerAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (question.length < 5 || answer.length < 10) return;
  await supabase.from("chat_answers").insert({ question, answer, active: true });
  revalidatePath("/admin/chatbot");
}

export async function updateChatAnswerAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (!id || question.length < 5 || answer.length < 10) return;
  await supabase.from("chat_answers").update({ question, answer, active: formData.get("active") === "on" }).eq("id", id);
  revalidatePath("/admin/chatbot");
}

export async function deleteChatAnswerAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("chat_answers").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin/chatbot");
}
