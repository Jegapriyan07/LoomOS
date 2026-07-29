"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WeaverLoginScreen } from "@/components/auth/WeaverLoginScreen";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { SimulatedBuyerDesk } from "@/components/buyer/SimulatedBuyerDesk";

export default function BuyerAuthPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [showDesk, setShowDesk] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          // Only auto-enter portal when already a buyer — never bounce weavers away
          if (data.user?.role === "BUYER") {
            router.replace("/buyer/portal");
            return;
          }
        }
      } finally {
        setChecking(false);
      }
    })();
  }, [router]);

  if (checking) {
    return (
      <div className="p-8 text-center text-sm text-slate-600">Checking…</div>
    );
  }

  return (
    <div className="min-h-full bg-[#ebe6e0]">
      <DemoModeBanner />
      <WeaverLoginScreen
        defaultRole="BUYER"
        onSuccess={({ role }) => {
          if (role === "BUYER") {
            router.push("/buyer/portal");
            return;
          }
          window.location.assign("/");
        }}
      />
      <div className="mx-auto max-w-lg px-4 pb-10">
        <button
          type="button"
          onClick={() => setShowDesk((v) => !v)}
          className="w-full text-center text-xs font-semibold text-[#1e3a5f] underline"
        >
          {showDesk ? "Hide sample buyer desk" : "Preview sample buyer desk"}
        </button>
        {showDesk ? (
          <div className="mt-4">
            <SimulatedBuyerDesk />
          </div>
        ) : null}
      </div>
    </div>
  );
}
