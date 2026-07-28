import type { LucideIcon } from "lucide-react";

type PlaceholderScreenProps = {
  /** Weaver-facing screen title — plain language only */
  title: string;
  /** Short supporting line */
  description: string;
  icon: LucideIcon;
};

/**
 * Empty stage placeholder. Content arrives in later stages.
 * Keeps one calm primary message — no secondary CTAs yet.
 */
export function PlaceholderScreen({
  title,
  description,
  icon: Icon,
}: PlaceholderScreenProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div
        className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-loom-primary-soft text-loom-primary"
        aria-hidden
      >
        <Icon className="size-8" strokeWidth={2} />
      </div>
      <h1 className="max-w-[16rem] font-[family-name:var(--font-loom-display)] text-weaver-xl font-semibold tracking-tight text-loom-ink">
        {title}
      </h1>
      <p className="mt-3 max-w-[18rem] text-weaver text-loom-muted">
        {description}
      </p>
    </section>
  );
}
