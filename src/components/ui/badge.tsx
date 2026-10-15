import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/utils/formatters";

const toneClasses: Record<Tone, string> = {
  default: "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]",
  positive: "bg-[var(--color-positive-100)] text-[var(--color-positive-700)]",
  risk: "bg-[var(--color-risk-100)] text-[var(--color-risk-700)]",
  warn: "bg-[var(--color-warn-100)] text-[var(--color-warn-700)]",
  info: "bg-[var(--color-info-100)] text-[var(--color-info-700)]",
  muted: "bg-[var(--color-surface-muted)] text-[var(--color-ink-500)] border border-[var(--color-border)]",
};

const dotClasses: Record<Tone, string> = {
  default: "bg-[var(--color-brand-700)]",
  positive: "bg-[var(--color-positive-600)]",
  risk: "bg-[var(--color-risk-600)]",
  warn: "bg-[var(--color-warn-600)]",
  info: "bg-[var(--color-info-600)]",
  muted: "bg-[var(--color-ink-400)]",
};

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function StatusBadge({ tone = "default", dot = true, className, children, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[tone])} />}
      {children}
    </span>
  );
}
