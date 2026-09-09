import type { Metadata } from "next";
import { BadgeHelp, Cog, Headphones, PackageSearch, ShieldCheck, Wrench } from "lucide-react";
import { InnerPageHero } from "@/components/inner-page-hero";
import { LeadForm } from "@/components/lead-form";
import { getServices } from "@/lib/queries";

export const metadata: Metadata = { title: "Сервис и поддержка спецтехники", description: "Консультация по эксплуатации, условиям гарантии, расходникам и запчастям.", alternates: { canonical: "/service" } };

const serviceIcons = { shield: ShieldCheck, wrench: Wrench, package: PackageSearch, settings: Cog, headphones: Headphones } as const;

export default async function ServicePage() {
  const services = await getServices();
  return (
    <main>
      <InnerPageHero eyebrow="ПОДДЕРЖКА ПОСЛЕ ПОКУПКИ" title={<>Сервис, на который<br />можно опереться</>} text="Помогаем понять технику, подобрать расходники и быстрее вернуть машину в работу." image="/images/hero-service.png" current="Сервис" />
      <section className="section section-light"><div className="container"><div className="section-heading split-heading"><div><span className="eyebrow">НАША ПОДДЕРЖКА</span><h2>Не исчезаем после передачи ключей</h2></div><p>Сначала разбираемся в задаче и комплектации, затем подсказываем следующий понятный шаг.</p></div><div className="service-grid">{services.map((service, index) => { const Icon = serviceIcons[service.icon as keyof typeof serviceIcons] || BadgeHelp; return <article key={service.id}><Icon aria-hidden="true" /><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.title}</h3><p>{service.excerpt}</p></article>; })}</div></div></section>
      <section className="section service-process"><div className="container"><div className="section-heading"><span className="eyebrow light">КАК ОБРАТИТЬСЯ</span><h2>Назовите модель и опишите симптом</h2></div><ol><li><span>01</span><strong>Подготовьте модель и фото</strong><p>Если возможно, сфотографируйте узел и табличку машины.</p></li><li><span>02</span><strong>Опишите, что произошло</strong><p>Когда появился симптом и может ли техника двигаться.</p></li><li><span>03</span><strong>Получите следующий шаг</strong><p>Подскажем проверку, расходник или порядок обслуживания.</p></li></ol></div></section>
      <section className="section lead-section"><div className="container lead-layout"><div className="lead-copy"><span className="eyebrow">ВОПРОС ПО СЕРВИСУ</span><h2>Расскажите, какая техника и что случилось</h2><p>Чем точнее описание, тем быстрее мы подготовим полезный ответ.</p></div><LeadForm source="service" compact /></div></section>
    </main>
  );
}
