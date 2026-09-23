import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock3, FileCheck2, Landmark, PackageCheck } from "lucide-react";
import { FinanceCalculator } from "@/components/finance-calculator";
import { InnerPageHero } from "@/components/inner-page-hero";
import { LeadForm } from "@/components/lead-form";
import { formatPrice } from "@/lib/content";
import { getPublishedEquipment } from "@/lib/queries";

export const metadata: Metadata = { title: "Условия рассрочки", description: "Предварительный расчёт рассрочки на спецтехнику в Кыргызстане. Финальные условия фиксируются в договоре.", alternates: { canonical: "/finance" } };

export default async function FinancePage() {
  const equipment = await getPublishedEquipment();
  const financed = equipment.filter((item) => item.price && item.monthlyPayment);
  return (
    <main>
      <InnerPageHero eyebrow="ПРЕДВАРИТЕЛЬНЫЙ РАСЧЁТ" title={<>Условия<br />рассрочки</>} text="Доступность программы, документы, первый взнос и срок менеджер подтвердит для выбранной модели." image="/images/hero-warehouse.png" current="Рассрочка" />
      <section className="section finance-page-section"><div className="container finance-page-grid"><div><span className="eyebrow">КАЛЬКУЛЯТОР</span><h2>Посчитайте удобный платёж</h2><p>Подвигайте ползунки. Расчёт поможет оценить бюджет до разговора с менеджером.</p></div><FinanceCalculator /></div></section>
      <section className="section finance-benefits"><div className="container"><div className="section-heading"><span className="eyebrow light">КАК ЭТО РАБОТАЕТ</span><h2>Сначала условия, затем решение</h2></div><div className="benefit-grid dark"><article><Landmark aria-hidden="true" /><h3>Формат договора</h3><p>Менеджер объяснит стороны сделки и порядок оформления.</p></article><article><FileCheck2 aria-hidden="true" /><h3>Пакет документов</h3><p>Список документов подтверждается до подачи заявки.</p></article><article><BadgeCheck aria-hidden="true" /><h3>Первый взнос</h3><p>Размер зависит от модели, поставки и согласованных условий.</p></article><article><Clock3 aria-hidden="true" /><h3>Срок платежей</h3><p>График и итоговая сумма фиксируются только в договоре.</p></article><article><PackageCheck aria-hidden="true" /><h3>Передача техники</h3><p>Дата согласуется после оформления и проверки документов.</p></article></div></div></section>
      <section className="section section-light"><div className="container"><div className="section-heading split-heading"><div><span className="eyebrow">ТОЧНЫЕ ПРИМЕРЫ</span><h2>Платежи по моделям</h2></div><p>Расчёты основаны на условиях из действующего предложения. Финальная сумма закрепляется в договоре.</p></div><div className="finance-model-table"><div className="finance-model-row finance-model-head"><span>Модель</span><span>Цена</span><span>Первый взнос</span><span>В месяц</span><span></span></div>{financed.map((item) => <div className="finance-model-row" key={item.id}><strong>{item.name}<small>{item.bucket}</small></strong><span>{formatPrice(item.price)}</span><span>{formatPrice(item.downPayment)}</span><b>≈ {formatPrice(item.monthlyPayment)}</b><Link href={`/catalog/${item.slug}`} aria-label={`Подробнее о ${item.name}`}><ArrowUpRight aria-hidden="true" /></Link></div>)}</div></div></section>
      <section className="section lead-section"><div className="container lead-layout"><div className="lead-copy"><span className="eyebrow">ПОЛУЧИТЬ РАСЧЁТ</span><h2>Рассчитаем условия под выбранную модель</h2><p>Оставьте номер и укажите технику. Менеджер сверит наличие, первый взнос и срок.</p></div><LeadForm source="finance" compact /></div></section>
    </main>
  );
}
