import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlanFactChart } from "@/components/dashboard/PlanFactChart";
import { ConstructionStageCard } from "@/components/construction/ConstructionStageCard";
import { StageDetailPanel } from "@/components/construction/StageDetailPanel";
import { Money } from "@/components/ui/money";
import { useScope } from "@/context/ScopeContext";
import { stages, getProject } from "@/data/mockData";
import { getStagePlanFact, getStageCostMetrics } from "@/data/selectors";

export default function ConstructionPage() {
  const { projectId } = useScope();
  const scope = useMemo(() => ({ projectId: projectId ?? undefined }), [projectId]);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  const relevantStages = useMemo(
    () => stages.filter((s) => !projectId || s.projectId === projectId).sort((a, b) => {
      if (a.projectId !== b.projectId) return a.projectId.localeCompare(b.projectId);
      return a.order - b.order;
    }),
    [projectId]
  );

  const planFact = useMemo(() => getStagePlanFact(scope), [scope]);
  const metrics = useMemo(() => getStageCostMetrics(scope), [scope]);
  const selectedStage = relevantStages.find((s) => s.id === selectedStageId) ?? null;

  return (
    <div>
      <PageHeader
        title="Этапы строительства"
        description="Сколько денег уходит на каждый этап и как соблюдаются сроки"
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricTile label="Котлован" value={metrics.excavationCost} />
        <MetricTile label="Фундамент" value={metrics.foundationCost} />
        <MetricTile label="1 этаж (монолит)" value={metrics.avgFloorCost} />
        <MetricTile label="Монолит / м²" value={metrics.monolithPerSqm} />
        <MetricTile label="Кладка / м²" value={metrics.masonryPerSqm} />
        <MetricTile label="Фасад / м²" value={metrics.facadePerSqm} />
      </div>

      <Card className="mb-5">
        <CardHeader>
          <div>
            <CardTitle>План / факт по этапам</CardTitle>
            <CardDescription>Плановый бюджет против фактических расходов</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <PlanFactChart data={planFact} horizontal />
        </CardContent>
      </Card>

      <div className="mb-3 text-sm font-semibold text-[var(--color-ink-900)]">Карточки этапов</div>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {relevantStages.map((stage) => (
          <ConstructionStageCard
            key={stage.id}
            stage={stage}
            selected={stage.id === selectedStageId}
            onClick={() => setSelectedStageId(stage.id === selectedStageId ? null : stage.id)}
            projectName={!projectId ? getProject(stage.projectId)?.name : undefined}
          />
        ))}
      </div>

      {selectedStage && (
        <div>
          <div className="mb-3 text-sm font-semibold text-[var(--color-ink-900)]">
            Подробности этапа: {selectedStage.name}
          </div>
          <StageDetailPanel stage={selectedStage} />
        </div>
      )}
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-[var(--shadow-card)]">
      <div className="text-[11.5px] text-[var(--color-ink-500)]">{label}</div>
      <Money amount={value} compact className="mt-1 block text-[16px] font-semibold text-[var(--color-ink-900)]" />
    </div>
  );
}
