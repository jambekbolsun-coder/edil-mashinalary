import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EquipmentForm } from "@/components/admin/equipment-form";

type Props = { searchParams: Promise<{ error?: string }> };
export default async function NewEquipmentPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return <><header className="admin-page-head compact"><div><Link href="/admin/catalog" className="admin-back"><ArrowLeft aria-hidden="true" />Каталог</Link><span className="eyebrow">НОВАЯ КАРТОЧКА</span><h1>Добавить технику</h1><p>Заполните ключевые данные. Остальное можно дополнить позже.</p></div></header>{error && <div className="admin-alert">Не удалось сохранить. Проверьте обязательные поля и уникальность URL-кода.</div>}<EquipmentForm /></>;
}
