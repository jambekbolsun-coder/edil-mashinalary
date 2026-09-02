"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { siteTranslations } from "@/lib/site-translations";
import type { Locale } from "@/lib/types";

const originalText = new WeakMap<Text, string>();
const appliedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const appliedAttributes = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ["aria-label", "placeholder", "title"] as const;

const phraseEntries = Object.entries(siteTranslations)
  .filter(([source]) => source.length >= 4 && /[\u0400-\u04ff]/.test(source))
  .sort(([a], [b]) => b.length - a.length);

const countCopy: Record<Locale, { results: string; models: string; step: string; banner: string; photo: string }> = {
  ru: { results: "Результатов", models: "моделей по выбранным условиям", step: "Шаг", banner: "Показать баннер", photo: "Показать фото" },
  ky: { results: "Натыйжа", models: "тандалган шарттар боюнча модель", step: "Кадам", banner: "Баннерди көрсөтүү", photo: "Сүрөттү көрсөтүү" },
  en: { results: "Results", models: "models matching your filters", step: "Step", banner: "Show banner", photo: "Show photo" },
  tr: { results: "Sonuç", models: "seçilen koşullara uygun model", step: "Adım", banner: "Bannerı göster", photo: "Fotoğrafı göster" },
  zh: { results: "结果", models: "款符合筛选条件的型号", step: "步骤", banner: "显示横幅", photo: "显示照片" },
};

function translateDynamic(value: string, locale: Locale) {
  const counts = countCopy[locale];
  const resultMatch = value.match(/^Результатов:\s*(\d+)$/);
  if (resultMatch) return `${counts.results}: ${resultMatch[1]}`;
  const modelsMatch = value.match(/^(\d+)\s+моделей по выбранным условиям$/);
  if (modelsMatch) return locale === "zh" ? `${modelsMatch[1]} ${counts.models}` : `${modelsMatch[1]} ${counts.models}`;
  const stepMatch = value.match(/^Шаг\s+(\d+)\s+из\s+(\d+)$/);
  if (stepMatch) return locale === "zh" ? `${counts.step} ${stepMatch[1]}/${stepMatch[2]}` : `${counts.step} ${stepMatch[1]} / ${stepMatch[2]}`;
  const bannerMatch = value.match(/^Показать баннер\s+(\d+)$/);
  if (bannerMatch) return `${counts.banner} ${bannerMatch[1]}`;
  const photoMatch = value.match(/^Показать фото\s+(\d+)$/);
  if (photoMatch) return `${counts.photo} ${photoMatch[1]}`;
  return null;
}

function translateValue(value: string, locale: Locale) {
  if (locale === "ru" || !value.trim()) return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.trim();
  const exact = siteTranslations[core]?.[locale];
  if (exact) return `${leading}${exact}${trailing}`;
  const dynamic = translateDynamic(core, locale);
  if (dynamic) return `${leading}${dynamic}${trailing}`;

  let translated = core;
  for (const [source, translations] of phraseEntries) {
    if (translated.includes(source)) translated = translated.replaceAll(source, translations[locale]);
  }
  return `${leading}${translated}${trailing}`;
}

function isRussianSource(value: string) {
  const core = value.trim();
  return Boolean(siteTranslations[core]) || translateDynamic(core, "en") !== null;
}

function translateElement(root: ParentNode, locale: Locale) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const node = current as Text;
    const parent = node.parentElement;
    if (parent && !parent.closest("script, style, [data-no-translate]")) {
      const currentValue = node.nodeValue ?? "";
      const lastApplied = appliedText.get(node);
      if (!originalText.has(node)) {
        originalText.set(node, currentValue);
      } else if (lastApplied !== undefined && currentValue !== lastApplied) {
        if (isRussianSource(currentValue)) originalText.set(node, currentValue);
        else {
          appliedText.set(node, currentValue);
          current = walker.nextNode();
          continue;
        }
      }
      const source = originalText.get(node) ?? "";
      const next = translateValue(source, locale);
      if (node.nodeValue !== next) node.nodeValue = next;
      appliedText.set(node, next);
    }
    current = walker.nextNode();
  }

  const elements = root instanceof Element ? [root, ...root.querySelectorAll("*")] : [...root.querySelectorAll("*")];
  for (const element of elements) {
    if (element.closest("[data-no-translate]")) continue;
    let saved = originalAttributes.get(element);
    let applied = appliedAttributes.get(element);
    if (!saved) {
      saved = new Map();
      originalAttributes.set(element, saved);
    }
    if (!applied) {
      applied = new Map();
      appliedAttributes.set(element, applied);
    }
    for (const attribute of translatedAttributes) {
      const currentValue = element.getAttribute(attribute);
      if (currentValue === null) continue;
      if (!saved.has(attribute)) saved.set(attribute, currentValue);
      else if (applied.has(attribute) && currentValue !== applied.get(attribute)) {
        if (isRussianSource(currentValue)) saved.set(attribute, currentValue);
        else {
          applied.set(attribute, currentValue);
          continue;
        }
      }
      const source = saved.get(attribute) ?? currentValue;
      const next = translateValue(source, locale);
      if (currentValue !== next) element.setAttribute(attribute, next);
      applied.set(attribute, next);
    }
  }
}

export function SiteTranslator() {
  const { locale } = useLanguage();

  useEffect(() => {
    const root = document.querySelector("body");
    if (!root) return;
    let frame = 0;
    let translating = false;

    const apply = () => {
      translating = true;
      translateElement(root, locale);
      translating = false;
    };

    const observer = new MutationObserver(() => {
      if (translating || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    });

    apply();
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...translatedAttributes] });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [locale]);

  return null;
}
