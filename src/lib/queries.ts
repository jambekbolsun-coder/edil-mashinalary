import "server-only";

import { cache } from "react";
import { blogPosts, equipment as seedEquipment } from "@/lib/content";
import type { BlogPost, Equipment } from "@/lib/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type EquipmentRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Equipment["category"];
  status: Equipment["status"];
  published: boolean;
  featured: boolean;
  price: number | null;
  old_price: number | null;
  down_payment: number | null;
  monthly_payment: number | null;
  installment_months: number;
  bucket: string | null;
  load_capacity: string | null;
  power: number | null;
  engine: string | null;
  cylinders: number | null;
  turbo: boolean | null;
  warranty_hours: number;
  promo: string | null;
  short_description: string;
  description: string;
  images: string[];
  specs: Equipment["specs"];
  equipment: string[];
  keywords: string[];
};

function mapEquipment(row: EquipmentRow): Equipment {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    status: row.status,
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
    images: row.images,
    specs: row.specs,
    equipment: row.equipment,
    keywords: row.keywords,
  };
}

export async function getPublishedEquipment(): Promise<Equipment[]> {
  if (!hasSupabaseEnv()) return seedEquipment.filter((item) => item.published);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error || !data?.length) return seedEquipment.filter((item) => item.published);
  const remote = (data as EquipmentRow[]).map(mapEquipment);
  const remoteSlugs = new Set(remote.map((item) => item.slug));
  return [...remote, ...seedEquipment.filter((item) => item.published && !remoteSlugs.has(item.slug))];
}

export const getEquipmentItem = cache(async (slug: string): Promise<Equipment | undefined> => {
  if (!hasSupabaseEnv()) return seedEquipment.find((item) => item.slug === slug && item.published);
  const supabase = await createClient();
  const { data } = await supabase.from("equipment").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return data ? mapEquipment(data as EquipmentRow) : seedEquipment.find((item) => item.slug === slug && item.published);
});

export async function getBlogPosts(): Promise<BlogPost[]> {
  return blogPosts;
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
