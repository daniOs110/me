import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import en from "./en.json";
import es from "./es.json";

export type Lang = "es" | "en";
export type Dictionary = typeof es;

const dictionaries: Record<Lang, Dictionary> = {
  es,
  en: en as Dictionary,
};

type I18nValue = {
  lang: Lang;
  dict: Dictionary;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

function lookup(dict: Dictionary, key: string): string {
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
  return typeof value === "string" ? value : key;
}

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const dict = dictionaries[lang];
  const value = useMemo<I18nValue>(
    () => ({
      lang,
      dict,
      t: (key: string) => lookup(dict, key),
    }),
    [dict, lang],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", dict.meta.description);
  }, [dict.meta.description, lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used under I18nProvider");
  return value;
}

export function isLang(value: string | undefined): value is Lang {
  return value === "es" || value === "en";
}
