import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminProfilePage() {
  const { profile } = await requireAdmin();
  return <><header className="admin-page-head"><div><span className="eyebrow">АККАУНТ</span><h1>Профиль</h1><p>Данные текущего администратора и уровень доступа.</p></div></header><section className="admin-panel admin-settings"><div><span className="eyebrow">АДМИНИСТРАТОР</span><h2>{profile.full_name || "Владелец сайта"}</h2><p>Пароль хранится только в защищённой системе авторизации и никогда не попадает в исходный код.</p></div><dl><div><dt>Роль</dt><dd><ShieldCheck aria-hidden="true" /> Полный доступ</dd></div><div><dt>Идентификатор</dt><dd>{profile.id}</dd></div><div><dt>Безопасность</dt><dd>Проверка сессии на сервере</dd></div></dl></section></>;
}
