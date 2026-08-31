import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock3, FileCheck2, Landmark, PackageCheck } from "lucide-react";
import { FinanceCalculator } from "@/components/finance-calculator";
import { InnerPageHero } from "@/components/inner-page-hero";
import { LeadForm } from "@/components/lead-form";
import { equipment, formatPrice } from "@/lib/content";

export const metadata: Metadata = { title: "Рассрочка без банка", description: "Купить спецтехнику в рассрочку в Кыргызстане: паспорт, первый взнос примерно от 50%, срок до 12 месяцев.", alternates: { canonical: "/finance" } };

export default function FinancePage() {
  const financed = equipment.filter((item) => item.price && item.monthlyPayment);
  return (
    <main>
      <InnerPageHero eyebrow="ПРЯМОЙ ДОГОВОР" title={<>Рассрочка<br />без банка</>} text="Достаточно паспорта. Первый взнос примерно от 50%, остаток — до 12 месяцев." image="/images/hero-warehouse.png" current="Рассрочка" />
      <section className="section finance-page-section"><div className="container finance-page-grid"><div><span className="eyebrow">КАЛЬКУЛЯТОР</span><h2>Посчитайте удобный платёж</h2><p>Подвигайте ползунки. Расчёт поможет оценить бюджет до разговора с менеджером.</p></div><FinanceCalculator /></div></section>
      <section className="section finance-benefits"><div className="container"><div className="section-heading"><span className="eyebrow light">КАК ЭТО РАБОТАЕТ</span><h2>Без сложной банковской процедуры</h2></div><div className="benefit-grid dark"><article><Landmark aria-hidden="true" /><h3>Банк не нужен</h3><p>Договор заключаете напрямую с компанией.</p></article><article><FileCheck2 aria-hidden="true" /><h3>Достаточно паспорта</h3><p>Без длинной анкеты и справок о доходах.</p></article><article><BadgeCheck aria-hidden="true" /><h3>От 50% первый взнос</h3><p>Точный размер зависит от модели и поставки.</p></article><article><Clock3 aria-hidden="true" /><h3>До 12 месяцев</h3><p>Остаток делится на понятные ежемесячные платежи.</p></article><article><PackageCheck aria-hidden="true" /><h3>Техника сразу в работе</h3><p>После оформления и передачи можно выходить на объект.</p></article></div></div></section>
      <section className="section section-light"><div className="container"><div className="section-heading split-heading"><div><span className="eyebrow">ТОЧНЫЕ ПРИМЕРЫ</span><h2>Платежи по моделям</h2></div><p>Расчёты основаны на условиях из действующего предложения. Финальная сумма закрепляется в договоре.</p></div><div className="finance-model-table"><div className="finance-model-row finance-model-head"><span>Модель</span><span>Цена</span><span>Первый взнос</span><span>В месяц</span><span></span></div>{financed.map((item) => <div className="finance-model-row" key={item.id}><strong>{item.name}<small>{item.bucket}</small></strong><span>{formatPrice(item.price)}</span><span>{formatPrice(item.downPayment)}</span><b>≈ {formatPrice(item.monthlyPayment)}</b><Link href={`/catalog/${item.slug}`} aria-label={`Подробнее о ${item.name}`}><ArrowUpRight aria-hidden="true" /></Link></div>)}</div></div></section>
      <section className="section lead-section"><div className="container lead-layout"><div className="lead-copy"><span className="eyebrow">ПОЛУЧИТЬ РАСЧЁТ</span><h2>Рассчитаем условия под выбранную модель</h2><p>Оставьте номер и укажите технику. Менеджер сверит наличие, первый взнос и срок.</p></div><LeadForm source="finance" compact /></div></section>
    </main>
  );
}
