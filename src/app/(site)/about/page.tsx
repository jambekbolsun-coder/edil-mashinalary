import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin, MessageCircle, Phone } from "lucide-react";
import { InnerPageHero } from "@/components/inner-page-hero";
import { company } from "@/lib/content";

export const metadata: Metadata = { title: "О компании", description: "Edil Mashinalary — поставщик спецтехники в Кыргызстане: подбор, рассрочка, гарантия и поддержка после покупки.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <main>
      <InnerPageHero eyebrow="EDIL MASHINALARY" title={<>Техника для тех,<br />кто строит и растёт</>} text="Поставляем спецтехнику для строительства, хозяйства, логистики и частных проектов в Кыргызстане." image="/images/hero-fleet.png" current="О компании" />
      <section className="section section-light"><div className="container story-grid"><div className="story-copy"><span className="eyebrow">КТО МЫ</span><h2>Подбираем не модель из списка, а рабочее решение</h2><p>Edil Mashinalary представляет фронтальные погрузчики, экскаваторы, самосвалы и другую технику для задач бизнеса и частных проектов. Мы начинаем с вопроса: что именно должна делать машина на вашей площадке.</p><p>После выбора объясняем комплектацию, документы и доступные варианты оплаты. После передачи остаёмся на связи по эксплуатации, расходникам и запчастям.</p><ul><li><Check aria-hidden="true" />Техника для стройки, фермы, ЖКХ и карьера</li><li><Check aria-hidden="true" />Модели со склада и под заказ</li><li><Check aria-hidden="true" />Условия оплаты фиксируются в договоре</li></ul></div><div className="story-image"><Image src="/images/hero-warehouse.png" alt="Площадка спецтехники Edil Mashinalary" fill quality={90} sizes="(max-width: 900px) 100vw, 48vw" /></div></div></section>
      <section className="section about-numbers"><div className="container"><div className="about-number-grid"><article><strong>10+</strong><span>позиций в каталоге</span></article><article><strong>2</strong><span>формата поставки: склад и заказ</span></article><article><strong>5</strong><span>языков интерфейса</span></article><article><strong>1</strong><span>контакт для заявки и поддержки</span></article></div></div></section>
      <section className="section founder-section"><div className="container founder-grid"><div className="story-image"><Image src="/images/hero-fleet.png" alt="Площадка со спецтехникой Edil Mashinalary" fill quality={90} sizes="(max-width: 900px) 100vw, 48vw" /></div><div><span className="eyebrow">КОНТАКТЫ КОМПАНИИ</span><h2>Приезжайте посмотреть технику</h2><p>Актуальное наличие и конкретную комплектацию лучше подтвердить перед поездкой. Менеджер подскажет, какие модели доступны для осмотра.</p><ul className="company-facts"><li><MapPin aria-hidden="true" /><span><strong>Адрес</strong>{company.address}</span></li><li><Phone aria-hidden="true" /><span><strong>Телефон</strong>{company.phoneDisplay}</span></li><li><MessageCircle aria-hidden="true" /><span><strong>WhatsApp</strong>Ответим по каталогу и сервису</span></li></ul><Link href="/contacts" className="button">Открыть контакты <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
    </main>
  );
}
