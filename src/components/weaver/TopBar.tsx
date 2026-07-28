"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Store } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/lib/i18n/context";
import { cachedJson, invalidateCached } from "@/lib/client-cache";

export function TopBar() {
  const { t } = useI18n();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await cachedJson<{ user?: { name?: string } }>(
          "/api/auth/me",
        );
        setName(data.user?.name ?? null);
      } catch {
        /* signed-out / transient */
      }
    })();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    invalidateCached();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-loom-border bg-loom-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/"
            className="flex h-12 items-center rounded-xl px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-loom-primary"
          >
            <span className="font-[family-name:var(--font-loom-display)] text-2xl font-semibold tracking-tight text-loom-primary">
              LoomOS
            </span>
          </Link>
          {name ? (
            <Link
              href="/profile"
              className="hidden max-w-[6rem] truncate text-xs font-semibold text-loom-muted underline sm:inline"
            >
              {name.split("(")[0]?.trim() ?? name}
            </Link>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href="/buyer"
            className="flex h-10 items-center gap-1 rounded-lg border border-loom-border bg-loom-bg px-2 text-xs font-semibold text-loom-primary"
            aria-label={t("pitch.openBuyerPortal")}
          >
            <Store className="size-4" aria-hidden />
            {t("topbar.buyer")}
          </Link>
          <LanguageToggle />
          <button
            type="button"
            onClick={() => void logout()}
            className="h-10 rounded-lg px-2 text-xs font-semibold text-loom-muted underline"
          >
            {t("topbar.signOut")}
          </button>
        </div>
      </div>
    </header>
  );
}
