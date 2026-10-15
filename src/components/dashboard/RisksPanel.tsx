import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { RiskItem } from "@/data/selectors";
import { cn } from "@/lib/utils";

interface Props {
  risks: RiskItem[];
}

const severityStyles = {
  high: { icon: AlertTriangle, iconClass: "text-[var(--color-risk-600)]", bgClass: "bg-[var(--color-risk-100)]" },
  medium: { icon: AlertCircle, iconClass: "text-[var(--color-warn-600)]", bgClass: "bg-[var(--color-warn-100)]" },
  low: { icon: Info, iconClass: "text-[var(--color-info-600)]", bgClass: "bg-[var(--color-info-100)]" },
} as const;

export function RisksPanel({ risks }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Риски</CardTitle>
        <span className="text-xs font-medium text-[var(--color-ink-500)]">{risks.length} активных</span>
      </CardHeader>
      <CardContent className="pt-3">
        {risks.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--color-ink-500)]">Активных рисков не обнаружено</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {risks.map((risk) => {
              const meta = severityStyles[risk.severity];
              const Icon = meta.icon;
              return (
                <li key={risk.id} className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] p-3">
                  <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", meta.bgClass)}>
                    <Icon className={cn("h-4 w-4", meta.iconClass)} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-[var(--color-ink-900)]">{risk.title}</div>
                    <div className="text-xs text-[var(--color-ink-500)]">{risk.detail}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
