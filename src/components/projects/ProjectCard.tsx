import { Link } from "react-router-dom";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Money } from "@/components/ui/money";
import type { Project } from "@/types";
import { projectStatusMeta } from "@/utils/formatters";
import { formatDate } from "@/utils/formatters";

export function ProjectCard({ project }: { project: Project }) {
  const statusMeta = projectStatusMeta[project.status];
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="group h-full transition-shadow hover:shadow-[var(--shadow-panel)]">
        <div className="h-1.5 w-full rounded-t-xl" style={{ backgroundColor: project.coverColor }} />
        <div className="p-5">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-[var(--color-ink-900)]">{project.name}</h3>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-ink-400)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-800)]" />
          </div>
          <p className="mb-3 flex items-center gap-1 text-xs text-[var(--color-ink-500)]">
            <MapPin className="h-3 w-3 shrink-0" />
            {project.address}
          </p>
          <div className="mb-3">
            <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
          </div>

          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-ink-500)]">
              <span>Готовность</span>
              <span className="tnum font-medium text-[var(--color-ink-700)]">{project.completionPercent}%</span>
            </div>
            <Progress value={project.completionPercent} tone="info" />
          </div>

          <div className="grid grid-cols-2 gap-y-2 border-t border-[var(--color-border)] pt-3 text-xs">
            <div>
              <div className="text-[var(--color-ink-500)]">Бюджет</div>
              <Money amount={project.budgetTotal} compact className="font-medium text-[var(--color-ink-900)]" />
            </div>
            <div>
              <div className="text-[var(--color-ink-500)]">Потрачено</div>
              <Money amount={project.spentTotal} compact className="font-medium text-[var(--color-ink-900)]" />
            </div>
            <div>
              <div className="text-[var(--color-ink-500)]">Продано / всего</div>
              <span className="tnum font-medium text-[var(--color-ink-900)]">
                {project.unitsSold} / {project.unitsTotal}
              </span>
            </div>
            <div>
              <div className="text-[var(--color-ink-500)]">Свободно</div>
              <span className="tnum font-medium text-[var(--color-positive-600)]">{project.unitsFree}</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[var(--color-ink-500)]">
                <Building2 className="h-3 w-3" /> Корпусов
              </div>
              <span className="tnum font-medium text-[var(--color-ink-900)]">{project.buildingsCount}</span>
            </div>
            <div>
              <div className="text-[var(--color-ink-500)]">Сдача</div>
              <span className="font-medium text-[var(--color-ink-900)]">{formatDate(project.plannedHandoverDate)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
