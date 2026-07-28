"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, ExternalLink, FileText, Printer } from "lucide-react";
import type { VerifiedTransactionRecord } from "@/lib/verified-record/build";
import { useI18n } from "@/lib/i18n/context";

function rupees(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function VerifiedRecordCard() {
  const { t } = useI18n();
  const [record, setRecord] = useState<VerifiedTransactionRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch(`/api/verified-record`, { cache: "no-store" });
    if (!res.ok) {
      setError(t("record.loading"));
      return;
    }
    setRecord((await res.json()) as VerifiedTransactionRecord);
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!record) {
    return (
      <p className="text-base text-loom-muted">
        {error ?? t("record.loading")}
      </p>
    );
  }

  const sharePath = `/record/${record.shareId}`;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${sharePath}`
      : sharePath;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const m = record.metrics;

  return (
    <section
      aria-labelledby="vtr-heading"
      className="rounded-2xl border border-loom-border bg-loom-surface p-4"
    >
      <div className="mb-1 flex items-center gap-2 text-loom-primary">
        <FileText className="size-6" aria-hidden />
        <h2 id="vtr-heading" className="text-base font-semibold text-loom-ink">
          {t("record.title")}
        </h2>
      </div>

      <aside
        role="note"
        className="mt-3 rounded-xl border border-loom-accent bg-loom-accent-soft/70 px-3 py-3 text-sm leading-snug text-loom-ink"
      >
        <p className="mt-1 text-loom-muted">{record.framing}</p>
      </aside>

      <p className="mt-3 text-sm text-loom-muted">{record.phase2Note}</p>
      <p className="mt-1 text-sm text-loom-muted">{record.dataNote}</p>

      <ul className="mt-4 space-y-2 text-base text-loom-ink">
        <li>
          <span className="font-semibold">{m.totalVerifiedCompletedOrders}</span>
        </li>
        <li>
          <span className="font-semibold">
            {rupees(m.verifiedIncomeTrailing12Months)}
          </span>
          <span className="mt-0.5 block text-sm text-loom-muted">
            {m.incomeHistoryNote}
          </span>
        </li>
        <li>
          <span className="font-semibold">{m.onTimeSettlementRate}%</span>
        </li>
        <li>
          <span className="font-semibold">{m.tenureDays}</span>
        </li>
      </ul>

      <div className="mt-4 flex flex-col gap-2">
        <a
          href={sharePath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-loom-primary text-base font-semibold text-white"
        >
          <ExternalLink className="size-5" aria-hidden />
          {t("record.open")}
        </a>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-loom-border text-base font-semibold text-loom-primary"
        >
          <Copy className="size-5" aria-hidden />
          {copied ? t("record.copied") : t("record.copyLink")}
        </button>
        <a
          href={sharePath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-loom-border text-base font-semibold text-loom-ink"
        >
          <Printer className="size-5" aria-hidden />
          {t("record.print")}
        </a>
      </div>
    </section>
  );
}
