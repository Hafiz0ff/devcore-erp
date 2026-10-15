import { Calendar, User, HardHat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Money } from "@/components/ui/money";
import type { ConstructionStage } from "@/types";
import { stageStatusMeta, formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface Props {
  stage: ConstructionStage;
  onClick?: () => void;
  selected?: boolean;
  projectName?: string;
}

export function ConstructionStageCard({ stage, onClick, selected, projectName }: Props) {
  const meta = stageStatusMeta[stage.status];
  const variance = stage.spentActual - stage.budgetPlanned;
  const progressTone = stage.status === "delayed" ? "risk" : stage.status === "completed" ? "positive" : "info";

  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer p-4 transition-all hover:shadow-[var(--shadow-panel)]",
        selected && "border-[var(--color-brand-800)] ring-1 ring-[var(--color-brand-800)]"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-medium text-[var(--color-ink-400)]">
            Этап {stage.order.toString().padStart(2, "0")}
            {projectName && ` · ${projectName}`}
          </div>
          <h4 className="text-[14.5px] font-semibold text-[var(--color-ink-900)]">{stage.name}</h4>
        </div>
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      </div>

      <div className="mb-2.5">
        <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-ink-500)]">
          <span>Выполнено</span>
          <span className="tnum font-medium text-[var(--color-ink-700)]">{stage.progressPercent}%</span>
        </div>
        <Progress value={stage.progressPercent} tone={progressTone} />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-y-1.5 text-xs">
        <div className="text-[var(--color-ink-500)]">План</div>
        <Money amount={stage.budgetPlanned} compact className="text-right font-medium text-[var(--color-ink-900)]" />
        <div className="text-[var(--color-ink-500)]">Факт</div>
        <Money amount={stage.spentActual} compact className="text-right font-medium text-[var(--color-ink-900)]" />
        <div className="text-[var(--color-ink-500)]">Отклонение</div>
        <Money amount={variance} compact signColor className="text-right font-medium" />
      </div>

      <div className="flex flex-col gap-1 border-t border-[var(--color-border)] pt-2.5 text-[11.5px] text-[var(--color-ink-500)]">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          {formatDate(stage.startDatePlanned)} – {formatDate(stage.endDateActual ?? stage.endDatePlanned)}
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3" />
          {stage.responsible}
        </div>
        <div className="flex items-center gap-1.5">
          <HardHat className="h-3 w-3" />
          {stage.contractors.join(", ")}
        </div>
      </div>
    </Card>
  );
}
