import {
  addCalendarDays,
  parseDateOnly,
  toDateOnly,
  type CategoryDuration,
  type PlanBuffers,
} from "@/lib/production-defaults";

export type ReverseScheduleInput = {
  targetDate: string; // YYYY-MM-DD
  category: CategoryDuration;
  buffers: PlanBuffers;
};

export type ReverseSchedule = {
  targetDate: string;
  dispatchDate: string;
  finishProductionDate: string;
  startWeavingDate: string;
  yarnPurchaseDate: string;
  expectedPaymentDate: string;
  /** Inputs used — shown so the math is never a black box */
  used: {
    weavingDays: number;
    qcPackingDays: number;
    shippingDays: number;
    yarnProcurementDays: number;
    settlementStubDays: number;
  };
};

/**
 * Backward math (calendar days), Stage 2:
 *   Dispatch = Target − shipping buffer
 *   Finish Production = Dispatch − QC/packing buffer
 *   Start Weaving = Finish Production − category weaving days
 *   Yarn Purchase = Start Weaving − yarn procurement lead time
 *   Expected Payment = Dispatch + settlement stub (Dispatch + 2 until Stage 4)
 */
export function calculateReverseSchedule(
  input: ReverseScheduleInput,
): ReverseSchedule {
  const { targetDate, category, buffers } = input;
  const weavingDays = category.weavingDaysForPlan;
  const { qcPackingDays, shippingDays, yarnProcurementForPlan, settlementStubDays } =
    buffers;

  const target = parseDateOnly(targetDate);
  const dispatch = addCalendarDays(target, -shippingDays);
  const finish = addCalendarDays(dispatch, -qcPackingDays);
  const startWeaving = addCalendarDays(finish, -weavingDays);
  const yarnPurchase = addCalendarDays(startWeaving, -yarnProcurementForPlan);
  const expectedPayment = addCalendarDays(dispatch, settlementStubDays);

  return {
    targetDate: toDateOnly(target),
    dispatchDate: toDateOnly(dispatch),
    finishProductionDate: toDateOnly(finish),
    startWeavingDate: toDateOnly(startWeaving),
    yarnPurchaseDate: toDateOnly(yarnPurchase),
    expectedPaymentDate: toDateOnly(expectedPayment),
    used: {
      weavingDays,
      qcPackingDays,
      shippingDays,
      yarnProcurementDays: yarnProcurementForPlan,
      settlementStubDays,
    },
  };
}
