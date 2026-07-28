"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PhoneOtpLogin } from "@/components/auth/PhoneOtpLogin";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { SimulatedBuyerDesk } from "@/components/buyer/SimulatedBuyerDesk";
import { DEMO_BUYERS } from "@/lib/demo/cluster";

export default function BuyerAuthPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
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
    <div className="min-h-full bg-[#f3efe6]">
      <DemoModeBanner />
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <p className="font-[family-name:var(--font-loom-display)] text-3xl font-semibold text-[#1e3a5f]">
          Buyer Portal
        </p>
        <p className="mt-2 max-w-2xl text-base text-slate-600">
          Post simulated buying needs that weavers see on Home, Plan, and
          Orders — same store, not a disconnected form.
        </p>
        <div className="mt-5">
          <SimulatedBuyerDesk />
        </div>
      </div>
      <PhoneOtpLogin
        role="BUYER"
        title="Buyer login / register"
        defaultPhone={DEMO_BUYERS[0].phone}
        allowSignupName
        modeTabs
        onSuccess={() => router.push("/buyer/portal")}
      />
      <p className="mx-auto max-w-md px-4 pb-10 text-sm text-slate-500">
        <Link href="/" className="font-semibold text-[#1e3a5f] underline">
          ← Weaver app
        </Link>
        {" · "}
        <Link href="/about" className="underline">
          Pitch / about
        </Link>
      </p>
    </div>
  );
}
