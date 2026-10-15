import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-[var(--color-brand-800)] text-white hover:bg-[var(--color-brand-700)]",
  secondary: "bg-[var(--color-surface-muted)] text-[var(--color-ink-900)] border border-[var(--color-border)] hover:bg-[var(--color-brand-100)]",
  outline: "bg-transparent border border-[var(--color-border-strong)] text-[var(--color-ink-700)] hover:bg-[var(--color-surface-muted)]",
  ghost: "bg-transparent text-[var(--color-ink-700)] hover:bg-[var(--color-surface-muted)]",
  danger: "bg-[var(--color-risk-600)] text-white hover:bg-[var(--color-risk-700)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  icon: "h-9 w-9 justify-center",
};

export function Button({ className, variant = "secondary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
