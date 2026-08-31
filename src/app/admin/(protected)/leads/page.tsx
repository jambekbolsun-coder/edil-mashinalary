import { updateLeadStatusAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

const statusLabels: Record<string, string> = { new: "Новая", "in-progress": "В работе", won: "Сделка", lost: "Закрыта" };

export default async function AdminLeadsPage() {
  const { supabase } = await requireAdmin();
  const { data: leads } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200);
  return <><header className="admin-page-head"><div><span className="eyebrow">CRM</span><h1>Заявки клиентов</h1><p>Все обращения с форм сайта — от новых до завершённых.</p></div></header><section className="admin-panel"><div className="admin-table-wrap"><table className="admin-table leads"><thead><tr><th>Клиент</th><th>Интерес</th><th>Источник</th><th>Дата</th><th>Статус</th></tr></thead><tbody>{leads?.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong><a href={`tel:${lead.phone}`}>{lead.phone}</a>{lead.comment && <small>{lead.comment}</small>}</td><td>{lead.interest || "Не указано"}</td><td>{lead.source}</td><td>{new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.created_at))}</td><td><form action={updateLeadStatusAction}><input type="hidden" name="id" value={lead.id} /><select name="status" defaultValue={lead.status}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><button className="admin-table-action">Сохранить</button></form></td></tr>)}{!leads?.length && <tr><td colSpan={5}><div className="admin-empty"><span className="admin-empty-icon">0</span><h2>Заявок пока нет</h2><p>Новые обращения автоматически появятся здесь.</p></div></td></tr>}</tbody></table></div></section></>;
}
