import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, ClipboardCheck, Clock3, Cog, Headphones, PackageCheck, ShieldCheck, WalletCards, Wrench } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { LeadForm } from "@/components/lead-form";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getBlogPosts, getPublishedEquipment } from "@/lib/queries";

export default async function HomePage() {
  const [products, blogPosts] = await Promise.all([getPublishedEquipment(), getBlogPosts()]);
  const featured = products.filter((product) => product.featured).slice(0, 6);

  return (
    <main>
      <HeroCarousel />

      <section className="section section-light" id="popular">
        <div className="container">
          <Reveal className="section-heading split-heading">
            <div><span className="eyebrow">КАТАЛОГ ТЕХНИКИ</span><h2>Модели, которые<br />выходят на объект</h2></div>
            <div><p>Сравните объём ковша, мощность, наличие и платёж в месяц. На каждой странице есть комплектация и условия покупки.</p><Link href="/catalog" className="text-link">Смотреть весь каталог <ArrowUpRight aria-hidden="true" /></Link></div>
          </Reveal>
          <div className="product-grid product-grid-home">
            {featured.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} />)}
          </div>
        </div>
      </section>

      <section className="section value-section">
        <div className="container value-layout">
          <Reveal className="value-image">
            <Image src="/images/hero-warehouse.png" alt="Спецтехника на площадке Edil Mashinalary" fill quality={90} sizes="(max-width: 900px) 100vw, 52vw" />
            <div className="value-image-caption"><strong>10+</strong><span>моделей представлено в каталоге</span></div>
          </Reveal>
          <div className="value-copy">
            <span className="eyebrow light">ПОЧЕМУ EDIL</span><h2>Сильная техника.<br />Понятная сделка.</h2>
            <p>Помогаем выбрать рабочую модель, заранее объясняем платежи и остаёмся на связи после передачи техники.</p>
            <div className="value-points">
              <article><BadgeCheck aria-hidden="true" /><strong>Комплектация</strong><span>Фиксируется для выбранной машины</span></article>
              <article><WalletCards aria-hidden="true" /><strong>Условия платежей</strong><span>Подтверждаются до подписания договора</span></article>
              <article><ShieldCheck aria-hidden="true" /><strong>Гарантия</strong><span>Срок и покрытие указываются в договоре</span></article>
              <article><Headphones aria-hidden="true" /><strong>После покупки</strong><span>Консультация, сервис и запчасти</span></article>
            </div>
            <Link href="/about" className="button button-light">Узнать о компании <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="section finance-home">
        <div className="container">
          <Reveal className="finance-intro">
            <div><span className="eyebrow">РАССРОЧКА БЕЗ БАНКА</span><h2>Паспорт.<br />Первый взнос.<br />Техника ваша.</h2></div>
            <div><p>Внесите примерно от 50% стоимости, а остаток разделите на срок до 12 месяцев. Без банковских анкет и скрытых комиссий.</p><Link href="/finance" className="button">Рассчитать платёж <ArrowRight aria-hidden="true" /></Link></div>
          </Reveal>
          <div className="finance-steps">
            <article><span>01</span><ClipboardCheck aria-hidden="true" /><h3>Выберите модель</h3><p>Сравним ковш, мощность и задачи.</p></article>
            <article><span>02</span><PackageCheck aria-hidden="true" /><h3>Внесите первый взнос</h3><p>Для оформления достаточно паспорта.</p></article>
            <article><span>03</span><Clock3 aria-hidden="true" /><h3>Согласуйте передачу</h3><p>Менеджер подтвердит наличие, документы и удобное время.</p></article>
          </div>
        </div>
      </section>

      <section className="service-preview">
        <Image src="/images/hero-service.png" alt="Сервис спецтехники Edil Mashinalary" fill quality={90} sizes="100vw" /><div className="service-preview-shade" />
        <div className="container service-preview-content">
          <span className="eyebrow light">СЕРВИС И ГАРАНТИЯ</span><h2>Техника работает.<br />Мы остаёмся рядом.</h2>
          <div className="service-preview-points"><span><Wrench aria-hidden="true" />Техническая консультация</span><span><Cog aria-hidden="true" />Расходники и запчасти</span><span><ShieldCheck aria-hidden="true" />Условия гарантии по договору</span></div>
          <Link href="/service" className="button">Подробнее о сервисе <ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="section blog-preview section-light">
        <div className="container">
          <div className="section-heading split-heading">
            <div><span className="eyebrow">ПОЛЕЗНО ЗНАТЬ</span><h2>Коротко о выборе<br />и эксплуатации</h2></div>
            <Link href="/blog" className="text-link">Все статьи <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className="blog-grid">
            {blogPosts.slice(0, 3).map((post) => (
              <article className="blog-card" key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="blog-image" aria-label={`Читать: ${post.title}`}><Image src={post.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></Link>
                <div><span>{post.category} · {post.readTime}</span><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p><Link className="text-link" href={`/blog/${post.slug}`}>Читать <ArrowUpRight aria-hidden="true" /></Link></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section lead-section">
        <div className="container lead-layout">
          <div className="lead-copy"><span className="eyebrow">ПОДБЕРЁМ ВМЕСТЕ</span><h2>Расскажите о работе. Мы предложим технику.</h2><p>Сравним подходящие модели, посчитаем рассрочку и честно скажем, что есть на складе.</p><div className="lead-contact"><strong>+996 551 000 303</strong><span>Ответим в WhatsApp или перезвоним</span></div></div>
          <LeadForm source="home" />
        </div>
      </section>
    </main>
  );
}
