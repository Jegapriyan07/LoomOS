"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/weaver/TopBar";
import { BottomNav } from "@/components/weaver/BottomNav";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { WeaverLoginScreen } from "@/components/auth/WeaverLoginScreen";
import { AppTour } from "@/components/onboarding/AppTour";
import { cachedJson } from "@/lib/client-cache";

type Me = {
  authenticated: boolean;
  user?: {
    role: string;
    name: string;
    weaverId: string | null;
    weaver?: { name: string } | null;
  };
};

/**
 * Gates weaver shell — show login immediately; auth check runs in background.
 * Never leave "Checking sign-in…" stuck on screen.
 */
export function WeaverAuthGate({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Me>({ authenticated: false });
  const [loadError, setLoadError] = useState<string | null>(null);
  // Never block the login UI on "Checking sign-in…"
  const [checking, setChecking] = useState(false);

  async function refresh() {
    setLoadError(null);
    setChecking(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6_000);
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.status === 401 || !res.ok) {
        setMe({ authenticated: false });
        return;
      }
      const data = (await res.json()) as Me;
      setMe({
        authenticated: data.authenticated !== false,
        user: data.user,
      });
    } catch (e) {
      setLoadError(
        e instanceof Error && e.name === "AbortError"
          ? "Sign-in check timed out. Tap a demo login or Continue."
          : "Could not reach the server. Refresh and try again.",
      );
      setMe({ authenticated: false });
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    void refresh();
    const failSafe = window.setTimeout(() => setChecking(false), 3_000);
    return () => window.clearTimeout(failSafe);
  }, []);

  useEffect(() => {
    if (!me.authenticated || me.user?.role !== "WEAVER") return;
    const t = window.setTimeout(() => {
      void Promise.allSettled([
        cachedJson("/api/auth/me"),
        cachedJson("/api/orders"),
        cachedJson("/api/recommendations/today"),
        cachedJson("/api/admin/requirements"),
      ]);
    }, 0);
    return () => window.clearTimeout(t);
  }, [me.authenticated, me.user?.role]);

  if (!me.authenticated || me.user?.role !== "WEAVER") {
    return (
      <WeaverLoginScreen
        checking={checking}
        loadError={loadError}
        onSuccess={() => void refresh()}
      />
    );
  }

  return (
    <>
      <DemoModeBanner />
      <TopBar />
      <main className="flex flex-1 flex-col pb-20">{children}</main>
      <BottomNav />
      <AppTour />
    </>
  );
}
