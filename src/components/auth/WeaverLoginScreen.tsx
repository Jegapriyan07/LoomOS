"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { DEMAND_CATEGORIES } from "@/lib/demand/types";
import {
  LANGUAGE_OPTIONS,
  type LanguageCode,
} from "@/lib/voice/languages";
import { useI18n } from "@/lib/i18n/context";
import {
  DEMO_OTP_CODE,
  DEMO_WEAVER_LOGINS,
} from "@/lib/demo/logins";

type AuthMode = "login" | "register";

type Props = {
  onSuccess?: () => void;
  loadError?: string | null;
  checking?: boolean;
};

const WEAVE_CATEGORY_OPTIONS = [
  ...DEMAND_CATEGORIES.map((c) => c.label),
  "cotton lungi",
];

/**
 * Nesavu-inspired weaver login — brand hero, account tabs, demo pitch cards.
 */
export function WeaverLoginScreen({
  onSuccess,
  loadError,
  checking,
}: Props) {
  const { t, lang, setLang } = useI18n();
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState(DEMO_WEAVER_LOGINS[0].phone);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("Tamil Nadu");
  const [primaryLanguage, setPrimaryLanguage] =
    useState<LanguageCode>(lang);
  const [categories, setCategories] = useState<string[]>([
    DEMAND_CATEGORIES[0]?.label ?? "Cotton saree",
  ]);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentLang =
    LANGUAGE_OPTIONS.find((o) => o.code === lang) ?? LANGUAGE_OPTIONS[0];
  const categorySet = useMemo(() => new Set(categories), [categories]);

  function pickDemo(demoPhone: string) {
    setMode("login");
    setPhone(demoPhone);
    setStep("phone");
    setCode("");
    setDevCode(null);
    setError(null);
  }

  function toggleCategory(label: string) {
    setCategories((prev) =>
      prev.includes(label)
        ? prev.filter((c) => c !== label)
        : [...prev, label],
    );
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "register") {
      if (!name.trim()) {
        setError("Enter your name to register.");
        return;
      }
      if (categories.length === 0) {
        setError(t("auth.categoriesHint"));
        return;
      }
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, role: "WEAVER" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not send OTP");
        return;
      }
      setDevCode(data.devCode ?? DEMO_OTP_CODE);
      setStep("code");
      if (data.devCode === DEMO_OTP_CODE || !data.devCode) {
        setCode(DEMO_OTP_CODE);
      }
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        phone,
        code: code || DEMO_OTP_CODE,
        role: "WEAVER",
        mode,
      };
      if (mode === "register") {
        body.name = name;
        body.region = region;
        body.primaryLanguage = primaryLanguage;
        body.categories = categories;
      }
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not verify");
        return;
      }
      if (mode === "register") setLang(primaryLanguage);
      onSuccess?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#ebe6e0]">
      {/* Brand hero — chocolate brown like the pitch mock */}
      <div className="relative bg-[#3c2415] px-5 pb-16 pt-5 text-white">
        <div className="mb-8 flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/75">
              Handloom livelihoods
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-loom-display)] text-4xl font-semibold tracking-tight">
              LoomOS
            </h1>
            <p className="mt-2 text-sm text-white/85">
              Demand · Plans · Steady income
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              className="flex h-10 items-center gap-1.5 rounded-lg border border-white/30 bg-white px-3 text-sm font-semibold text-[#3c2415] shadow-sm"
            >
              {currentLang.name}
              <ChevronDown className="size-4 opacity-70" aria-hidden />
            </button>
            {langOpen ? (
              <ul
                role="listbox"
                className="absolute right-0 z-50 mt-1 max-h-64 w-44 overflow-auto rounded-xl border border-[#d9d2c4] bg-white py-1 text-[#1a1f24] shadow-lg"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <li key={opt.code} role="option" aria-selected={opt.code === lang}>
                    <button
                      type="button"
                      className={`flex w-full px-3 py-2.5 text-left text-sm ${
                        opt.code === lang
                          ? "bg-[#3c2415]/10 font-semibold"
                          : "hover:bg-[#f3efe6]"
                      }`}
                      onClick={() => {
                        setLang(opt.code);
                        setLangOpen(false);
                      }}
                    >
                      <span className="mr-2">{opt.label}</span>
                      {opt.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        {checking ? (
          <p className="text-xs text-white/70">{t("auth.checkingSignIn")}</p>
        ) : null}
      </div>

      <div className="relative z-10 -mt-10 flex flex-1 flex-col gap-4 px-4 pb-10">
        {loadError ? (
          <p className="rounded-xl border border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            {loadError}
          </p>
        ) : null}

        {/* Login / Register card */}
        <div className="rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(60,36,21,0.18)]">
          <div
            className="grid grid-cols-2 gap-1 rounded-xl bg-[#f3efe6] p-1"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => {
                setMode("login");
                setStep("phone");
                setError(null);
              }}
              className={`rounded-lg px-2 py-3 text-center text-sm font-semibold leading-snug ${
                mode === "login"
                  ? "bg-[#3c2415] text-white shadow-sm"
                  : "text-[#3c2415]/80"
              }`}
            >
              I already have an account
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              onClick={() => {
                setMode("register");
                setStep("phone");
                setError(null);
              }}
              className={`rounded-lg px-2 py-3 text-center text-sm font-semibold leading-snug ${
                mode === "register"
                  ? "bg-[#3c2415] text-white shadow-sm"
                  : "text-[#3c2415]/80"
              }`}
            >
              New here? Register
            </button>
          </div>

          {step === "phone" ? (
            <form onSubmit={sendOtp} className="mt-5 space-y-3">
              {mode === "register" ? (
                <>
                  <label className="block text-sm font-medium text-[#1a1f24]">
                    {t("auth.yourName")}
                    <input
                      className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Meena"
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium text-[#1a1f24]">
                    {t("auth.region")}
                    <input
                      className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium text-[#1a1f24]">
                    {t("auth.language")}
                    <select
                      className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base"
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
                  <fieldset>
                    <legend className="text-sm font-medium text-[#1a1f24]">
                      {t("auth.categories")}
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {WEAVE_CATEGORY_OPTIONS.map((label) => {
                        const on = categorySet.has(label);
                        return (
                          <button
                            key={label}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggleCategory(label)}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                              on
                                ? "border-[#3c2415] bg-[#3c2415]/10 font-semibold text-[#3c2415]"
                                : "border-[#d9d2c4] text-[#5c6570]"
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

              <label className="block text-sm font-medium text-[#1a1f24]">
                Mobile number
                <input
                  inputMode="numeric"
                  autoComplete="tel"
                  className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base tracking-wide"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  required
                />
              </label>
              {error ? (
                <p className="text-sm text-red-700">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#3c2415] text-base font-semibold text-white disabled:opacity-60"
              >
                {busy ? t("auth.sending") : "Send code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="mt-5 space-y-3">
              <p className="text-sm text-[#5c6570]">
                {t("auth.codeSentTo")} <strong>{phone}</strong>
              </p>
              <p className="rounded-lg border border-dashed border-amber-500 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                Demo OTP:{" "}
                <strong className="tracking-widest">
                  {devCode ?? DEMO_OTP_CODE}
                </strong>
              </p>
              <label className="block text-sm font-medium text-[#1a1f24]">
                6-digit OTP
                <input
                  inputMode="numeric"
                  className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base tracking-widest"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </label>
              {error ? (
                <p className="text-sm text-red-700">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#3c2415] text-base font-semibold text-white disabled:opacity-60"
              >
                {busy ? t("auth.checking") : "Verify & continue"}
              </button>
              <button
                type="button"
                className="w-full text-sm text-[#5c6570] underline"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setDevCode(null);
                  setError(null);
                }}
              >
                {t("auth.changeNumber")}
              </button>
            </form>
          )}
        </div>

        {/* Demo logins pitch card */}
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(60,36,21,0.1)]">
          <h2 className="text-base font-semibold text-[#1a1f24]">
            Demo logins (pitch)
          </h2>
          <p className="mt-1 text-xs text-[#5c6570]">
            Four customers — each opens Home, Plan, Money & Orders with their
            own profile, orders and earnings. OTP always{" "}
            <strong>{DEMO_OTP_CODE}</strong>.
          </p>
          <ul className="mt-3 space-y-2">
            {DEMO_WEAVER_LOGINS.map((d) => (
              <li key={d.phone}>
                <button
                  type="button"
                  onClick={() => pickDemo(d.phone)}
                  className={`flex w-full items-start justify-between gap-2 rounded-xl border px-3 py-3 text-left transition ${
                    phone === d.phone
                      ? "border-[#3c2415] bg-[#3c2415]/8"
                      : "border-[#e8e2d8] hover:border-[#3c2415]/40"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#1a1f24]">
                      {d.givenName}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#5c6570]">
                      {d.blurb}
                    </span>
                  </span>
                  <code className="shrink-0 rounded bg-[#f3efe6] px-2 py-1 text-xs font-semibold text-[#3c2415]">
                    {d.phone}
                  </code>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-center text-xs text-[#5c6570]">
            OTP always: <strong>{DEMO_OTP_CODE}</strong>
          </p>
        </div>

        <p className="text-center text-sm text-[#5c6570]">
          <Link href="/buyer" className="font-semibold text-[#3c2415] underline">
            Buyer Portal
          </Link>
          {" · "}
          <Link href="/about" className="underline">
            About / pitch
          </Link>
        </p>
      </div>
    </div>
  );
}
