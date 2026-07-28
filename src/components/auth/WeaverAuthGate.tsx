"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/weaver/TopBar";
import { BottomNav } from "@/components/weaver/BottomNav";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { VoiceAccessibilityBar } from "@/components/weaver/VoiceAccessibilityBar";
import { WeaverLoginScreen } from "@/components/auth/WeaverLoginScreen";

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
 * Gates weaver shell — Nesavu-style login when signed out;
 * full chrome when signed in as WEAVER.
 */
export function WeaverAuthGate({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Me>({ authenticated: false });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  async function refresh() {
    setLoadError(null);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5_000);
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
          ? "Sign-in check timed out. Pull to refresh, or tap Send code."
          : "Could not reach the server. Refresh and try again.",
      );
      setMe({ authenticated: false });
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

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
      <VoiceAccessibilityBar />
      <BottomNav />
    </>
  );
}
