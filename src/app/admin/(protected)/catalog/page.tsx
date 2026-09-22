import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus } from "lucide-react";
import { deleteEquipmentAction, toggleEquipmentAction } from "@/app/admin/actions";
import { DestructiveSubmit } from "@/components/admin/destructive-submit";
import { requireAdmin } from "@/lib/auth";
import { categoryLabels } from "@/lib/categories";
import { formatPrice } from "@/lib/content";

export default async function AdminCatalogPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error: actionError } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: products, error } = await supabase.from("equipment").select("id,name,brand,category,status,published,price,images,short_description,bucket,power").order("created_at", { ascending: false });
  return <>
    <header className="admin-page-head"><div><span className="eyebrow">КАТАЛОГ</span><h1>Спецтехника</h1><p>Фотографии, характеристики и публикация моделей на сайте.</p></div><Link href="/admin/catalog/new" className="button"><Plus aria-hidden="true" />Добавить технику</Link></header>
    {actionError && <div className="admin-alert" role="alert">Изменение не сохранено. Обновите страницу и повторите попытку.</div>}
    {error ? <div className="admin-alert" role="alert">Не удалось загрузить каталог. Обновите страницу.</div> : <>
      <p className="admin-list-count">Моделей: {products?.length ?? 0}</p>
      <section className="admin-catalog-grid" aria-label="Модели техники">
        {products?.map((item) => {
          const photo = Array.isArray(item.images) && typeof item.images[0] === "string" ? item.images[0] : "/images/hero-fleet.png";
          return <article className="admin-equipment-card" key={item.id}>
            <Link href={`/admin/catalog/${item.id}/edit`} className="admin-equipment-image" aria-label={`Редактировать ${item.name}`}><Image src={photo} alt={`${item.brand} ${item.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1200px) 45vw, 30vw" /><span className={`admin-status ${item.status}`}>{item.status === "in-stock" ? "В наличии" : "Под заказ"}</span></Link>
            <div className="admin-equipment-body"><span className="admin-card-category">{categoryLabels[item.category as keyof typeof categoryLabels] || item.category}</span><h2><Link href={`/admin/catalog/${item.id}/edit`}>{item.name}</Link></h2><p>{item.short_description}</p><div className="admin-equipment-specs"><span>{item.brand}</span>{item.bucket && <span>{item.bucket}</span>}{item.power && <span>{item.power} л.с.</span>}</div><strong className="admin-equipment-price">{formatPrice(item.price)}</strong>
              <div className="admin-card-actions"><Link className="admin-edit-link" href={`/admin/catalog/${item.id}/edit`}><Pencil aria-hidden="true" />Редактировать</Link><form action={toggleEquipmentAction}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="published" value={String(item.published)} /><button className="admin-table-action" aria-label={`${item.published ? "Скрыть" : "Опубликовать"} ${item.name}`}>{item.published ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}{item.published ? "На сайте" : "Черновик"}</button></form><form action={deleteEquipmentAction} className="admin-card-delete"><input type="hidden" name="id" value={item.id} /><DestructiveSubmit label={`Удалить ${item.name}`} /></form></div>
            </div>
          </article>;
        })}
      </section>
      {!products?.length && <section className="admin-panel admin-empty"><h2>В каталоге пока пусто</h2><p>Добавьте модель, фотографии и характеристики.</p><Link className="button" href="/admin/catalog/new">Добавить первую модель</Link></section>}
    </>}
  </>;
}
