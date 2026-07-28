"use client";

import { useMemo, useState } from "react";
import { DEMAND_CATEGORIES } from "@/lib/demand/types";
import { LANGUAGE_OPTIONS, type LanguageCode } from "@/lib/voice/languages";
import { useI18n } from "@/lib/i18n/context";
import { invalidateCached } from "@/lib/client-cache";

type Role = "WEAVER" | "BUYER";
type AuthMode = "login" | "register";

type Props = {
  role: Role;
  title?: string;
  /** Prefill phone for demo */
  defaultPhone?: string;
  allowSignupName?: boolean;
  modeTabs?: boolean;
  onSuccess?: () => void;
};

const WEAVE_CATEGORY_OPTIONS = [
  ...DEMAND_CATEGORIES.map((c) => c.label),
  "cotton lungi",
];

/**
 * Shared phone login (no OTP) with Login / Register modes.
 */
export function PhoneOtpLogin({
  role,
  title,
  defaultPhone = "",
  allowSignupName = false,
  modeTabs,
  onSuccess,
}: Props) {
  const { t, lang, setLang } = useI18n();
  const showTabs = modeTabs ?? role === "WEAVER";
  const [mode, setMode] = useState<AuthMode>("login");
  const [phone, setPhone] = useState(defaultPhone);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("Tamil Nadu");
  const [primaryLanguage, setPrimaryLanguage] = useState<LanguageCode>(lang);
  const [categories, setCategories] = useState<string[]>([
    DEMAND_CATEGORIES[0]?.label ?? "Cotton saree",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const heading = title ?? t("auth.weaverTitle");
  const collectProfile =
    mode === "register" &&
    (role === "WEAVER" || allowSignupName || role === "BUYER");

  const categorySet = useMemo(() => new Set(categories), [categories]);

  function toggleCategory(label: string) {
    setCategories((prev) =>
      prev.includes(label)
        ? prev.filter((c) => c !== label)
        : [...prev, label],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "register" && role === "WEAVER") {
      if (!name.trim()) {
        setError("Enter your name to register.");
        return;
      }
      if (categories.length === 0) {
        setError(t("auth.categoriesHint"));
        return;
      }
    }
    if (mode === "register" && role === "BUYER" && !name.trim()) {
      setError("Business name required for registration.");
      return;
    }

    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        phone,
        role,
        mode,
      };
      if (collectProfile) {
        body.name = name;
        body.region = region;
        if (role === "WEAVER") {
          body.primaryLanguage = primaryLanguage;
          body.categories = categories;
        }
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not sign in");
        return;
      }
      if (role === "WEAVER" && mode === "register") {
        setLang(primaryLanguage);
      }
      invalidateCached();
      onSuccess?.();
    } finally {
      setBusy(false);
    }
  }

  function switchMode(next: AuthMode) {
    setMode(next);
    setError(null);
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold text-loom-ink">{heading}</h1>
      <p className="mt-2 text-sm text-loom-muted">
        {mode === "login" ? t("auth.loginSubtitle") : t("auth.registerSubtitle")}
      </p>
      <p className="mt-2 rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
        Pitch demo — enter mobile and continue. No OTP / SMS.
      </p>

      {showTabs ? (
        <div
          className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-loom-border bg-loom-surface p-1"
          role="tablist"
          aria-label="Login or Register"
        >
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`flex h-11 items-center justify-center rounded-lg text-sm font-semibold ${
                mode === m
                  ? "bg-loom-primary text-white"
                  : "text-loom-muted hover:text-loom-ink"
              }`}
            >
              {m === "login" ? t("auth.login") : t("auth.register")}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        {collectProfile ? (
          <>
            <label className="block text-sm text-loom-ink">
              {role === "BUYER" ? "Business name" : t("auth.yourName")}
              <input
                className="mt-1 w-full rounded-xl border border-loom-border bg-loom-surface px-3 py-2.5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === "BUYER" ? "Your shop / brand" : "e.g. Meena"
                }
                required={mode === "register"}
              />
            </label>
            <label className="block text-sm text-loom-ink">
              {t("auth.region")}
              <input
                className="mt-1 w-full rounded-xl border border-loom-border bg-loom-surface px-3 py-2.5"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required={mode === "register"}
              />
            </label>
            {role === "WEAVER" ? (
              <>
                <label className="block text-sm text-loom-ink">
                  {t("auth.language")}
                  <select
                    className="mt-1 w-full rounded-xl border border-loom-border bg-loom-surface px-3 py-2.5"
                    value={primaryLanguage}
                    onChange={(e) =>
                      setPrimaryLanguage(e.target.value as LanguageCode)
                    }
                  >
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label} — {opt.name}
                      </option>
                    ))}
                  </select>
                </label>
                <fieldset className="space-y-2">
                  <legend className="text-sm text-loom-ink">
                    {t("auth.categories")}
                  </legend>
                  <p className="text-xs text-loom-muted">
                    {t("auth.categoriesHint")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {WEAVE_CATEGORY_OPTIONS.map((label) => {
                      const on = categorySet.has(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleCategory(label)}
                          aria-pressed={on}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                            on
                              ? "border-loom-primary bg-loom-primary-soft text-loom-primary"
                              : "border-loom-border bg-loom-surface text-loom-ink"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </>
            ) : null}
          </>
        ) : null}
        <label className="block text-sm text-loom-ink">
          {t("auth.phone")}
          <input
            inputMode="numeric"
            autoComplete="tel"
            className="mt-1 w-full rounded-xl border border-loom-border bg-loom-surface px-3 py-2.5"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile"
            required
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-loom-primary text-base font-semibold text-white disabled:opacity-60"
        >
          {busy
            ? t("auth.checking")
            : mode === "login"
              ? "Continue"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
