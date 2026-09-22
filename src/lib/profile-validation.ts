import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Укажите имя: минимум 2 символа").max(100, "Имя: максимум 100 символов"),
  about: z.string().trim().max(2000, "О себе: максимум 2000 символов"),
  skills: z.string().trim().max(500, "Навыки: максимум 500 символов").transform((value) => [...new Set(value.split(",").map((skill) => skill.trim()).filter(Boolean))]).refine((skills) => skills.length <= 15 && skills.every((skill) => skill.length <= 60), "Укажите до 15 навыков, каждый до 60 символов"),
});
export function avatarExtension(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if ([137,80,78,71,13,10,26,10].every((byte, index) => bytes[index] === byte)) return "png";
  if (String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WEBP") return "webp";
  return null;
}

