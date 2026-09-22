import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ result: { data: [] as unknown[], error: null as unknown } }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/env", () => ({ hasSupabaseEnv: () => true }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => {
  const query = { select: () => query, eq: () => query, order: () => query, maybeSingle: async () => ({ data: mocks.result.data[0] ?? null, error: mocks.result.error }), then: (resolve: (value: typeof mocks.result) => unknown) => Promise.resolve(mocks.result).then(resolve) };
  return { from: () => query };
} }));
import { getEquipmentItem, getPublishedEquipment } from "../src/lib/queries";

beforeEach(() => { mocks.result = { data: [], error: null }; });
describe("published catalog consistency", () => {
  it("keeps an intentionally empty catalog empty instead of resurrecting sample products", async () => {
    expect(await getPublishedEquipment()).toEqual([]);
    expect(await getEquipmentItem("lg939")).toBeUndefined();
  });
  it("retains the existing fallback only when the database is unavailable", async () => {
    mocks.result.error = { code: "42501" };
    expect((await getPublishedEquipment()).length).toBeGreaterThan(0);
    expect((await getEquipmentItem("lg939"))?.slug).toBe("lg939");
  });
});
