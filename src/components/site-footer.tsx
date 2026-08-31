"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { company } from "@/lib/content";
import { useLanguage } from "@/components/providers/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-cta container">
        <div className="footer-cta-copy">
          <span className="eyebrow light">EDIL MASHINALARY</span>
          <h2>{t("footerTitle")}</h2>
          <p>{t("footerText")}</p>
          <Link href="/contacts" className="button">
            {t("consultation")} <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <div className="footer-machine" aria-hidden="true">
          <Image src="/images/hero-fleet.png" alt="" fill sizes="(max-width: 800px) 100vw, 48vw" />
        </div>
      </div>
      <div className="footer-main container">
        <Logo />
        <nav aria-label="Навигация в подвале">
          <Link href="/catalog">{t("catalog")}</Link>
          <Link href="/finance">{t("finance")}</Link>
          <Link href="/service">{t("service")}</Link>
          <Link href="/about">{t("about")}</Link>
          <Link href="/blog">{t("blog")}</Link>
        </nav>
        <div className="footer-contacts">
          <a href={`tel:${company.phone}`}><Phone aria-hidden="true" />{company.phoneDisplay}</a>
          <a href={company.whatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />WhatsApp</a>
          <a href={company.instagram} target="_blank" rel="noreferrer"><Camera aria-hidden="true" />Instagram</a>
          <a href={company.map} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" />Новопокровка, ул. Ленина, 633</a>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© 2026 Edil Mashinalary</span>
        <span>Спецтехника в Кыргызстане</span>
        <Link href="/admin/login">Вход для администратора</Link>
      </div>
    </footer>
  );
}
