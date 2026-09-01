import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BadgeCheck, Check, MessageCircle, ShieldCheck } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { categoryLabels, company, equipment as seedEquipment, formatPrice } from "@/lib/content";
import { getEquipmentItem, getPublishedEquipment } from "@/lib/queries";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return seedEquipment.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getEquipmentItem(slug);
  if (!product) return { title: "Модель не найдена" };
  return {
    title: `${product.brand} ${product.name} — купить в Кыргызстане`,
    description: `${product.shortDescription} Цена, характеристики, рассрочка и гарантия Edil Mashinalary.`,
    alternates: { canonical: `/catalog/${product.slug}` },
    openGraph: { images: [{ url: product.images[0], alt: `${product.brand} ${product.name}` }] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getEquipmentItem(slug), getPublishedEquipment()]);
  if (!product) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edil-mashinalary.vercel.app";
  const recommended = allProducts.filter((item) => item.slug !== product.slug && item.category === product.category).slice(0, 3);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name}`,
    image: product.images,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: product.brand },
    offers: product.price
      ? { "@type": "Offer", url: `${siteUrl}/catalog/${product.slug}`, priceCurrency: "KGS", price: product.price, availability: product.status === "in-stock" ? "https://schema.org/InStock" : "https://schema.org/PreOrder" }
      : undefined,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Каталог", item: `${siteUrl}/catalog` },
      { "@type": "ListItem", position: 3, name: `${product.brand} ${product.name}`, item: `${siteUrl}/catalog/${product.slug}` },
    ],
  };

  return (
    <main className="product-page">
      <section className="product-top container">
        <nav className="breadcrumbs dark" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href="/catalog">Каталог</Link><span>/</span><span>{product.name}</span></nav>
        <div className="product-top-grid">
          <ProductGallery images={product.images} name={`${product.brand} ${product.name}`} />
          <div className="product-summary">
            <span className="eyebrow">{categoryLabels[product.category]}</span>
            <div className="product-title-row"><h1>{product.brand}<br />{product.name}</h1><span className={`stock-badge ${product.status === "in-stock" ? "available" : "order"}`}>{product.status === "in-stock" ? "В наличии" : "Под заказ"}</span></div>
            <p>{product.shortDescription}</p>
            <div className="product-key-specs">
              {product.bucket && <div><span>Ковш</span><strong>{product.bucket}</strong></div>}
              {product.loadCapacity && <div><span>Грузоподъёмность</span><strong>{product.loadCapacity}</strong></div>}
              {product.power && <div><span>Мощность</span><strong>{product.power} л.с.</strong></div>}
            </div>
            <div className="product-buy-box">
              <div><span>Стоимость</span>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}<strong>{formatPrice(product.price)}</strong></div>
              {product.monthlyPayment && <div className="product-monthly"><span>Рассрочка</span><strong>≈ {formatPrice(product.monthlyPayment)}</strong><small>в месяц, до {product.installmentMonths} месяцев</small></div>}
            </div>
            <div className="product-actions">
              <a className="button" href={`${company.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует ${product.brand} ${product.name}.`)}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />Написать в WhatsApp</a>
              <a className="button button-outline" href="#request">Оставить заявку <ArrowUpRight aria-hidden="true" /></a>
            </div>
            <div className="product-guarantees"><span><ShieldCheck aria-hidden="true" />Гарантия {product.warrantyHours} моточасов</span><span><BadgeCheck aria-hidden="true" />Прямой договор</span></div>
          </div>
        </div>
      </section>

      <section className="section product-details-section">
        <div className="container product-details-grid">
          <div className="product-description"><span className="eyebrow">О МОДЕЛИ</span><h2>Готова к реальной работе</h2><p>{product.description}</p><h3>Комплектация</h3><ul>{product.equipment.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div>
          <div className="spec-table-wrap"><span className="eyebrow">ХАРАКТЕРИСТИКИ</span><dl className="spec-table">{product.specs.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}<div><dt>Гарантия</dt><dd>{product.warrantyHours} моточасов</dd></div></dl><p>Комплектация конкретной поставки фиксируется в договоре. Уточните параметры перед оплатой.</p></div>
        </div>
      </section>

      {product.price && product.downPayment && product.monthlyPayment && (
        <section className="product-finance-banner"><div className="container"><div><span className="eyebrow light">РАССРОЧКА БЕЗ БАНКА</span><h2>{product.name}: понятный расчёт</h2><p>Паспорт и прямой договор. Без банковской комиссии.</p></div><dl><div><dt>Первый взнос</dt><dd>{formatPrice(product.downPayment)}</dd></div><div><dt>Остаток</dt><dd>{formatPrice(product.price - product.downPayment)}</dd></div><div><dt>В месяц</dt><dd>≈ {formatPrice(product.monthlyPayment)}</dd></div></dl><Link href="/finance" className="button">Все условия <ArrowUpRight aria-hidden="true" /></Link></div></section>
      )}

      <section className="section section-light" id="request"><div className="container lead-layout"><div className="lead-copy"><span className="eyebrow">ЗАЯВКА НА {product.name}</span><h2>Уточним наличие и комплектацию</h2><p>Оставьте номер. Менеджер перезвонит, ответит по цене и рассчитает рассрочку.</p></div><LeadForm source={`product:${product.slug}`} compact /></div></section>

      {recommended.length > 0 && <section className="section recommended-section"><div className="container"><div className="section-heading"><span className="eyebrow">ПОХОЖИЕ МОДЕЛИ</span><h2>Ещё техника этого класса</h2></div><div className="product-grid">{recommended.map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
