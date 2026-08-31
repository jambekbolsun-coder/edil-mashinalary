import Link from "next/link";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { deleteEquipmentAction, toggleEquipmentAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export default async function AdminCatalogPage() {
  const { supabase } = await requireAdmin();
  const { data: products } = await supabase.from("equipment").select("id, name, brand, category, status, published, price, created_at").order("created_at", { ascending: false });
  return <>
    <header className="admin-page-head"><div><span className="eyebrow">КАТАЛОГ</span><h1>Спецтехника</h1><p>Добавляйте новые модели и управляйте их видимостью.</p></div><Link href="/admin/catalog/new" className="button"><Plus aria-hidden="true" />Добавить технику</Link></header>
    <section className="admin-panel"><div className="admin-table-wrap"><table className="admin-table">
      <thead><tr><th>Модель</th><th>Категория</th><th>Статус</th><th>Цена</th><th>Публикация</th><th><span className="sr-only">Действия</span></th></tr></thead>
      <tbody>{products?.map((item) => <tr key={item.id}>
        <td><Link href={`/admin/catalog/${item.id}/edit`}><strong>{item.name}</strong><small>{item.brand} · редактировать</small></Link></td>
        <td>{item.category}</td><td><span className={`admin-status ${item.status}`}>{item.status === "in-stock" ? "В наличии" : "Под заказ"}</span></td>
        <td>{item.price ? `${new Intl.NumberFormat("ru-RU").format(item.price)} сом` : "По запросу"}</td>
        <td><form action={toggleEquipmentAction}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="published" value={String(item.published)} /><button className="admin-table-action" title={item.published ? "Скрыть" : "Опубликовать"}>{item.published ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}{item.published ? "На сайте" : "Черновик"}</button></form></td>
        <td><form action={deleteEquipmentAction}><input type="hidden" name="id" value={item.id} /><button className="admin-delete" title="Удалить"><Trash2 aria-hidden="true" /></button></form></td>
      </tr>)}{!products?.length && <tr><td colSpan={6}><div className="admin-empty"><span className="admin-empty-icon">EM</span><h2>В базе ещё нет моделей</h2><p>Базовый каталог уже виден на сайте. Добавленная здесь техника появится рядом с ним.</p><Link className="button" href="/admin/catalog/new">Добавить первую модель</Link></div></td></tr>}</tbody>
    </table></div></section>
  </>;
}
