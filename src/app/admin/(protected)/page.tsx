import Link from "next/link";
import { ArrowUpRight, CircleDollarSign, Eye, MessageSquareText, Package } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const { supabase, profile } = await requireAdmin();
  const [{ count: products }, { count: leads }, { count: newLeads }] = await Promise.all([
    supabase.from("equipment").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  return <><header className="admin-page-head"><div><span className="eyebrow">ПАНЕЛЬ УПРАВЛЕНИЯ</span><h1>Добрый день, {profile.full_name || "администратор"}</h1><p>Главное по каталогу и обращениям клиентов.</p></div><Link href="/admin/catalog/new" className="button">+ Добавить технику</Link></header><section className="admin-metrics"><article><span><Package aria-hidden="true" /></span><p>Моделей в базе</p><strong>{products ?? 0}</strong><small>Каталог готов к расширению</small></article><article><span><MessageSquareText aria-hidden="true" /></span><p>Всего заявок</p><strong>{leads ?? 0}</strong><small>{newLeads ?? 0} ждут ответа</small></article><article><span><Eye aria-hidden="true" /></span><p>Просмотры</p><strong>—</strong><small>Появятся после запуска</small></article><article><span><CircleDollarSign aria-hidden="true" /></span><p>Продажи</p><strong>—</strong><small>Отмечайте статус заявки</small></article></section><section className="admin-dashboard-grid"><article className="admin-panel"><div className="admin-panel-head"><div><span className="eyebrow">БЫСТРЫЙ СТАРТ</span><h2>Что можно сделать</h2></div></div><div className="admin-quick-links"><Link href="/admin/catalog/new"><Package aria-hidden="true" /><span><strong>Добавить модель</strong><small>Фото, параметры и рассрочка</small></span><ArrowUpRight aria-hidden="true" /></Link><Link href="/admin/leads"><MessageSquareText aria-hidden="true" /><span><strong>Разобрать заявки</strong><small>Новые обращения с сайта</small></span><ArrowUpRight aria-hidden="true" /></Link></div></article><article className="admin-panel admin-status-panel"><span className="eyebrow">СОСТОЯНИЕ СИСТЕМЫ</span><h2>Всё под контролем</h2><ul><li><i />Каталог подключён</li><li><i />Формы защищены проверкой</li><li><i />Фотографии хранятся отдельно</li><li><i />Права администратора включены</li></ul></article></section></>;
}
