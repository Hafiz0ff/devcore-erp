import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Money } from "@/components/ui/money";
import type { SupplyCard as SupplyCardType } from "@/types";
import { getProject, getStage, getSupplier } from "@/data/mockData";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";

const RISK_LABEL: Record<SupplyCardType["delayRisk"], string> = {
  none: "",
  low: "Небольшой риск задержки",
  medium: "Средний риск задержки",
  high: "Высокий риск задержки",
};

export function SupplyPipelineCard({ card }: { card: SupplyCardType }) {
  const project = getProject(card.projectId);
  const stage = getStage(card.stageId);
  const supplier = getSupplier(card.supplierId);

  return (
    <Card className="p-3 shadow-none hover:shadow-[var(--shadow-card)]">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="text-[13px] font-semibold leading-snug text-[var(--color-ink-900)]">{card.material}</div>
        {card.delayRisk !== "none" && (
          <AlertTriangle
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              card.delayRisk === "high" ? "text-[var(--color-risk-600)]" : "text-[var(--color-warn-600)]"
            )}
          />
        )}
      </div>
      <div className="mb-2 text-[11.5px] text-[var(--color-ink-500)]">
        {card.quantity} {card.unit} · {project?.name}
      </div>
      <div className="mb-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[var(--color-ink-500)]">
        <span>{stage?.name}</span>
        <span>{supplier?.name}</span>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-2">
        <span className="text-[11px] text-[var(--color-ink-500)]">К {formatDate(card.neededByDate)}</span>
        <Money amount={card.amount} compact className="text-[12px] font-semibold" />
      </div>
      {card.delayRisk !== "none" && (
        <div
          className={cn(
            "mt-2 rounded-md px-2 py-1 text-[10.5px] font-medium",
            card.delayRisk === "high"
              ? "bg-[var(--color-risk-100)] text-[var(--color-risk-700)]"
              : "bg-[var(--color-warn-100)] text-[var(--color-warn-700)]"
          )}
        >
          {RISK_LABEL[card.delayRisk]}
        </div>
      )}
    </Card>
  );
}
