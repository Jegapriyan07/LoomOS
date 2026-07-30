import { ReverseProductionPlanner } from "@/components/weaver/ReverseProductionPlanner";
import { StockResourcesCard } from "@/components/weaver/StockResourcesCard";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{
    requirementId?: string | string[];
    festivalId?: string | string[];
  }>;
}) {
  const sp = await searchParams;
  const raw = sp.requirementId;
  const requirementId = Array.isArray(raw) ? raw[0] : raw;
  const festRaw = sp.festivalId;
  const festivalId = Array.isArray(festRaw) ? festRaw[0] : festRaw;

  return (
    <>
      <ReverseProductionPlanner
        initialRequirementId={requirementId}
        initialFestivalId={festivalId}
      />
      <div className="px-4 pb-8">
        <StockResourcesCard />
      </div>
    </>
  );
}
