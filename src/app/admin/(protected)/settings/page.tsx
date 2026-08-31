import { company } from "@/lib/content";

export default function AdminSettingsPage() {
  return <><header className="admin-page-head"><div><span className="eyebrow">СИСТЕМА</span><h1>Настройки</h1><p>Основные данные компании, используемые на сайте.</p></div></header><section className="admin-panel admin-settings"><div><span className="eyebrow">КОНТАКТЫ</span><h2>Текущие данные</h2><p>Изменение настроек будет подключено после согласования рабочих контактов компании.</p></div><dl><div><dt>Телефон</dt><dd>{company.phoneDisplay}</dd></div><div><dt>Email</dt><dd>{company.email}</dd></div><div><dt>Адрес</dt><dd>{company.address}</dd></div><div><dt>Гарантия</dt><dd>3000 моточасов</dd></div></dl></section></>;
}
