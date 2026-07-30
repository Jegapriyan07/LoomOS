"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DEMAND_CATEGORIES } from "@/lib/demand/types";
import {
  LANGUAGE_OPTIONS,
  type LanguageCode,
} from "@/lib/voice/languages";
import { useI18n } from "@/lib/i18n/context";
import { DEMO_WEAVER_LOGINS } from "@/lib/demo/logins";
import { DEMO_BUYERS } from "@/lib/demo/cluster";
import { markTourPending } from "@/components/onboarding/AppTour";
import { invalidateCached } from "@/lib/client-cache";
import {
  INDIA_STATES,
  coopForLocation,
  districtsForState,
} from "@/lib/auth/regions";
import { PHONE_COUNTRY_OPTIONS } from "@/lib/auth/phone";

type AuthMode = "login" | "register";
type Role = "WEAVER" | "BUYER";

type Props = {
  onSuccess?: (info: { role: Role }) => void;
  loadError?: string | null;
  checking?: boolean;
  /** Default tab: weaver (home) or buyer (/buyer) */
  defaultRole?: Role;
};

const WEAVE_CATEGORY_OPTIONS = [
  ...DEMAND_CATEGORIES.map((c) => c.label),
  "cotton lungi",
];

const BUYER_BUSINESS_TYPES = [
  "Festival retail boutique",
  "Seasonal wholesale desk",
  "Reseller / marketplace",
  "Export desk",
  "Other",
];

/**
 * Unified Weaver + Buyer login — phone only (no OTP).
 * Register is a compact link; form collects richer details with state dropdown
 * and auto-assigned cooperative / sector from location.
 */
export function WeaverLoginScreen({
  onSuccess,
  loadError,
  checking,
  defaultRole = "WEAVER",
}: Props) {
  const { t, lang, setLang } = useI18n();
  const [role, setRole] = useState<Role>(defaultRole);
  const [mode, setMode] = useState<AuthMode>("login");
  /** National number only — empty by default so users type 10 digits */
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("91");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("Delhi");
  const [district, setDistrict] = useState(
    () => districtsForState("Delhi")[0] ?? "IIT Delhi",
  );
  const [yearsWeaving, setYearsWeaving] = useState("");
  const [businessType, setBusinessType] = useState(BUYER_BUSINESS_TYPES[0]);
  const [email, setEmail] = useState("");
  const [primaryLanguage, setPrimaryLanguage] =
    useState<LanguageCode>(lang);
  const [categories, setCategories] = useState<string[]>([
    DEMAND_CATEGORIES[0]?.label ?? "Cotton saree",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [busyPhone, setBusyPhone] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const busy = busyPhone !== null;

  const currentLang =
    LANGUAGE_OPTIONS.find((o) => o.code === lang) ?? LANGUAGE_OPTIONS[0];
  const categorySet = useMemo(() => new Set(categories), [categories]);
  const coopPreview = useMemo(
    () => coopForLocation(region, district),
    [region, district],
  );
  const districtOptions = useMemo(
    () => districtsForState(region),
    [region],
  );
  const selectedCountry =
    PHONE_COUNTRY_OPTIONS.find((c) => c.dial === dialCode) ??
    PHONE_COUNTRY_OPTIONS[0];
  const nationalMaxLen = selectedCountry.nationalLength;

  function onStateChange(nextState: string) {
    setRegion(nextState);
    const nextDistricts = districtsForState(nextState);
    setDistrict(nextDistricts[0] ?? "");
  }

  function toggleCategory(label: string) {
    setCategories((prev) =>
      prev.includes(label)
        ? prev.filter((c) => c !== label)
        : [...prev, label],
    );
  }

  function switchRole(next: Role) {
    if (next === role) return;
    setRole(next);
    setMode("login");
    setError(null);
    setPhone("");
    setDialCode("91");
  }

  async function loginWithPhone(
    nextPhone: string,
    nextMode: AuthMode = "login",
    nextRole: Role = role,
    nextDial: string = dialCode,
  ) {
    if (busyPhone) return;
    setError(null);
    setBusyPhone(nextPhone);
    const controller = new AbortController();
    // Neon cold start can take a while — allow enough room, keep UI responsive
    const timer = setTimeout(() => controller.abort(), 25_000);
    try {
      const body: Record<string, unknown> = {
        phone: nextPhone,
        dialCode: nextRole === "WEAVER" ? "91" : nextDial,
        role: nextRole,
        mode: nextMode,
      };
      if (nextMode === "register") {
        body.name = name;
        body.region = region;
        if (nextRole === "WEAVER") {
          body.primaryLanguage = primaryLanguage;
          body.categories = categories;
          body.district = district;
          body.yearsWeaving = yearsWeaving;
        } else {
          body.businessType = businessType;
          body.email = email;
          body.district = district;
        }
      }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string" ? data.error : "Could not sign in",
        );
        return;
      }
      if (data.tour) markTourPending();
      if (nextMode === "register" && nextRole === "WEAVER") {
        setLang(primaryLanguage);
      }
      invalidateCached();
      const signedRole = (data.user?.role as Role | undefined) ?? nextRole;
      setBusyPhone(null);
      onSuccess?.({ role: signedRole });
    } catch (e) {
      setError(
        e instanceof Error && e.name === "AbortError"
          ? "Sign-in timed out (database waking up). Wait a moment and tap again."
          : "Could not reach the server. Try again.",
      );
    } finally {
      clearTimeout(timer);
      setBusyPhone(null);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "register") {
      if (!name.trim()) {
        setError(
          role === "BUYER"
            ? "Enter your business name to register."
            : "Enter your name to register.",
        );
        return;
      }
      if (!region.trim()) {
        setError("Select your state.");
        return;
      }
      if (!district.trim()) {
        setError("Select your district / weaving town.");
        return;
      }
      if (role === "WEAVER" && categories.length === 0) {
        setError(t("auth.categoriesHint"));
        return;
      }
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== nationalMaxLen) {
      setError(`Enter ${nationalMaxLen}-digit mobile number`);
      return;
    }
    await loginWithPhone(digits, mode, role, dialCode);
  }

  async function enterAsDemo(demoPhone: string, demoRole: Role) {
    setRole(demoRole);
    setMode("login");
    setDialCode("91");
    setPhone(demoPhone);
    setError(null);
    await loginWithPhone(demoPhone, "login", demoRole, "91");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#ebe6e0]">
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
              Demand · Orders · Plan · Income
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
                  <li
                    key={opt.code}
                    role="option"
                    aria-selected={opt.code === lang}
                  >
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
        ) : (
          <p className="text-xs text-white/70">
            Choose Weaver or Buyer, then Continue — or tap a sample account below.
          </p>
        )}
      </div>

      <div className="relative z-10 -mt-10 flex flex-1 flex-col gap-4 px-4 pb-10">
        {loadError ? (
          <p className="rounded-xl border border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            {loadError}
          </p>
        ) : null}

        <div className="rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(60,36,21,0.18)]">
          <div
            className="grid grid-cols-2 gap-1 rounded-xl bg-[#f3efe6] p-1"
            role="tablist"
            aria-label="Account type"
          >
            <button
              type="button"
              role="tab"
              aria-selected={role === "WEAVER"}
              onClick={() => switchRole("WEAVER")}
              className={`rounded-lg px-2 py-3 text-center text-sm font-semibold leading-snug ${
                role === "WEAVER"
                  ? "bg-[#3c2415] text-white shadow-sm"
                  : "text-[#3c2415]/80"
              }`}
            >
              Weaver login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === "BUYER"}
              onClick={() => switchRole("BUYER")}
              className={`rounded-lg px-2 py-3 text-center text-sm font-semibold leading-snug ${
                role === "BUYER"
                  ? "bg-[#3c2415] text-white shadow-sm"
                  : "text-[#3c2415]/80"
              }`}
            >
              Buyer login
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            {mode === "register" ? (
              <>
                <label className="block text-sm font-medium text-[#1a1f24]">
                  {role === "BUYER" ? "Business name" : t("auth.yourName")}
                  <input
                    className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      role === "BUYER" ? "Your shop / brand" : "e.g. Kavita"
                    }
                    required
                  />
                </label>

                {role === "BUYER" ? (
                  <>
                    <label className="block text-sm font-medium text-[#1a1f24]">
                      Business type
                      <select
                        className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                      >
                        {BUYER_BUSINESS_TYPES.map((bt) => (
                          <option key={bt} value={bt}>
                            {bt}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-sm font-medium text-[#1a1f24]">
                      Email (optional)
                      <input
                        type="email"
                        className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="orders@yourshop.com"
                      />
                    </label>
                  </>
                ) : null}

                <label className="block text-sm font-medium text-[#1a1f24]">
                  State / UT
                  <select
                    className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base"
                    value={region}
                    onChange={(e) => onStateChange(e.target.value)}
                    required
                  >
                    {INDIA_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-[#1a1f24]">
                  District / weaving town
                  <select
                    className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                  >
                    {districtOptions.length === 0 ? (
                      <option value="">No districts listed</option>
                    ) : (
                      districtOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))
                    )}
                  </select>
                </label>

                {role === "WEAVER" ? (
                  <div className="rounded-xl border border-[#e8e2d8] bg-[#f3efe6]/70 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#5c6570]">
                      Auto-assigned from {district || region}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1a1f24]">
                      {coopPreview.shortName}
                    </p>
                    <p className="mt-0.5 text-xs text-[#5c6570]">
                      Sector: {coopPreview.sector}
                    </p>
                    <p className="mt-1 text-[0.65rem] leading-snug text-[#8a8070]">
                      {coopPreview.disclaimer}
                    </p>
                  </div>
                ) : (
                  <p className="rounded-lg bg-[#f3efe6] px-3 py-2 text-xs text-[#5c6570]">
                    Buying needs you post will match weavers in {region}
                    {district ? ` · ${district}` : ""}.
                  </p>
                )}

                {role === "WEAVER" ? (
                  <>
                    <label className="block text-sm font-medium text-[#1a1f24]">
                      Years weaving (optional)
                      <input
                        inputMode="numeric"
                        className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base"
                        value={yearsWeaving}
                        onChange={(e) => setYearsWeaving(e.target.value)}
                        placeholder="e.g. 8"
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
              </>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-[#1a1f24]">
                Mobile number
              </label>
              <div className="mt-1.5 flex gap-2">
                {role === "BUYER" ? (
                  <select
                    aria-label="Country code"
                    className="w-[7.5rem] shrink-0 rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-2 py-3 text-sm font-semibold text-[#3c2415]"
                    value={dialCode}
                    onChange={(e) => {
                      setDialCode(e.target.value);
                      setPhone("");
                    }}
                  >
                    {PHONE_COUNTRY_OPTIONS.map((c) => (
                      <option key={c.dial} value={c.dial}>
                        +{c.dial} {c.flag}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className="flex w-[4.75rem] shrink-0 items-center justify-center rounded-xl border border-[#d9d2c4] bg-[#f3efe6] px-2 py-3 text-sm font-semibold text-[#3c2415]"
                    aria-label="India country code"
                  >
                    +91
                  </div>
                )}
                <input
                  inputMode="numeric"
                  autoComplete="tel-national"
                  className="min-w-0 flex-1 rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3 py-3 text-base tracking-wide"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setPhone(digits.slice(0, nationalMaxLen));
                  }}
                  placeholder={`Enter ${nationalMaxLen}-digit number`}
                  maxLength={nationalMaxLen}
                  required
                />
              </div>
            </div>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#3c2415] text-base font-semibold text-white disabled:opacity-60"
            >
              {busy && busyPhone === phone
                ? "Signing in…"
                : mode === "login"
                  ? "Continue"
                  : "Create account"}
            </button>

            {mode === "login" ? (
              <p className="pt-1 text-center text-xs text-[#5c6570]">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="font-semibold text-[#3c2415] underline underline-offset-2"
                >
                  Register
                </button>
              </p>
            ) : (
              <p className="pt-1 text-center text-xs text-[#5c6570]">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-semibold text-[#3c2415] underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            )}
          </form>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(60,36,21,0.1)]">
          <h2 className="text-base font-semibold text-[#1a1f24]">
            {role === "BUYER" ? "Sample buyers" : "Sample weavers"}
          </h2>
          <p className="mt-1 text-xs text-[#5c6570]">
            {role === "BUYER"
              ? "Tap a desk to post buying needs for weavers."
              : "Tap a name to sign in with sample orders and production. Use Register for a new empty account."}
          </p>
          <ul className="mt-3 space-y-2">
            {role === "WEAVER"
              ? DEMO_WEAVER_LOGINS.slice(0, 2).map((d) => (
                  <li key={d.phone}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void enterAsDemo(d.phone, "WEAVER")}
                      className={`flex w-full items-start justify-between gap-2 rounded-xl border px-3 py-3 text-left transition disabled:opacity-60 ${
                        busyPhone === d.phone
                          ? "border-[#3c2415] bg-[#3c2415]/15"
                          : phone === d.phone
                            ? "border-[#3c2415] bg-[#3c2415]/8"
                            : "border-[#e8e2d8] hover:border-[#3c2415]/40"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold text-[#1a1f24]">
                          {busyPhone === d.phone
                            ? `Signing in as ${d.givenName}…`
                            : `Enter as ${d.givenName}`}
                        </span>
                        <span className="mt-0.5 block text-xs text-[#5c6570]">
                          {d.blurb}
                        </span>
                      </span>
                      <code className="shrink-0 rounded bg-[#f3efe6] px-2 py-1 text-xs font-semibold text-[#3c2415]">
                        +91 {d.phone}
                      </code>
                    </button>
                  </li>
                ))
              : DEMO_BUYERS.slice(0, 2).map((d) => (
                  <li key={d.phone}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void enterAsDemo(d.phone, "BUYER")}
                      className={`flex w-full items-start justify-between gap-2 rounded-xl border px-3 py-3 text-left transition disabled:opacity-60 ${
                        busyPhone === d.phone
                          ? "border-[#3c2415] bg-[#3c2415]/15"
                          : phone === d.phone
                            ? "border-[#3c2415] bg-[#3c2415]/8"
                            : "border-[#e8e2d8] hover:border-[#3c2415]/40"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold text-[#1a1f24]">
                          {busyPhone === d.phone
                            ? `Signing in as ${d.shortName}…`
                            : `Enter as ${d.shortName}`}
                        </span>
                        <span className="mt-0.5 block text-xs text-[#5c6570]">
                          {d.businessType} · {d.focus}
                        </span>
                      </span>
                      <code className="shrink-0 rounded bg-[#f3efe6] px-2 py-1 text-xs font-semibold text-[#3c2415]">
                        +91 {d.phone}
                      </code>
                    </button>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
