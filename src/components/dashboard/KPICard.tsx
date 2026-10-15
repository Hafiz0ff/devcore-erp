import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "default" | "positive" | "risk" | "warn" | "info";

interface KPICardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  delta?: string;
  trend?: "up" | "down" | "flat";
  tone?: Tone;
  hint?: string;
}

const toneIconBg: Record<Tone, string> = {
  default: "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]",
  positive: "bg-[var(--color-positive-100)] text-[var(--color-positive-700)]",
  risk: "bg-[var(--color-risk-100)] text-[var(--color-risk-700)]",
  warn: "bg-[var(--color-warn-100)] text-[var(--color-warn-700)]",
  info: "bg-[var(--color-info-100)] text-[var(--color-info-700)]",
};

export function KPICard({ label, value, icon: Icon, delta, trend, tone = "default", hint }: KPICardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[12.5px] font-medium text-[var(--color-ink-500)]">{label}</span>
        {Icon && (
          <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", toneIconBg[tone])}>
            <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="tnum mt-2 text-[21px] font-semibold leading-none text-[var(--color-ink-900)]">{value}</div>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              trend === "up" && "text-[var(--color-positive-600)]",
              trend === "down" && "text-[var(--color-risk-600)]",
              trend === "flat" && "text-[var(--color-ink-500)]"
            )}
          >
            {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
            {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </span>
        )}
        {hint && <span className="text-xs text-[var(--color-ink-400)]">{hint}</span>}
      </div>
    </Card>
  );
}
