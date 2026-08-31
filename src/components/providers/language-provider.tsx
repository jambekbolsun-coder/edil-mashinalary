"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { copy, type CopyKey } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: CopyKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const supportedLocales: Locale[] = ["ky", "ru", "en", "tr", "zh"];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    const saved = window.localStorage.getItem("edil-locale") as Locale | null;
    if (saved && supportedLocales.includes(saved)) {
      const frame = window.requestAnimationFrame(() => {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem("edil-locale", nextLocale);
    document.documentElement.lang = nextLocale;
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: CopyKey) => copy[locale][key],
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
