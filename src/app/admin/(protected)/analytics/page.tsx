/* eslint-disable react-hooks/purity -- request-time dates are intentional in this dynamic server report */
import { Eye, MousePointerClick, TrendingUp, UsersRound } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const [{ data: events }, { count: leads }] = await Promise.all([
    supabase.from("analytics_events").select("event_name,equipment_slug,anonymous_id,utm_source,created_at").gte("created_at", since).order("created_at", { ascending: true }).limit(10000),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since),
  ]);
  const rows = events ?? [];
  const pageViews = rows.filter((event) => event.event_name === "page_view" || event.event_name === "equipment_view").length;
  const visitors = new Set(rows.flatMap((event) => event.anonymous_id ? [event.anonymous_id] : [])).size;
  const productCounts = new Map<string, number>();
  const sourceCounts = new Map<string, number>();
  rows.forEach((event) => {
    if (event.event_name === "equipment_view" && event.equipment_slug) productCounts.set(event.equipment_slug, (productCounts.get(event.equipment_slug) ?? 0) + 1);
    if (event.utm_source) sourceCounts.set(event.utm_source, (sourceCounts.get(event.utm_source) ?? 0) + 1);
  });
  const popular = [...productCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const sources = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index)); return date; });
  const daily = days.map((date) => ({ date, count: rows.filter((event) => new Date(event.created_at).toDateString() === date.toDateString() && (event.event_name === "page_view" || event.event_name === "equipment_view")).length }));
  const max = Math.max(...daily.map((item) => item.count), 1);
  const conversion = pageViews ? ((leads ?? 0) / pageViews * 100).toFixed(1) : null;
  return <><header className="admin-page-head"><div><span className="eyebrow">АНАЛИТИКА · 30 ДНЕЙ</span><h1>Реальный интерес</h1><p>Только first-party события посетителей, которые разрешили аналитику. Личные данные не записываются.</p></div></header><section className="admin-metrics"><article><span><Eye aria-hidden="true" /></span><p>Просмотры</p><strong>{pageViews}</strong><small>Страницы и карточки</small></article><article><span><UsersRound aria-hidden="true" /></span><p>Посетители</p><strong>{visitors}</strong><small>Обезличенные браузеры</small></article><article><span><MousePointerClick aria-hidden="true" /></span><p>Заявки</p><strong>{leads ?? 0}</strong><small>Получено за период</small></article><article><span><TrendingUp aria-hidden="true" /></span><p>Конверсия</p><strong>{conversion ? `${conversion}%` : "—"}</strong><small>Заявки / просмотры</small></article></section><section className="admin-analytics-grid"><article className="admin-panel"><span className="eyebrow">ПОСЛЕДНИЕ 7 ДНЕЙ</span><h2>Просмотры по дням</h2>{pageViews ? <div className="real-chart" role="img" aria-label="График просмотров за семь дней">{daily.map((item) => <div key={item.date.toISOString()}><span>{item.count}</span><i style={{ height: `${Math.max(5, item.count / max * 100)}%` }} /><small>{new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(item.date)}</small></div>)}</div> : <div className="admin-empty compact"><h3>Данных пока нет</h3><p>График появится после согласованных просмотров.</p></div>}</article><article className="admin-panel"><span className="eyebrow">КАРТОЧКИ ТЕХНИКИ</span><h2>Что смотрят</h2><ol className="analytics-ranking">{popular.map(([slug, count]) => <li key={slug}><span>{slug}</span><strong>{count}</strong></li>)}</ol>{!popular.length && <p className="admin-muted">Просмотров карточек пока нет.</p>}<span className="eyebrow analytics-source-title">ИСТОЧНИКИ UTM</span><ol className="analytics-ranking compact">{sources.map(([source, count]) => <li key={source}><span>{source}</span><strong>{count}</strong></li>)}</ol>{!sources.length && <p className="admin-muted">UTM-источники ещё не зафиксированы.</p>}</article></section></>;
}
