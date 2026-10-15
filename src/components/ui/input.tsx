import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)]",
        "focus:border-[var(--color-info-600)] focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-sm text-[var(--color-ink-900)]",
        "focus:border-[var(--color-info-600)] focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
