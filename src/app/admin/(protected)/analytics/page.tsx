import { MousePointerClick, TrendingUp, UsersRound } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();
  const [{ count: events }, { count: leads }] = await Promise.all([supabase.from("analytics_events").select("id", { count: "exact", head: true }), supabase.from("leads").select("id", { count: "exact", head: true })]);
  return <><header className="admin-page-head"><div><span className="eyebrow">АНАЛИТИКА</span><h1>Интерес клиентов</h1><p>События начнут накапливаться после публикации сайта.</p></div></header><section className="admin-metrics"><article><span><MousePointerClick aria-hidden="true" /></span><p>События</p><strong>{events ?? 0}</strong><small>Клики и просмотры</small></article><article><span><UsersRound aria-hidden="true" /></span><p>Обращения</p><strong>{leads ?? 0}</strong><small>Отправленные формы</small></article><article><span><TrendingUp aria-hidden="true" /></span><p>Конверсия</p><strong>{events ? `${Math.round(((leads ?? 0) / events) * 100)}%` : "—"}</strong><small>Заявки к событиям</small></article></section><section className="admin-panel admin-chart-placeholder"><div><span className="eyebrow">ДИНАМИКА</span><h2>Статистика появится здесь</h2><p>После запуска график покажет интерес к моделям, источники заявок и самые востребованные страницы.</p></div><div className="fake-chart">{[38, 58, 44, 72, 62, 88, 76, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></section></>;
}
