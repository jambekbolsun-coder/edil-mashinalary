import { describe, expect, it } from "vitest";
import { equipment, formatPrice, getEquipmentBySlug } from "../src/lib/content";

describe("catalog content", () => {
  it("contains ten unique published models", () => {
    expect(equipment).toHaveLength(10);
    expect(new Set(equipment.map((item) => item.slug)).size).toBe(10);
    expect(equipment.every((item) => item.published)).toBe(true);
  });

  it("does not invent a missing price", () => {
    expect(formatPrice(null)).toBe("Уточнить цену");
    expect(getEquipmentBySlug("lg393")?.price).toBeNull();
  });

  it("keeps installment math consistent", () => {
    const financed = equipment.filter((item) => item.price && item.downPayment && item.monthlyPayment);
    for (const item of financed) {
      const remainder = item.price! - item.downPayment!;
      expect(Math.abs(remainder / item.installmentMonths - item.monthlyPayment!)).toBeLessThan(1);
    }
  });
});
