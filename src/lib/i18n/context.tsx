"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LANGUAGE_CHANGE_EVENT,
  readStoredLanguage,
  writeStoredLanguage,
  type LanguageCode,
} from "@/lib/voice/languages";
import { translate, type MessageKey } from "@/lib/i18n/messages";

type I18nContextValue = {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("hi");

  useEffect(() => {
    setLangState(readStoredLanguage());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ code: LanguageCode }>).detail;
      if (detail?.code) setLangState(detail.code);
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, onChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      lang === "en" ? "en" : `${lang}-IN`;
  }, [lang]);

  const setLang = useCallback((code: LanguageCode) => {
    writeStoredLanguage(code);
    setLangState(code);
  }, []);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(lang, key, vars),
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      lang: "en",
      setLang: () => {},
      t: (key, vars) => translate("en", key, vars),
    };
  }
  return ctx;
}
