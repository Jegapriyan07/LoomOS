/**
 * Shared pitch-friendly explainers for Plan / Money / Buyer surfaces.
 * Plain English for demo judges; keeps the story above the controls.
 */

export function PitchHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <header className="rounded-2xl border border-loom-border bg-gradient-to-br from-loom-primary-soft/80 via-loom-surface to-loom-bg px-4 py-4 shadow-[var(--loom-shadow)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-loom-primary">
        {eyebrow}
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-loom-display)] text-weaver-xl font-semibold leading-snug text-loom-ink">
        {title}
      </h1>
      <p className="mt-2 text-base leading-snug text-loom-muted">{body}</p>
    </header>
  );
}

export function PitchSteps({
  steps,
  active,
}: {
  steps: { n: number; label: string }[];
  active?: number;
}) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="How this screen works">
      {steps.map((s) => {
        const on = active === s.n;
        return (
          <li
            key={s.n}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
              on
                ? "border-loom-primary bg-loom-primary text-white"
                : "border-loom-border bg-loom-surface text-loom-ink"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                on ? "bg-white/20" : "bg-loom-primary-soft text-loom-primary"
              }`}
            >
              {s.n}
            </span>
            {s.label}
          </li>
        );
      })}
    </ol>
  );
}

export function PitchStepBlock({
  step,
  title,
  hint,
  children,
}: {
  step?: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-loom-border bg-loom-surface p-4">
      <div className="mb-3 flex items-start gap-3">
        {step != null ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-loom-primary text-sm font-bold text-white">
            {step}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-loom-ink">{title}</h2>
          {hint ? (
            <p className="mt-0.5 text-sm leading-snug text-loom-muted">{hint}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function PitchOneLiner({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border-l-4 border-loom-primary bg-loom-primary-soft/50 px-4 py-3 text-sm font-semibold leading-snug text-loom-ink">
      {children}
    </p>
  );
}
