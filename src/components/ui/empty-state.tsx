import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-14 text-center", className)}>
      <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-muted)]">
        <Icon className="h-5 w-5 text-[var(--color-ink-400)]" />
      </div>
      <p className="text-sm font-medium text-[var(--color-ink-700)]">{title}</p>
      {description && <p className="max-w-sm text-sm text-[var(--color-ink-500)]">{description}</p>}
    </div>
  );
}
