import { describe, expect, it } from "vitest";
import { avatarExtension, profileSchema } from "../src/lib/profile-validation";
import { equipmentCategories } from "../src/lib/categories";
import { equipmentSchema } from "../src/lib/validation";

describe("marketing profile validation", () => {
  it("normalizes skills without accepting unbounded profile data", () => {
    const result = profileSchema.parse({ full_name: "  Эдил  ", about: "О себе", skills: "Сервис, Подбор, Сервис" });
    expect(result.skills).toEqual(["Сервис", "Подбор"]);
    expect(result.full_name).toBe("Эдил");
    expect(profileSchema.safeParse({ full_name: "Эдил", about: "a".repeat(2001), skills: "" }).success).toBe(false);
    expect(profileSchema.safeParse({ full_name: "Эдил", about: "", skills: Array.from({ length: 16 }, (_, i) => `Навык ${i}`).join(",") }).success).toBe(false);
  });
  it("rejects executable and mislabeled avatar contents", () => {
    expect(avatarExtension(new TextEncoder().encode('<svg onload="alert(1)">'))).toBeNull();
    expect(avatarExtension(new Uint8Array([255,216,255,0]))).toBe("jpg");
    expect(avatarExtension(new Uint8Array([137,80,78,71,13,10,26,10]))).toBe("png");
    expect(avatarExtension(new TextEncoder().encode("RIFF1234WEBP"))).toBe("webp");
    expect(avatarExtension(new Uint8Array([]))).toBeNull();
  });
});

describe("equipment categories", () => {
  it("accepts all 15 types and rejects unknown categories", () => {
    const data = { name: "Модель", slug: "model", brand: "LGZT", status: "on-order", description: "Описание техники для каталога", price: null, published: false, featured: false };
    expect(equipmentCategories).toHaveLength(15);
    for (const category of equipmentCategories) expect(equipmentSchema.safeParse({ ...data, category }).success).toBe(true);
    expect(equipmentSchema.safeParse({ ...data, category: "unknown" }).success).toBe(false);
  });
});
