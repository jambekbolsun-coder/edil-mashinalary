import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
import { updateProfileAction } from "../src/app/admin/profile-actions";

function setup(updateError: unknown = null) {
  const updateEq = vi.fn().mockResolvedValue({ error: updateError });
  const update = vi.fn().mockReturnValue({ eq: updateEq });
  const upload = vi.fn().mockResolvedValue({ error: null });
  const remove = vi.fn().mockResolvedValue({ error: null });
  const supabase = {
    from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { avatar_path: "admin-1/old.jpg" }, error: null }) }) }), update }),
    storage: { from: vi.fn().mockReturnValue({ upload, remove }) },
  };
  mocks.requireAdmin.mockResolvedValue({ supabase, profile: { id: "admin-1" } });
  const form = new FormData();
  form.set("full_name", "Эдил"); form.set("about", "Сервис техники"); form.set("skills", "Подбор, Сервис");
  // An injected id or role must never change the update target or privilege.
  form.set("id", "other-user"); form.set("role", "owner");
  return { form, update, updateEq, upload, remove };
}

beforeEach(() => vi.clearAllMocks());
describe("profile persistence", () => {
  it("updates only the authenticated administrator's editable fields", async () => {
    const { form, update, updateEq } = setup();
    expect(await updateProfileAction({}, form)).toEqual({ success: true });
    expect(update).toHaveBeenCalledWith({ full_name: "Эдил", about: "Сервис техники", skills: ["Подбор", "Сервис"], avatar_path: "admin-1/old.jpg" });
    expect(updateEq).toHaveBeenCalledWith("id", "admin-1");
  });
  it("cleans up the new upload and keeps the old avatar if saving fails", async () => {
    const { form, upload, remove } = setup({ code: "db-failure" });
    form.set("avatar", new File([new Uint8Array([255,216,255,0])], "photo.jpg", { type: "image/jpeg" }));
    expect((await updateProfileAction({}, form)).error).toBeTruthy();
    const path = upload.mock.calls[0][0];
    expect(path).toMatch(/^admin-1\/.+\.jpg$/);
    expect(remove).toHaveBeenCalledExactlyOnceWith([path]);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
  it("removes the previous image only after the profile update succeeds", async () => {
    const { form, remove, update } = setup();
    form.set("remove_avatar", "on");
    expect(await updateProfileAction({}, form)).toEqual({ success: true });
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ avatar_path: null }));
    expect(remove).toHaveBeenCalledExactlyOnceWith(["admin-1/old.jpg"]);
  });
  it("does not mutate the database when admin authentication fails", async () => {
    const { form, update, upload } = setup();
    mocks.requireAdmin.mockRejectedValueOnce(new Error("unauthorized"));
    await expect(updateProfileAction({}, form)).rejects.toThrow("unauthorized");
    expect(update).not.toHaveBeenCalled(); expect(upload).not.toHaveBeenCalled();
  });
});
