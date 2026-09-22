import { z } from "zod";
import { equipmentCategories } from "./categories";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(90, "Имя слишком длинное"),
  phone: z
    .string()
    .trim()
    .min(9, "Проверьте номер телефона")
    .max(20, "Проверьте номер телефона")
    .regex(/^[+0-9()\-\s]+$/, "Используйте только цифры и знак +"),
  preference: z.string().trim().max(40).default("phone"),
  interest: z.string().trim().max(100).default(""),
  comment: z.string().trim().max(1200, "Комментарий слишком длинный").default(""),
  consent: z.literal(true, { error: "Нужно согласие на обработку данных" }),
  source: z.string().trim().max(120).default("site"),
  locale: z.enum(["ru", "ky", "en", "tr", "zh"]).default("ru"),
  landingPage: z.string().trim().max(500).default(""),
  utmSource: z.string().trim().max(120).default(""),
  utmMedium: z.string().trim().max(120).default(""),
  utmCampaign: z.string().trim().max(120).default(""),
  utmContent: z.string().trim().max(120).default(""),
  utmTerm: z.string().trim().max(120).default(""),
});

export const equipmentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/),
  brand: z.string().trim().min(1).max(80),
  category: z.enum(equipmentCategories),
  status: z.enum(["in-stock", "on-order"]),
  description: z.string().trim().min(20).max(5000),
  price: z.number().int().nonnegative().nullable(),
  published: z.boolean(),
  featured: z.boolean(),
});
