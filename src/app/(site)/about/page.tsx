import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { InnerPageHero } from "@/components/inner-page-hero";

export const metadata: Metadata = { title: "О компании", description: "Edil Mashinalary — поставщик спецтехники в Кыргызстане: подбор, рассрочка, гарантия и поддержка после покупки.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <main>
      <InnerPageHero eyebrow="EDIL MASHINALARY" title={<>Техника для тех,<br />кто строит и растёт</>} text="Поставляем спецтехнику для строительства, хозяйства, логистики и частных проектов в Кыргызстане." image="/images/hero-fleet.png" current="О компании" />
      <section className="section section-light"><div className="container story-grid"><div className="story-copy"><span className="eyebrow">КТО МЫ</span><h2>Подбираем не модель из списка, а рабочее решение</h2><p>Edil Mashinalary поставляет фронтальные погрузчики, экскаваторы, самосвалы и другую технику из Китая. Мы начинаем с вопроса: что именно должна делать машина на вашей площадке.</p><p>После выбора объясняем комплектацию, документы и рассрочку. После передачи остаёмся на связи по эксплуатации, расходникам и запчастям.</p><ul><li><Check aria-hidden="true" />Техника для стройки, фермы, ЖКХ и карьера</li><li><Check aria-hidden="true" />Модели со склада и под заказ</li><li><Check aria-hidden="true" />Прямая рассрочка без банка</li></ul></div><div className="story-image"><Image src="/images/hero-warehouse.png" alt="Площадка спецтехники Edil Mashinalary" fill sizes="(max-width: 900px) 100vw, 48vw" /></div></div></section>
      <section className="section about-numbers"><div className="container"><div className="about-number-grid"><article><strong>10+</strong><span>моделей в каталоге</span></article><article><strong>01:00</strong><span>выдача со склада</span></article><article><strong>12</strong><span>месяцев рассрочки</span></article><article><strong>3000</strong><span>моточасов гарантии</span></article></div></div></section>
      <section className="section founder-section"><div className="container founder-grid"><div className="founder-placeholder"><span>EDIL</span><p>Здесь будет фотография основателя компании</p></div><div><span className="eyebrow">ЛИЦО КОМПАНИИ</span><h2>Ответственность начинается с личного контакта</h2><p>Мы не публикуем выдуманную историю. Когда компания подготовит фотографию и рассказ основателя, этот блок станет личным обращением к клиентам.</p><Link href="/contacts" className="button">Познакомиться с командой <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
    </main>
  );
}
