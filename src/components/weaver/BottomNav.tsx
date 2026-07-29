"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  CalendarClock,
  Wallet,
  ClipboardList,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { MessageKey } from "@/lib/i18n/messages";

type Tab = {
  href: string;
  labelKey: MessageKey;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
};

const TABS: Tab[] = [
  { href: "/", labelKey: "nav.home", icon: Home, match: (p) => p === "/" },
  {
    href: "/orders",
    labelKey: "nav.orders",
    icon: ClipboardList,
    match: (p) => p.startsWith("/orders"),
  },
  {
    href: "/plan",
    labelKey: "nav.plan",
    icon: CalendarClock,
    match: (p) => p.startsWith("/plan"),
  },
  {
    href: "/money",
    labelKey: "nav.money",
    icon: Wallet,
    match: (p) => p.startsWith("/money"),
  },
  {
    href: "/profile",
    labelKey: "nav.profile",
    icon: UserRound,
    match: (p) => p.startsWith("/profile"),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  // Prefetch all tabs once after login so Next doesn't "compile" on first tap
  useEffect(() => {
    for (const tab of TABS) {
      router.prefetch(tab.href);
    }
  }, [router]);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-loom-border bg-loom-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex">
              <Link
                href={tab.href}
                prefetch
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 min-w-12 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 ${
                  active ? "text-loom-primary" : "text-loom-tab-inactive"
                }`}
              >
                <Icon
                  className="size-5"
                  strokeWidth={active ? 2.5 : 2}
                  aria-hidden
                />
                <span
                  className={`text-[0.65rem] leading-none ${
                    active ? "font-semibold" : "font-medium"
                  }`}
                >
                  {t(tab.labelKey)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
