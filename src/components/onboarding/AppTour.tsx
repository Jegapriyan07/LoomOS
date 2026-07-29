"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const TOUR_FLAG = "loomos-tour-pending";
const TOUR_DONE = "loomos-tour-done";

export function markTourPending() {
  try {
    window.localStorage.setItem(TOUR_FLAG, "1");
    window.localStorage.removeItem(TOUR_DONE);
  } catch {
    /* ignore */
  }
}

export function clearTourPending() {
  try {
    window.localStorage.removeItem(TOUR_FLAG);
    window.localStorage.setItem(TOUR_DONE, "1");
  } catch {
    /* ignore */
  }
}

export function shouldShowTour(): boolean {
  try {
    return window.localStorage.getItem(TOUR_FLAG) === "1";
  } catch {
    return false;
  }
}

const STEPS = [
  {
    href: "/",
    title: "Home — today’s advice",
    body: "Pitch beat 1: LoomOS answers what to weave from simulated demand. Demo accounts already have a full story.",
  },
  {
    href: "/orders",
    title: "Orders — buyer demand",
    body: "Pitch beat 2: open buyer requirements in your region. Same posts the Buyer Portal publishes — this is the work coming in.",
  },
  {
    href: "/plan",
    title: "Plan — when to start",
    body: "Pitch beat 3: pick a ready date. LoomOS works backward — yarn → start → finish → projected money.",
  },
  {
    href: "/money",
    title: "Money — simulated escrow",
    body: "Pitch beat 4: advance held, production, projected settlement, and a shareable proof record. Demo / Simulated only.",
  },
  {
    href: "/profile",
    title: "Profile",
    body: "Your name, region, language, and weaving categories. You’re set — return to Home for the next pitch pass.",
  },
] as const;

/**
 * First-run tour for newly registered weavers (empty data path).
 */
export function AppTour() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (shouldShowTour()) setOpen(true);
  }, []);

  if (!open) return null;

  const current = STEPS[step]!;
  const last = step >= STEPS.length - 1;

  function finish() {
    clearTourPending();
    setOpen(false);
    router.push("/");
  }

  function next() {
    if (last) {
      finish();
      return;
    }
    const n = step + 1;
    setStep(n);
    router.push(STEPS[n]!.href);
  }

  function skip() {
    finish();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#3c2415]/70">
              Welcome tour · {step + 1}/{STEPS.length}
            </p>
            <h2
              id="tour-title"
              className="mt-1 font-[family-name:var(--font-loom-display)] text-xl font-semibold text-[#1a1f24]"
            >
              {current.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={skip}
            className="rounded-lg p-2 text-[#5c6570] hover:bg-[#f3efe6]"
            aria-label="Close tour"
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#5c6570]">
          {current.body}
        </p>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-950">
          Your register account starts with <strong>no orders or money yet</strong> —
          that is intentional. Demo logins (Meena / Selvi / …) show a full simulated story.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={skip}
            className="h-11 flex-1 rounded-xl border border-[#d9d2c4] text-sm font-semibold text-[#3c2415]"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={next}
            className="h-11 flex-1 rounded-xl bg-[#3c2415] text-sm font-semibold text-white"
          >
            {last ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
