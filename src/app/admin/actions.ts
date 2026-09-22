"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
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
  revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/catalog/[slug]", "page"); revalidatePath("/admin/catalog");
  redirect("/admin/catalog?created=1");
}

export async function toggleEquipmentAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  const { error } = await supabase.from("equipment").update({ published: !published }).eq("id", id);
  if (error) redirect("/admin/catalog?error=publication");
  revalidatePath("/", "layout");
  revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/catalog/[slug]", "page"); revalidatePath("/admin/catalog");
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
  const update: Database["public"]["Tables"]["equipment"]["Update"] = {
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
  revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/catalog/[slug]", "page"); revalidatePath(`/catalog/${parsed.data.slug}`); revalidatePath("/admin/catalog");
  redirect("/admin/catalog?updated=1");
}

export async function deleteEquipmentAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("equipment").delete().eq("id", String(formData.get("id") ?? ""));
  if (error) redirect("/admin/catalog?error=delete");
  revalidatePath("/", "layout");
  revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/catalog/[slug]", "page"); revalidatePath("/admin/catalog");
}

export async function createPostAction(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const paragraphs = String(formData.get("content") ?? "").split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  if (title.length < 3 || excerpt.length < 10 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !paragraphs.length) redirect("/admin/content?error=post-validation");
  const { data, error } = await supabase.from("posts").insert({ title, slug, excerpt, content: paragraphs, category: String(formData.get("category") ?? "Практика").trim(), read_time: String(formData.get("read_time") ?? "5 минут").trim(), image: String(formData.get("image") ?? "/images/products/heavy-site.jpg").trim(), published: formData.get("published") === "on", published_at: formData.get("published") === "on" ? new Date().toISOString() : null }).select("id").single();
  if (error) redirect(`/admin/content?error=${encodeURIComponent(error.code ?? "post")}`);
  await supabase.from("audit_logs").insert({ actor_id: profile.id, action: "post_created", entity_type: "post", entity_id: data.id, changes: { title, published: formData.get("published") === "on" } });
  revalidatePath("/"); revalidatePath("/blog"); revalidatePath("/admin/content");
  redirect("/admin/content?created=post");
}

export async function deletePostAction(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await supabase.from("posts").delete().eq("id", id);
  await supabase.from("audit_logs").insert({ actor_id: profile.id, action: "post_deleted", entity_type: "post", entity_id: id });
  revalidatePath("/"); revalidatePath("/blog"); revalidatePath("/admin/content");
}

export async function updatePostAction(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const published = formData.get("published") === "on";
  if (!id || title.length < 3 || excerpt.length < 10) redirect("/admin/content?error=post-validation");
  const { error } = await supabase.from("posts").update({ title, excerpt, published, published_at: published ? new Date().toISOString() : null }).eq("id", id);
  if (error) redirect("/admin/content?error=post-update");
  await supabase.from("audit_logs").insert({ actor_id: profile.id, action: "post_updated", entity_type: "post", entity_id: id, changes: { title, published } });
  revalidatePath("/"); revalidatePath("/blog"); revalidatePath("/admin/content");
  redirect("/admin/content?updated=post");
}

export async function createServiceAction(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  if (title.length < 2 || excerpt.length < 10 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) redirect("/admin/content?error=service-validation");
  const { data, error } = await supabase.from("services").insert({ title, slug, excerpt, content: [], icon: String(formData.get("icon") ?? "wrench"), sort_order: optionalNumber(formData.get("sort_order")) ?? 0, published: formData.get("published") === "on" }).select("id").single();
  if (error) redirect(`/admin/content?error=${encodeURIComponent(error.code ?? "service")}`);
  await supabase.from("audit_logs").insert({ actor_id: profile.id, action: "service_created", entity_type: "service", entity_id: data.id, changes: { title } });
  revalidatePath("/service"); revalidatePath("/admin/content");
  redirect("/admin/content?created=service");
}

export async function deleteServiceAction(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await supabase.from("services").delete().eq("id", id);
  await supabase.from("audit_logs").insert({ actor_id: profile.id, action: "service_deleted", entity_type: "service", entity_id: id });
  revalidatePath("/service"); revalidatePath("/admin/content");
}

export async function updateServiceAction(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const sortOrder = optionalNumber(formData.get("sort_order")) ?? 0;
  const published = formData.get("published") === "on";
  if (!id || title.length < 2 || excerpt.length < 10) redirect("/admin/content?error=service-validation");
  const { error } = await supabase.from("services").update({ title, excerpt, sort_order: sortOrder, published }).eq("id", id);
  if (error) redirect("/admin/content?error=service-update");
  await supabase.from("audit_logs").insert({ actor_id: profile.id, action: "service_updated", entity_type: "service", entity_id: id, changes: { title, published, sort_order: sortOrder } });
  revalidatePath("/service"); revalidatePath("/admin/content");
  redirect("/admin/content?updated=service");
}

export async function updateSettingsAction(formData: FormData) {
  const { supabase, profile } = await requireAdmin();
  const settings = [
    ["company_name", String(formData.get("company_name") ?? "").trim()],
    ["company_phone", String(formData.get("company_phone") ?? "").trim()],
    ["company_email", String(formData.get("company_email") ?? "").trim()],
    ["company_address", String(formData.get("company_address") ?? "").trim()],
    ["company_whatsapp", String(formData.get("company_whatsapp") ?? "").trim()],
    ["company_instagram", String(formData.get("company_instagram") ?? "").trim()],
  ].filter(([, value]) => value.length > 0).map(([key, value]) => ({ key, value, public: true }));
  if (settings.length < 6) redirect("/admin/settings?error=validation");
  const { error } = await supabase.from("site_settings").upsert(settings);
  if (error) redirect("/admin/settings?error=database");
  await supabase.from("audit_logs").insert({ actor_id: profile.id, action: "settings_updated", entity_type: "site_settings", changes: { keys: settings.map((item) => item.key) } });
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
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
