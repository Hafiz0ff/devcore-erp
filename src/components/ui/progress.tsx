import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  tone?: "brand" | "positive" | "warn" | "risk" | "info";
}

const toneBg: Record<NonNullable<ProgressProps["tone"]>, string> = {
  brand: "bg-[var(--color-brand-800)]",
  positive: "bg-[var(--color-positive-600)]",
  warn: "bg-[var(--color-warn-600)]",
  risk: "bg-[var(--color-risk-600)]",
  info: "bg-[var(--color-info-600)]",
};

export function Progress({ value, className, tone = "brand" }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]", className)}>
      <div className={cn("h-full rounded-full transition-all", toneBg[tone])} style={{ width: `${clamped}%` }} />
    </div>
  );
}
