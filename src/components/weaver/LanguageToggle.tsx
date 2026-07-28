"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import {
  BHASHINI_STATUS_NOTE,
  CENSUS_LANGUAGE_NOTE,
  LANGUAGE_CHANGE_EVENT,
  LANGUAGE_OPTIONS,
  readStoredLanguage,
  writeStoredLanguage,
  type LanguageCode,
} from "@/lib/voice/languages";
import { useI18n } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { lang: ctxLang, setLang: setCtxLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<LanguageCode>(ctxLang);

  useEffect(() => {
    setLang(ctxLang);
  }, [ctxLang]);

  useEffect(() => {
    setLang(readStoredLanguage());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ code: LanguageCode }>).detail;
      if (detail?.code) setLang(detail.code);
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, onChange);
  }, []);

  function select(code: LanguageCode) {
    setLang(code);
    setCtxLang(code);
    writeStoredLanguage(code);
    setOpen(false);
  }

  const current =
    LANGUAGE_OPTIONS.find((o) => o.code === lang) ?? LANGUAGE_OPTIONS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.name}. Change language.`}
        className="flex h-12 min-w-12 items-center justify-center gap-2 rounded-xl border border-loom-border bg-loom-surface px-3 text-loom-ink shadow-[var(--loom-shadow)]"
      >
        <Languages className="size-6 shrink-0" aria-hidden />
        <span className="text-base font-semibold">{current.label}</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,20rem)] overflow-hidden rounded-xl border border-loom-border bg-loom-surface shadow-lg">
          <ul role="listbox" aria-label="Choose language">
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = option.code === lang;
              return (
                <li key={option.code} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => select(option.code)}
                    className={`flex h-12 w-full items-center gap-3 px-4 text-left text-base ${
                      selected
                        ? "bg-loom-primary-soft font-semibold text-loom-primary"
                        : "text-loom-ink hover:bg-loom-bg"
                    }`}
                  >
                    <span className="min-w-[4.5rem]">{option.label}</span>
                    <span className="text-loom-muted">{option.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="space-y-2 border-t border-loom-border bg-loom-bg/80 px-3 py-3 text-sm leading-snug text-loom-muted">
            <p>
              <span className="font-semibold text-loom-ink">Languages: </span>
              {CENSUS_LANGUAGE_NOTE}
            </p>
            <p className="text-xs">{t("home.voiceNote")}</p>
            <p className="text-xs">{BHASHINI_STATUS_NOTE}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { LANGUAGE_OPTIONS, type LanguageCode } from "@/lib/voice/languages";
