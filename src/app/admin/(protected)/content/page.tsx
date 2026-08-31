import Link from "next/link";
import { ArrowUpRight, FileText, Megaphone } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminContentPage() {
  const { supabase } = await requireAdmin();
  const [{ count: posts }, { count: promotions }] = await Promise.all([supabase.from("posts").select("id", { count: "exact", head: true }), supabase.from("promotions").select("id", { count: "exact", head: true })]);
  return <><header className="admin-page-head"><div><span className="eyebrow">КОНТЕНТ</span><h1>Материалы и акции</h1><p>Контентные разделы подготовлены к наполнению после запуска.</p></div></header><section className="admin-content-cards"><article><span><FileText aria-hidden="true" /></span><p>Статьи</p><strong>{posts ?? 0}</strong><small>Полезные материалы для клиентов</small><Link href="/blog" target="_blank">Посмотреть блог <ArrowUpRight aria-hidden="true" /></Link></article><article><span><Megaphone aria-hidden="true" /></span><p>Акции</p><strong>{promotions ?? 0}</strong><small>Промо-предложения и сроки</small><span className="admin-soon">Редактор — следующий этап</span></article></section></>;
}
