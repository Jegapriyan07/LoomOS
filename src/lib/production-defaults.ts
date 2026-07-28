/**
 * Illustrative production-time defaults for reverse scheduling.
 * NOT verified research — cooperatives must correct these in-app.
 * Demo / Simulated sample data until a co-op replaces them.
 */

export type ItemCategoryId =
  | "cotton-saree"
  | "silk-saree"
  | "stole-dupatta"
  | "dhoti-angavastram";

export type CategoryDuration = {
  id: ItemCategoryId;
  label: string;
  /** Illustrative range (shown in UI) */
  weavingDaysMin: number;
  weavingDaysMax: number;
  /** Days used in backward math — editable; defaults to range max (safer plan) */
  weavingDaysForPlan: number;
};

export type PlanBuffers = {
  /** Days for QC/packing before dispatch */
  qcPackingDays: number;
  /** Days shipping before the target/festival date */
  shippingDays: number;
  yarnProcurementMin: number;
  yarnProcurementMax: number;
  /** Days used in math — editable; defaults to range max */
  yarnProcurementForPlan: number;
  /**
   * Stub until Stage 4 wires the real settlement window.
   * Expected Payment = Dispatch + settlementStubDays
   */
  settlementStubDays: number;
};

export type ProductionDefaults = {
  categories: CategoryDuration[];
  buffers: PlanBuffers;
};

export const DEFAULT_PRODUCTION: ProductionDefaults = {
  categories: [
    {
      id: "cotton-saree",
      label: "Cotton saree",
      weavingDaysMin: 4,
      weavingDaysMax: 6,
      weavingDaysForPlan: 6,
    },
    {
      id: "silk-saree",
      label: "Silk saree (complex / zari)",
      weavingDaysMin: 15,
      weavingDaysMax: 20,
      weavingDaysForPlan: 20,
    },
    {
      id: "stole-dupatta",
      label: "Stole / dupatta",
      weavingDaysMin: 2,
      weavingDaysMax: 4,
      weavingDaysForPlan: 4,
    },
    {
      id: "dhoti-angavastram",
      label: "Dhoti / angavastram",
      weavingDaysMin: 2,
      weavingDaysMax: 3,
      weavingDaysForPlan: 3,
    },
  ],
  buffers: {
    qcPackingDays: 2,
    shippingDays: 3,
    yarnProcurementMin: 5,
    yarnProcurementMax: 7,
    yarnProcurementForPlan: 7,
    // Stage 4: modeled on RBI PA T+1 working-day settlement window (simulated)
    settlementStubDays: 1,
  },
};

export type SampleFestival = {
  id: string;
  /** Plain label — sample calendar only, not an official festival feed */
  name: string;
  /** YYYY-MM-DD */
  date: string;
};

/** Relative sample dates so a "nearby" festival always exists in the demo. */
export function getSampleFestivalCalendar(from: Date = new Date()): SampleFestival[] {
  return [
    {
      id: "sample-near",
      name: "Nearby festival season (sample)",
      date: toDateOnly(addCalendarDays(from, 21)),
    },
    {
      id: "sample-later",
      name: "Later festival season (sample)",
      date: toDateOnly(addCalendarDays(from, 45)),
    },
  ];
}

export function toDateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function addCalendarDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatDisplayDate(dateOnly: string): string {
  const d = parseDateOnly(dateOnly);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
