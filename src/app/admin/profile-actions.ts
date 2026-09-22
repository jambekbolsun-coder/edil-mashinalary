"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { avatarExtension, profileSchema } from "@/lib/profile-validation";

export type ProfileState = { error?: string; success?: boolean };
export async function updateProfileAction(_previous: ProfileState, formData: FormData): Promise<ProfileState> {
  const { supabase, profile } = await requireAdmin();
  const parsed = profileSchema.safeParse(Object.fromEntries(["full_name", "about", "skills"].map((key) => [key, String(formData.get(key) ?? "")])));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { data: current, error: readError } = await supabase.from("profiles").select("avatar_path").eq("id", profile.id).single();
  if (readError) return { error: "Профиль пока недоступен. Попробуйте позже." };
  let avatarPath = current.avatar_path;
  let uploadedPath: string | null = null;
  const file = formData.get("avatar");
  if (file instanceof File && file.size > 0) {
    if (file.size > 2 * 1024 * 1024) return { error: "Выберите фотографию до 2 МБ." };
    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = avatarExtension(bytes);
    if (!ext) return { error: "Поддерживаются фотографии JPG, PNG и WebP." };
    uploadedPath = `${profile.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(uploadedPath, bytes, { contentType: ext === "jpg" ? "image/jpeg" : `image/${ext}`, upsert: false });
    if (error) return { error: "Не удалось загрузить фото. Ваши изменения не сохранены. Повторите попытку." };
    avatarPath = uploadedPath;
  } else if (formData.get("remove_avatar") === "on") avatarPath = null;
  const { error } = await supabase.from("profiles").update({ ...parsed.data, avatar_path: avatarPath }).eq("id", profile.id);
  if (error) {
    if (uploadedPath) await supabase.storage.from("avatars").remove([uploadedPath]);
    return { error: "Не удалось сохранить профиль. Повторите попытку." };
  }
  if (current.avatar_path && current.avatar_path !== avatarPath && current.avatar_path.startsWith(`${profile.id}/`)) await supabase.storage.from("avatars").remove([current.avatar_path]);
  revalidatePath("/admin", "layout");
  return { success: true };
}

