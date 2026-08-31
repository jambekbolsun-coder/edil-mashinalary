import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import { InnerPageHero } from "@/components/inner-page-hero";
import { LeadForm } from "@/components/lead-form";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Телефон, WhatsApp, адрес и форма связи Edil Mashinalary в Кыргызстане.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <main>
      <InnerPageHero
        eyebrow="СВЯЗАТЬСЯ С НАМИ"
        title={<>Приезжайте посмотреть<br />технику вживую</>}
        text="Позвоните перед поездкой — подтвердим наличие модели и подготовим её к показу."
        image="/images/hero-warehouse.png"
        current="Контакты"
      />
      <section className="section section-light">
        <div className="container contact-grid">
          <div className="contact-cards">
            <a className="phone" href={`tel:${company.phone}`}><Phone aria-hidden="true" /><span>Телефон</span><strong>{company.phoneDisplay}</strong><small>Нажмите, чтобы позвонить</small></a>
            <a className="instagram" href={company.instagram} target="_blank" rel="noreferrer"><Camera aria-hidden="true" /><span>Instagram</span><strong>@edilmashinalary</strong><small>Новости и техника в работе</small></a>
            <a className="whatsapp" href={`${company.whatsapp}?text=${encodeURIComponent("Здравствуйте! Хочу уточнить наличие спецтехники.")}`}><MessageCircle aria-hidden="true" /><span>WhatsApp</span><strong>Написать менеджеру</strong><small>Обычно это самый быстрый способ</small></a>
            <Link className="address" href={company.map} target="_blank"><MapPin aria-hidden="true" /><span>Адрес</span><strong>Новопокровка, ул. Ленина, 633</strong><small>Открыть маршрут ↗</small></Link>
          </div>
          <div className="contact-side">
            <span className="eyebrow">РЕЖИМ СВЯЗИ</span>
            <h2>Согласуем удобное время</h2>
            <p>Площадка работает по предварительной договорённости. Так менеджер сможет уделить вам время и показать нужную технику.</p>
            <div className="contact-hours"><Clock3 aria-hidden="true" /><div><strong>Ежедневно</strong><span>по предварительному звонку</span></div></div>
            <Link href={company.map} target="_blank" className="button">Построить маршрут <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
      <section className="section lead-section">
        <div className="container lead-layout">
          <div className="lead-copy"><span className="eyebrow">ОБРАТНЫЙ ЗВОНОК</span><h2>Оставьте номер — обсудим вашу задачу</h2><p>Можно сразу указать модель или тип работ. Мы подготовимся к разговору.</p></div>
          <LeadForm source="contacts" />
        </div>
      </section>
    </main>
  );
}
