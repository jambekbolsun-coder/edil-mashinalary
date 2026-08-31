import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { CatalogClient } from "@/components/catalog-client";
import { getPublishedEquipment } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Каталог спецтехники",
  description: "Фронтальные погрузчики LGZT, экскаваторы, самосвалы и другая спецтехника в Кыргызстане. Цены, рассрочка и наличие.",
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage() {
  const products = await getPublishedEquipment();
  return (
    <main>
      <section className="inner-hero catalog-hero">
        <Image src="/images/hero-fleet.png" alt="Каталог спецтехники Edil Mashinalary" fill priority sizes="100vw" />
        <div className="inner-hero-shade" />
        <div className="container inner-hero-content">
          <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><span>Каталог</span></nav>
          <span className="eyebrow light">ТЕХНИКА ДЛЯ БИЗНЕСА И СТРОЙКИ</span>
          <h1>Каталог<br />спецтехники</h1>
          <p>Модели со склада и под заказ. Фильтруйте по задаче, наличию и мощности.</p>
          <a href="#catalog-grid" className="hero-scroll-inline"><ArrowDown aria-hidden="true" />Перейти к моделям</a>
        </div>
      </section>
      <section className="section catalog-section" id="catalog-grid">
        <div className="container"><CatalogClient products={products} /></div>
      </section>
    </main>
  );
}
