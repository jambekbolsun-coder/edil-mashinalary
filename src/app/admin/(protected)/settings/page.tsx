import { Save } from "lucide-react";
import { updateSettingsAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { company } from "@/lib/content";

type Props = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function AdminSettingsPage({ searchParams }: Props) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("key,value").in("key", ["company_name", "company_phone", "company_email", "company_address", "company_whatsapp", "company_instagram"]);
  const settings = new Map(data?.map((item) => [item.key, typeof item.value === "string" ? item.value : ""]));
  return <><header className="admin-page-head"><div><span className="eyebrow">СИСТЕМА</span><h1>Данные компании</h1><p>Эти контакты используются в подвале и быстрых кнопках связи.</p></div></header>{saved && <div className="admin-success" role="status">Изменения сохранены.</div>}{error && <div className="admin-alert" role="alert">Заполните все поля корректными данными.</div>}<form className="admin-form admin-settings-form" action={updateSettingsAction}><section><div className="admin-form-head"><span>01</span><div><h2>Публичные контакты</h2><p>Не добавляйте личные данные, которые не должны быть опубликованы.</p></div></div><div className="admin-fields two"><label>Название компании<input name="company_name" required defaultValue={settings.get("company_name") || company.name} /></label><label>Телефон<input name="company_phone" required defaultValue={settings.get("company_phone") || company.phoneDisplay} /></label><label>Email<input name="company_email" type="email" required defaultValue={settings.get("company_email") || company.email} /></label><label>Адрес<input name="company_address" required defaultValue={settings.get("company_address") || company.address} /></label><label>Ссылка WhatsApp<input name="company_whatsapp" type="url" required defaultValue={settings.get("company_whatsapp") || company.whatsapp} /></label><label>Ссылка Instagram<input name="company_instagram" type="url" required defaultValue={settings.get("company_instagram") || company.instagram} /></label></div></section><div className="admin-form-actions"><button className="button" type="submit"><Save aria-hidden="true" />Сохранить данные</button></div></form></>;
}
