import { requireAdmin } from "@/lib/auth";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function AdminProfilePage() {
  const { supabase, profile } = await requireAdmin();
  const { data, error } = await supabase.from("profiles").select("full_name,about,skills,avatar_path").eq("id", profile.id).single();
  const signed = data?.avatar_path ? await supabase.storage.from("avatars").createSignedUrl(data.avatar_path, 3600) : null;
  return <><header className="admin-page-head"><div><span className="eyebrow">АККАУНТ</span><h1>Профиль</h1><p>Фотография, навыки и несколько слов о себе.</p></div></header>{error || !data ? <div className="admin-alert" role="alert">Не удалось загрузить профиль. Попробуйте позже.</div> : <ProfileForm profile={data} avatarUrl={signed?.data?.signedUrl ?? null} />}</>;
}
