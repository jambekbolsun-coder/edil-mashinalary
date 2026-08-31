"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Flag } from "@/components/ui/flag";
import { SearchModal } from "@/components/search-modal";
import { company, equipment } from "@/lib/content";
import { localeNames } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

const navItems = [
  { href: "/catalog", key: "catalog" },
  { href: "/finance", key: "finance" },
  { href: "/service", key: "service" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contacts", key: "contacts" },
] as const;

const locales: Locale[] = ["ky", "ru", "en", "tr", "zh"];

export function SiteHeader() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const [scrolled, setScrolled] = useState(pathname !== "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(pathname !== "/" || window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMenuOpen(false);
      setLanguageOpen(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", menuOpen);
    return () => document.body.classList.remove("modal-open");
  }, [menuOpen]);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled} data-home={pathname === "/"}>
        <div className="header-inner">
          <Logo compact />
          <nav className="desktop-nav" aria-label="Основная навигация">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname.startsWith(item.href) ? "active" : undefined}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="header-icon" onClick={() => setSearchOpen(true)} aria-label={t("search")}>
              <Search aria-hidden="true" />
            </button>
            <div className="language-menu">
              <button
                className="language-trigger"
                aria-expanded={languageOpen}
                aria-haspopup="listbox"
                onClick={() => setLanguageOpen((value) => !value)}
              >
                <Flag locale={locale} />
                <span>{localeNames[locale]}</span>
                <ChevronDown aria-hidden="true" />
              </button>
              {languageOpen && (
                <div className="language-list" role="listbox" aria-label={t("language")}>
                  {locales.map((item) => (
                    <button
                      key={item}
                      role="option"
                      aria-selected={locale === item}
                      onClick={() => {
                        setLocale(item);
                        setLanguageOpen(false);
                      }}
                    >
                      <Flag locale={item} />
                      <span>{localeNames[item]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href={`${company.whatsapp}?text=${encodeURIComponent("Здравствуйте! Нужна консультация по спецтехнике.")}`} className="button button-small header-cta">
              {t("consultation")} <span aria-hidden="true">↗</span>
            </Link>
            <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label={t("menu")}>
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label={t("menu")}>
          <div className="mobile-menu-head">
            <Logo />
            <button className="icon-button inverse" onClick={() => setMenuOpen(false)} aria-label={t("close")}>
              <X aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Мобильная навигация">
            {navItems.map((item, index) => (
              <Link key={item.href} href={item.href}>
                <span>0{index + 1}</span>
                {t(item.key)}
                <em aria-hidden="true">↗</em>
              </Link>
            ))}
          </nav>
          <div className="mobile-language-list" aria-label={t("language")}>
            {locales.map((item) => (
              <button
                key={item}
                aria-pressed={locale === item}
                onClick={() => setLocale(item)}
              >
                <Flag locale={item} />
                {localeNames[item]}
              </button>
            ))}
          </div>
          <a href={`tel:${company.phone}`} className="mobile-phone">{company.phoneDisplay}</a>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} products={equipment} />
    </>
  );
}
