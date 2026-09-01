"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";

const slides = [
  {
    image: "/images/hero-fleet.png",
    eyebrow: "Парк техники в Кыргызстане",
    title: "Спецтехника, которая не ждёт сезона",
    text: "Погрузчики LGZT, HOWO и техника под вашу задачу. Часть моделей уже на складе.",
  },
  {
    image: "/images/hero-warehouse.png",
    eyebrow: "Быстрая выдача со склада",
    title: "Оформили. Проверили. Забрали за час.",
    text: "Если модель в наличии, подготовим документы и передачу техники без долгой бюрократии.",
  },
  {
    image: "/images/hero-service.png",
    eyebrow: "Сервис и гарантия",
    title: "Остаёмся рядом после покупки",
    text: "Гарантия 3000 моточасов, консультация по эксплуатации, расходникам и запчастям.",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(interval);
  }, [playing]);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Предложения Edil Mashinalary" onFocusCapture={() => setPlaying(false)}>
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div className="hero-slide" data-active={active === index} key={slide.image} aria-hidden={active !== index}>
            <Image src={slide.image} alt="" fill priority={index === 0} sizes="100vw" />
          </div>
        ))}
      </div>
      <div className="hero-shade" />
      <div className="hero-content container">
        <div className="hero-copy">
          <span className="eyebrow light">{active === 0 ? t("heroEyebrow") : slides[active].eyebrow}</span>
          <h1>{active === 0 ? t("heroTitle") : slides[active].title}</h1>
          <p>{active === 0 ? t("heroText") : slides[active].text}</p>
          <div className="hero-actions">
            <Link href="/catalog" className="button">
              {t("openCatalog")} <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/contacts" className="button button-ghost">
              {t("consultation")}
            </Link>
          </div>
        </div>
        <dl className="hero-stats">
          <div><dt>01</dt><dd><strong>{t("models")}</strong><span>в каталоге</span></dd></div>
          <div><dt>02</dt><dd><strong>{t("oneHour")}</strong><span>для техники на складе</span></dd></div>
          <div><dt>03</dt><dd><strong>{t("warranty")}</strong><span>гарантия</span></dd></div>
        </dl>
        <div className="hero-controls">
          <div className="hero-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                className={active === index ? "active" : undefined}
                onClick={() => setActive(index)}
                aria-label={`Показать баннер ${index + 1}`}
              ><span /></button>
            ))}
          </div>
          <button className="hero-play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Остановить карусель" : "Запустить карусель"}>
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
        </div>
        <a className="hero-scroll" href="#popular">
          <ArrowDown aria-hidden="true" />
          <span>Смотреть технику</span>
        </a>
      </div>
    </section>
  );
}
