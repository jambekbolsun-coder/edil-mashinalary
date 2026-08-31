import { describe, expect, it } from "vitest";
import { equipmentSchema, leadSchema } from "../src/lib/validation";

describe("lead validation", () => {
  const valid = { name: "Азамат", phone: "+996 700 123 456", preference: "phone", interest: "lg920", comment: "Для склада", consent: true as const, source: "test" };
  it("accepts a valid Kyrgyzstan phone payload", () => expect(leadSchema.safeParse(valid).success).toBe(true));
  it("requires consent", () => expect(leadSchema.safeParse({ ...valid, consent: false }).success).toBe(false));
  it("rejects script-like phone input", () => expect(leadSchema.safeParse({ ...valid, phone: "<script>alert(1)</script>" }).success).toBe(false));
});

describe("equipment validation", () => {
  it("requires a safe URL slug", () => {
    const result = equipmentSchema.safeParse({ name: "LG 999", slug: "LG 999!", brand: "LGZT", category: "loaders", status: "in-stock", description: "Надёжная техника для ежедневной работы на объекте.", price: null, published: true, featured: false });
    expect(result.success).toBe(false);
  });
});
