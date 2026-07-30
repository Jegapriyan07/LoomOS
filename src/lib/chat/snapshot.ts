/**
 * Client loader for Loom assistant snapshot — shared by Home chat + Voice FAB.
 */

import {
  buildSnapshot,
  type LoomSnapshot,
} from "@/lib/chat/assistant";
import type { Recommendation } from "@/lib/types";
import type { PaymentOrder } from "@/lib/payments/types";
import type { WeaverStock } from "@/lib/demand/stock";
import type { BuyerRequirement } from "@/lib/demand/types";
import { cachedJson, peekCached } from "@/lib/client-cache";

export async function fetchLoomSnapshot(): Promise<LoomSnapshot> {
  const [recommendation, ordersData, me, stockData, requirements] =
    await Promise.all([
      cachedJson<Recommendation>("/api/recommendations/today").catch(
        () =>
          peekCached<Recommendation>("/api/recommendations/today") ?? null,
      ),
      cachedJson<{ orders: { order: PaymentOrder }[] }>("/api/orders").catch(
        () =>
          peekCached<{ orders: { order: PaymentOrder }[] }>("/api/orders") ?? {
            orders: [] as { order: PaymentOrder }[],
          },
      ),
      cachedJson<{
        user?: {
          name?: string;
          weaver?: { name?: string; region?: string };
        };
      }>("/api/auth/me").catch(
        () =>
          peekCached<{
            user?: {
              name?: string;
              weaver?: { name?: string; region?: string };
            };
          }>("/api/auth/me") ?? null,
      ),
      cachedJson<{ stock: WeaverStock }>("/api/stock").catch(
        () => peekCached<{ stock: WeaverStock }>("/api/stock") ?? null,
      ),
      cachedJson<BuyerRequirement[]>("/api/admin/requirements").catch(
        () =>
          peekCached<BuyerRequirement[]>("/api/admin/requirements") ??
          ([] as BuyerRequirement[]),
      ),
    ]);

  const region = me?.user?.weaver?.region?.toLowerCase();
  const openReqs = (Array.isArray(requirements) ? requirements : []).filter(
    (r) =>
      r.status === "open" &&
      (!region || r.region.toLowerCase() === region),
  );

  return buildSnapshot(
    recommendation,
    ordersData.orders ?? [],
    me?.user?.name ?? me?.user?.weaver?.name ?? null,
    stockData?.stock ?? null,
    openReqs.length,
  );
}
