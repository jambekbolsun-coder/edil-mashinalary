import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Phone, Tractor } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { equipment } from "@/lib/content";

const pageSize = 24;
const preferences: Record<string, string> = { phone: "Позвонить", whatsapp: "WhatsApp", instagram: "Instagram" };

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: requestedPage } = await searchParams;
  const parsedPage = Number(requestedPage);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, 1000000) : 1;
  const offset = (page - 1) * pageSize;
  const { supabase } = await requireAdmin();
  const [{ data: leads, count, error }, { data: models }] = await Promise.all([
    supabase.from("leads").select("id,name,phone,interest,comment,preference,source,created_at", { count: "exact" }).order("created_at", { ascending: false }).order("id", { ascending: false }).range(offset, offset + pageSize - 1),
    supabase.from("equipment").select("slug,name,brand"),
  ]);
  const names = new Map([...equipment, ...(models ?? [])].map((item) => [item.slug, `${item.brand} ${item.name}`]));
  const pages = Math.max(1, Math.ceil((count ?? 0) / pageSize));
  return <>
    <header className="admin-page-head"><div><span className="eyebrow">ОБРАЩЕНИЯ С САЙТА</span><h1>Заявки</h1><p>Контакты клиента, выбранная техника и задача — всё в одной карточке.</p></div><Link href="/admin/leads" className="button button-outline">Обновить</Link></header>
    {error ? <div className="admin-alert" role="alert">Не удалось загрузить заявки. Обновите страницу.</div> : <>
      <p className="admin-list-count">Всего заявок: {count ?? 0}</p>
      <section className="admin-leads-grid" aria-label="Заявки клиентов">{leads?.map((lead, index) => <article key={lead.id} className="admin-lead-card">
        <header><span className="admin-lead-number">Заявка №{(count ?? 0) - offset - index}</span><span className="admin-card-category">{preferences[lead.preference] || lead.preference || "Позвонить"}</span></header>
        <h2>{lead.name}</h2><a className="admin-lead-phone" href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`}><Phone aria-hidden="true" />{lead.phone}</a>
        <div className="admin-lead-interest"><Tractor aria-hidden="true" /><div><span>Интересующая техника</span><strong>{names.get(lead.interest ?? "") || lead.interest || "Нужна помощь с выбором"}</strong></div></div>
        <div className="admin-lead-description"><span>Описание задачи</span><p>{lead.comment || "Клиент не оставил описание."}</p></div>
        <footer><CalendarDays aria-hidden="true" /><time dateTime={lead.created_at}>{new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bishkek" }).format(new Date(lead.created_at))}</time><span title={lead.source}>{lead.source.startsWith("whatsapp-modal") ? "Карточка техники" : lead.source === "quiz" ? "Подбор техники" : "Форма сайта"}</span></footer>
      </article>)}</section>
      {!leads?.length && <section className="admin-panel admin-empty"><h2>{page > 1 ? "На этой странице заявок нет" : "Заявок пока нет"}</h2><p>Обращения из форм сайта появятся здесь после отправки.</p>{page > 1 && <Link href="/admin/leads">К последним заявкам</Link>}</section>}
      {pages > 1 && <nav className="admin-pagination" aria-label="Страницы заявок">{page > 1 && <Link href={`/admin/leads?page=${page - 1}`}><ArrowLeft aria-hidden="true" />Предыдущая</Link>}<span>Страница {page} из {pages}</span>{page < pages && <Link href={`/admin/leads?page=${page + 1}`}>Следующая<ArrowRight aria-hidden="true" /></Link>}</nav>}
    </>}
  </>;
}
