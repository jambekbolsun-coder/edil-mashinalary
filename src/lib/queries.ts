import "server-only";

import { cache } from "react";
import { blogPosts, company, equipment as seedEquipment } from "@/lib/content";
import type { BlogPost, Equipment } from "@/lib/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/database.types";

type EquipmentRow = Database["public"]["Tables"]["equipment"]["Row"];

function stringArray(value: Json): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function specArray(value: Json): Equipment["specs"] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const label = item.label;
    const specValue = item.value;
    return typeof label === "string" && typeof specValue === "string"
      ? [{ label, value: specValue }]
      : [];
  });
}

function mapEquipment(row: EquipmentRow): Equipment {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category as Equipment["category"],
    status: row.status as Equipment["status"],
    published: row.published,
    featured: row.featured,
    price: row.price,
    oldPrice: row.old_price,
    downPayment: row.down_payment,
    monthlyPayment: row.monthly_payment,
    installmentMonths: row.installment_months,
    bucket: row.bucket,
    loadCapacity: row.load_capacity,
    power: row.power,
    engine: row.engine,
    cylinders: row.cylinders,
    turbo: row.turbo,
    warrantyHours: row.warranty_hours,
    promo: row.promo,
    shortDescription: row.short_description,
    description: row.description,
    images: stringArray(row.images),
    specs: specArray(row.specs),
    equipment: stringArray(row.equipment),
    keywords: stringArray(row.keywords),
  };
}

export const getPublishedEquipment = cache(async (): Promise<Equipment[]> => {
  if (!hasSupabaseEnv()) return seedEquipment.filter((item) => item.published);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return seedEquipment.filter((item) => item.published);
  return (data ?? []).map(mapEquipment);
});

export const getEquipmentItem = cache(async (slug: string): Promise<Equipment | undefined> => {
  if (!hasSupabaseEnv()) return seedEquipment.find((item) => item.slug === slug && item.published);
  const supabase = await createClient();
  const { data, error } = await supabase.from("equipment").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) return seedEquipment.find((item) => item.slug === slug && item.published);
  return data ? mapEquipment(data) : undefined;
});

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!hasSupabaseEnv()) return blogPosts;
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").eq("published", true).order("published_at", { ascending: false });
  if (error || !data?.length) return blogPosts;
  const remote: BlogPost[] = data.map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, readTime: post.read_time, image: post.image, publishedAt: post.published_at || post.created_at, content: stringArray(post.content) }));
  const slugs = new Set(remote.map((post) => post.slug));
  return [...remote, ...blogPosts.filter((post) => !slugs.has(post.slug))];
}

export const getBlogPost = cache(async (slug: string) => (await getBlogPosts()).find((post) => post.slug === slug));

export type ServiceItem = { id: string; slug: string; title: string; excerpt: string; icon: string };

const seedServices: ServiceItem[] = [
  { id: "service-warranty", slug: "warranty", title: "Условия гарантии", excerpt: "Точные сроки и объём покрытия фиксируются для конкретной модели в договоре.", icon: "shield" },
  { id: "service-consultation", slug: "consultation", title: "Техническая консультация", excerpt: "Поможем разобраться с эксплуатацией и базовым обслуживанием.", icon: "wrench" },
  { id: "service-parts", slug: "parts", title: "Расходники и запчасти", excerpt: "Подберём позицию по модели и данным конкретной машины.", icon: "package" },
  { id: "service-operation", slug: "operation", title: "Помощь с эксплуатацией", excerpt: "Ответим на вопросы оператора и владельца после покупки.", icon: "headphones" },
];

export async function getServices(): Promise<ServiceItem[]> {
  if (!hasSupabaseEnv()) return seedServices;
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select("id,slug,title,excerpt,icon").eq("published", true).order("sort_order");
  return error || !data?.length ? seedServices : data;
}

export type CompanyInfo = typeof company;

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const match = digits.match(/^(996)(\d{3})(\d{3})(\d{3})$/);
  return match ? `+${match[1]} ${match[2]} ${match[3]} ${match[4]}` : value;
}

export async function getCompanyInfo(): Promise<CompanyInfo> {
  if (!hasSupabaseEnv()) return company;
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("key,value").in("key", ["company_name", "company_phone", "company_email", "company_address", "company_whatsapp", "company_instagram"]);
  if (error || !data) return company;
  const settings = new Map(data.map((item) => [item.key, typeof item.value === "string" ? item.value : ""]));
  const phoneDisplay = formatPhone(settings.get("company_phone") || company.phoneDisplay);
  return {
    ...company,
    name: settings.get("company_name") || company.name,
    phoneDisplay,
    phone: phoneDisplay.replace(/[^+\d]/g, ""),
    email: settings.get("company_email") || company.email,
    address: settings.get("company_address") || company.address,
    whatsapp: settings.get("company_whatsapp") || company.whatsapp,
    instagram: settings.get("company_instagram") || company.instagram,
  } as CompanyInfo;
}

const seedChatAnswers: [string, string][] = [
  ["Что есть в наличии?", "Откройте каталог и включите фильтр «В наличии». Перед поездкой менеджер подтвердит актуальную модель."],
  ["Можно купить в рассрочку?", "Да. Банк не нужен: паспорт, первый взнос примерно от 50%, остаток до 12 месяцев."],
  ["Какая гарантия?", "Для большинства моделей указана гарантия 3000 моточасов. Точное условие фиксируется в договоре."],
  ["Сколько занимает оформление?", "Если техника в наличии и документы готовы, выдача может занять около одного часа."],
  ["Где вы находитесь?", "Чуйская область, Новопокровка, ул. Ленина, 633."],
];

export async function getChatAnswers(): Promise<[string, string][]> {
  if (!hasSupabaseEnv()) return seedChatAnswers;
  const supabase = await createClient();
  const { data, error } = await supabase.from("chat_answers").select("question, answer").eq("active", true).order("sort_order");
  if (error || !data?.length) return seedChatAnswers;
  return data.map((item) => [item.question, item.answer]);
}
