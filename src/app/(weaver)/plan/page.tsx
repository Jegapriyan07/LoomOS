import { ReverseProductionPlanner } from "@/components/weaver/ReverseProductionPlanner";
import { StockResourcesCard } from "@/components/weaver/StockResourcesCard";

export default function PlanPage() {
  return (
    <>
      <ReverseProductionPlanner />
      <div className="px-4 pb-8">
        <StockResourcesCard />
      </div>
    </>
  );
}
