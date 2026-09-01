"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { categoryLabels } from "@/lib/content";
import type { Equipment } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
  products: Equipment[];
};

export function SearchModal({ open, onClose, products }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.classList.add("modal-open");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const normalized = query.toLowerCase().replace(",", ".").trim();
    if (!normalized) return products.slice(0, 5);
    return products
      .filter((product) => {
        const haystack = [
          product.name,
          product.brand,
          categoryLabels[product.category],
          product.bucket,
          product.loadCapacity,
          ...product.keywords,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .replace(",", ".");
        return haystack.includes(normalized);
      })
      .slice(0, 7);
  }, [products, query]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="search-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="search-panel-head">
          <div>
            <span className="eyebrow">КАТАЛОГ ТЕХНИКИ</span>
            <h2 id="search-title">{t("search")}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={t("close")}>
            <X aria-hidden="true" />
          </button>
        </div>
        <label className="search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">{t("search")}</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            autoComplete="off"
          />
        </label>
        <div className="search-result-summary">
          <span>{query ? `Результатов: ${results.length}` : "Популярные модели"}</span>
          <kbd>ESC</kbd>
        </div>
        <div className="search-results" aria-live="polite">
          {results.length === 0 ? (
            <div className="search-empty">
              <strong>Ничего не найдено</strong>
              <p>{t("searchEmpty")}</p>
              <Link href="/contacts" className="text-link" onClick={onClose}>
                {t("consultation")}
              </Link>
            </div>
          ) : (
            results.map((product) => (
              <Link
                href={`/catalog/${product.slug}`}
                className="search-result"
                key={product.id}
                onClick={onClose}
              >
                <span className="search-result-image">
                  <Image src={product.images[0]} alt="" fill sizes="96px" />
                </span>
                <span>
                  <small>{categoryLabels[product.category]}</small>
                  <strong>{product.brand} {product.name}</strong>
                  <em>{product.bucket ?? product.loadCapacity ?? "Характеристики по запросу"}</em>
                </span>
                <span className="arrow-char" aria-hidden="true">↗</span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
