"use client";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { Camera, Save, UserRound } from "lucide-react";
import { updateProfileAction, type ProfileState } from "@/app/admin/profile-actions";

export function ProfileForm({ profile, avatarUrl }: { profile: { full_name: string | null; about: string; skills: string[] }; avatarUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [state, action, pending] = useActionState(async (previous: ProfileState, formData: FormData) => {
    const result = await updateProfileAction(previous, formData);
    if (result.success) setPreview(null);
    return result;
  }, {});
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [skills, setSkills] = useState(profile.skills.join(", "));
  const [about, setAbout] = useState(profile.about);
  const [fileError, setFileError] = useState("");
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  return <form action={action} className="admin-profile-form">
    <section className="admin-panel profile-photo-panel"><div className="profile-photo">{preview || avatarUrl ? /* Signed private storage URL is intentionally rendered without the public image optimizer. */ <Image unoptimized src={preview || avatarUrl || ""} alt="Фото профиля" width={160} height={160} /> : <UserRound aria-hidden="true" />}</div><h2>Ваша фотография</h2><p>JPG, PNG или WebP до 2 МБ.</p><label className="button button-outline profile-upload"><Camera aria-hidden="true" />Выбрать фото<input type="file" name="avatar" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; setFileError(""); if (file && (file.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) { setFileError("Выберите JPG, PNG или WebP до 2 МБ."); event.target.value = ""; setPreview(null); return; } setPreview(file ? URL.createObjectURL(file) : null); }} /></label>{avatarUrl && <label className="admin-inline-check"><input name="remove_avatar" type="checkbox" disabled={!!preview} />Удалить текущее фото</label>}{fileError && <p className="form-error" role="alert">{fileError}</p>}</section>
    <section className="admin-panel admin-small-form"><div><span className="eyebrow">ЛИЧНАЯ ИНФОРМАЦИЯ</span><h2>О вас</h2></div><label>ФИО<input name="full_name" autoComplete="name" required minLength={2} maxLength={100} value={fullName} onChange={(event) => setFullName(event.target.value)} /></label><label>Навыки<input name="skills" maxLength={500} value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Подбор техники, консультация, сервис" /><small>До 15 навыков через запятую.</small></label><label>О себе<textarea name="about" rows={7} maxLength={2000} value={about} onChange={(event) => setAbout(event.target.value)} placeholder="Расскажите о своём опыте и о том, чем помогаете клиентам." /></label>
    {state.error && <div className="admin-alert" role="alert">{state.error}</div>}{state.success && <div className="admin-success" role="status">Профиль сохранён</div>}<button className="button" disabled={pending || !!fileError}><Save aria-hidden="true" />{pending ? "Сохраняем…" : "Сохранить профиль"}</button></section>
  </form>;
}

