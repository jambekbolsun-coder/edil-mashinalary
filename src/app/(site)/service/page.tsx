import type { Metadata } from "next";
import { BadgeHelp, Cog, Headphones, PackageSearch, ShieldCheck, Wrench } from "lucide-react";
import { InnerPageHero } from "@/components/inner-page-hero";
import { LeadForm } from "@/components/lead-form";

export const metadata: Metadata = { title: "Сервис и гарантия спецтехники", description: "Гарантия 3000 моточасов, консультация по эксплуатации, помощь с расходниками и запчастями.", alternates: { canonical: "/service" } };

export default function ServicePage() {
  return (
    <main>
      <InnerPageHero eyebrow="ПОДДЕРЖКА ПОСЛЕ ПОКУПКИ" title={<>Сервис, на который<br />можно опереться</>} text="Помогаем понять технику, подобрать расходники и быстрее вернуть машину в работу." image="/images/hero-service.png" current="Сервис" />
      <section className="section section-light"><div className="container"><div className="section-heading split-heading"><div><span className="eyebrow">НАША ПОДДЕРЖКА</span><h2>Не исчезаем после передачи ключей</h2></div><p>Сначала разбираемся в задаче и комплектации, затем подсказываем следующий понятный шаг.</p></div><div className="service-grid"><article><ShieldCheck aria-hidden="true" /><span>01</span><h3>Гарантия 3000 моточасов</h3><p>Если для конкретной модели не зафиксировано другое условие.</p></article><article><Wrench aria-hidden="true" /><span>02</span><h3>Техническая консультация</h3><p>Поможем разобраться с эксплуатацией и базовым обслуживанием.</p></article><article><PackageSearch aria-hidden="true" /><span>03</span><h3>Расходники и запчасти</h3><p>Подберём позицию по модели и данным конкретной машины.</p></article><article><Cog aria-hidden="true" /><span>04</span><h3>Двигатели Weichai</h3><p>Консультация по регламенту и типовым вопросам обслуживания.</p></article><article><Headphones aria-hidden="true" /><span>05</span><h3>Помощь с эксплуатацией</h3><p>Ответим на вопросы оператора и владельца после покупки.</p></article><article><BadgeHelp aria-hidden="true" /><span>06</span><h3>Честная диагностика запроса</h3><p>Не обещаем неподтверждённые выезды или работы — сначала уточняем ситуацию.</p></article></div></div></section>
      <section className="section service-process"><div className="container"><div className="section-heading"><span className="eyebrow light">КАК ОБРАТИТЬСЯ</span><h2>Назовите модель и опишите симптом</h2></div><ol><li><span>01</span><strong>Подготовьте модель и фото</strong><p>Если возможно, сфотографируйте узел и табличку машины.</p></li><li><span>02</span><strong>Опишите, что произошло</strong><p>Когда появился симптом и может ли техника двигаться.</p></li><li><span>03</span><strong>Получите следующий шаг</strong><p>Подскажем проверку, расходник или порядок обслуживания.</p></li></ol></div></section>
      <section className="section lead-section"><div className="container lead-layout"><div className="lead-copy"><span className="eyebrow">ВОПРОС ПО СЕРВИСУ</span><h2>Расскажите, какая техника и что случилось</h2><p>Чем точнее описание, тем быстрее мы подготовим полезный ответ.</p></div><LeadForm source="service" compact /></div></section>
    </main>
  );
}
